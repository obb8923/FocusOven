import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { View, TouchableOpacity, Modal, TouchableWithoutFeedback, LayoutChangeEvent } from 'react-native';
import { Portal } from '@gorhom/portal';
import { Text } from '@component/Text';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';

export type TimeInputModalProps = {
  visible: boolean;
  onClose: () => void;
  initialMinutes: string;
  initialSeconds: string;
  onConfirm: (minutes: string, seconds: string) => void;
};

export const TimeInputModal = ({
  visible,
  onClose,
  initialMinutes,
  initialSeconds: _initialSeconds,
  onConfirm,
}: TimeInputModalProps) => {
  const MIN_MINUTE = 20;
  const MAX_MINUTE = 120;
  const STEP = 5;
  const ITEM_WIDTH = 84;

  const minuteOptions = useMemo(
    () =>
      Array.from({ length: Math.floor((MAX_MINUTE - MIN_MINUTE) / STEP) + 1 }).map(
        (_, index) => MIN_MINUTE + index * STEP
      ),
    []
  );

  const getInitialIndex = useCallback(
    (minutes: string) => {
      const parsedMinute = Math.max(MIN_MINUTE, Math.min(Number(minutes) || MIN_MINUTE, MAX_MINUTE));
      const adjustedMinute =
        Math.round((parsedMinute - MIN_MINUTE) / STEP) * STEP + MIN_MINUTE;
      const foundIndex = minuteOptions.findIndex((value) => value === adjustedMinute);
      return foundIndex >= 0 ? foundIndex : 0;
    },
    [minuteOptions]
  );

  const [selectedIndex, setSelectedIndex] = useState<number>(() => getInitialIndex(initialMinutes));
  const [containerWidth, setContainerWidth] = useState<number>(0);
  const carouselRef = useRef<ICarouselInstance | null>(null);
  const carouselWidth = useMemo(
    () => (containerWidth > 0 ? containerWidth : ITEM_WIDTH * 3),
    [containerWidth]
  );
  useEffect(() => {
    if (!visible || carouselWidth === 0) return;
    const index = getInitialIndex(initialMinutes);
    setSelectedIndex(index);
    requestAnimationFrame(() => {
      carouselRef.current?.scrollTo({ index, animated: false });
    });
  }, [visible, initialMinutes, getInitialIndex, carouselWidth]);

  const handleSelect = (index: number) => {
    setSelectedIndex(index);
    carouselRef.current?.scrollTo({ index, animated: true });
  };

  const handleConfirm = () => {
    const selectedMinutes = minuteOptions[selectedIndex] ?? MIN_MINUTE;
    onConfirm(selectedMinutes.toString(), '00');
    onClose();
  };

  const renderCarousel = () => (
      <View
        className="w-full relative items-center justify-center"
        onLayout={(event: LayoutChangeEvent) => setContainerWidth(event.nativeEvent.layout.width)}
      >
        <Carousel
          ref={carouselRef}
          loop={false}
          width={ITEM_WIDTH}
          height={42}
          data={minuteOptions}
          defaultIndex={selectedIndex}
          onSnapToItem={(index) => setSelectedIndex(index)}
          style={{
            width: carouselWidth,
            alignSelf: 'center',
            justifyContent: 'center',
          }}
          renderItem={({ item, index }) => {
            const isSelected = index === selectedIndex;
            return (
              <TouchableOpacity className="mx-2" onPress={() => handleSelect(index)} activeOpacity={0.85}>
                <View
                  className={`h-12 justify-center items-center rounded-xl ${
                    isSelected
                      ? 'bg-primary'
                      : 'bg-gray-200'
                  }`}
                >
                  <Text
                    text={`${item}분`}
                    className={`font-semibold ${
                      isSelected ? 'text-white' : 'text-gray-700'
                    }`}
                  />
                </View>
              </TouchableOpacity>
            );
          }}
        />
      </View>
  );

  return (
    <Portal>
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View className="flex-1 bg-black/50 justify-center items-center">
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View className="bg-white rounded-xl w-full max-w-sm gap-y-6 p-6">
                <Text text="집중 시간 설정" type="title3" className="text-center" />

                {renderCarousel()}

                <View className="flex-row w-full gap-x-4 justify-between items-center">
                  <TouchableOpacity
                    onPress={onClose}
                    className="flex-1 rounded-lg px-4 py-3 items-center bg-neutral-200"
                  >
                    <Text text="취소" className="text-gray-700 font-semibold" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleConfirm}
                    className="flex-1 rounded-lg px-4 py-3 items-center bg-primary"
                  >
                    <Text text="확인" className="text-white font-semibold" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Portal>
  );
};

