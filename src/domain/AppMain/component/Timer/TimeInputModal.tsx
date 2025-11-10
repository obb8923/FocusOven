import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { View, TouchableOpacity, Modal, TouchableWithoutFeedback, LayoutChangeEvent } from 'react-native';
import { Portal } from '@gorhom/portal';
import { Text } from '@component/Text';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';
import LinearGradient from 'react-native-linear-gradient';
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
  const ITEM_HEIGHT = 48;
  const VISIBLE_ITEM_COUNT = 5;

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
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const carouselRef = useRef<ICarouselInstance | null>(null);
  const carouselWidth = useMemo(
    () => (containerWidth > 0 ? containerWidth : ITEM_WIDTH * 2),
    [containerWidth]
  );
  const carouselHeight = useMemo(
    () => (containerHeight > 0 ? containerHeight : ITEM_HEIGHT * VISIBLE_ITEM_COUNT),
    [containerHeight]
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
        style={{ height: ITEM_HEIGHT * VISIBLE_ITEM_COUNT }}
        onLayout={(event: LayoutChangeEvent) => {
          setContainerWidth(event.nativeEvent.layout.width);
          setContainerHeight(event.nativeEvent.layout.height);
        }}
      >
        <Carousel
          loop={false}
          vertical
          style={{
            width: carouselWidth,
            height: carouselHeight,
            alignSelf: 'center',
            justifyContent: 'center',
          }}
          height={ITEM_HEIGHT}
          pagingEnabled={false}
          data={minuteOptions}
          ref={carouselRef}
          defaultIndex={selectedIndex}
          onSnapToItem={(index) => setSelectedIndex(index)}
          renderItem={({ item, index }) => {
            const isSelected = index === selectedIndex;
            return (
              <TouchableOpacity className="py-1 w-full" onPress={() => handleSelect(index)} activeOpacity={0.85}>
                <View style={{ height: ITEM_HEIGHT }}>
                  <View
                    className={`flex-1 justify-center items-center ${
                    isSelected
                      ? 'bg-gray-200'
                      : 'transparent'
                  }`}
                  >
                    <Text
                      text={`${item}분`}
                      className={`font-semibold ${
                        isSelected ? 'text-gray-800' : 'text-gray-400'
                      }`}
                    />
                  </View>
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
          <View className="flex-1 bg-black/50 justify-center items-center px-8">
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              {/* 전체 컨테이너 */}
              <LinearGradient 
                            style={{
                              width: '90%',
                              height: 'auto',
                              borderRadius: 28,
                              borderWidth: 1,
                              borderColor: '#0763f6',
                            }}

              start={{ x: 0, y: 1 }}
              end={{ x: 0, y: 0 }}
              colors={['#0763f6', '#527dfe']}
              >
                <View className="p-2">
                {/* 헤더 */}
                <View className="w-full items-center justify-center mb-2 py-2 px-4 flex-row justify-between">
                <Text text="집중 시간 설정" type="title4" className="text-center text-blue-ribbon-50" />
                </View>
              <View className="bg-white w-full overflow-hidden" style={{ borderRadius: 24 }}>
                {renderCarousel()}
                  <View className="border-t border-gray-200"/>
                  <TouchableOpacity
                    onPress={handleConfirm}
                    className="px-4 py-3 items-center bg-white"
                  >
                    <Text text="확인" className="text-blue-ribbon-900 font-semibold" />
                  </TouchableOpacity>
              </View>
              </View>
              </LinearGradient>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Portal>
  );
};

