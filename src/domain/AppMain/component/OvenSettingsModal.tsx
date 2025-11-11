import React, { useRef, useState, useEffect, useMemo, useCallback } from 'react';
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View, LayoutChangeEvent, Image, ImageSourcePropType } from 'react-native';
import { useTranslation } from "react-i18next";
import { Text } from '@component/Text';
import { BREADS } from '@constant/breads';
import { TimerStatus } from '@store/timerStore';
import { useGetBakerLevel, useGetSelectedBreadKey, useSetSelectedBread } from '@store/bakerStore';
import { Portal } from '@gorhom/portal';
import LinearGradient from 'react-native-linear-gradient';
import Carousel, { ICarouselInstance } from 'react-native-reanimated-carousel';

type OvenSettingsModalProps = {
  visible: boolean;
  status: TimerStatus;
  onStartPress: () => void;
  onRequestClose: () => void;
};

export const OvenSettingsModal = ({ visible, status: _status, onStartPress: _onStartPress, onRequestClose }: OvenSettingsModalProps) => {
  const level = useGetBakerLevel();
  const selectedBreadKey = useGetSelectedBreadKey();
  const setSelectedBread = useSetSelectedBread();
  const { t } = useTranslation();

  const ITEM_HEIGHT = 64;
  const VISIBLE_ITEM_COUNT = 5;
  const IMAGE_SIZE = 48;

  const [containerWidth, setContainerWidth] = useState<number>(0);
  const [containerHeight, setContainerHeight] = useState<number>(0);
  const carouselRef = useRef<ICarouselInstance | null>(null);

  const carouselWidth = useMemo(
    () => (containerWidth > 0 ? containerWidth : 300),
    [containerWidth]
  );
  const carouselHeight = useMemo(
    () => (containerHeight > 0 ? containerHeight : ITEM_HEIGHT * VISIBLE_ITEM_COUNT),
    [containerHeight]
  );

  const getInitialIndex = useCallback(() => {
    const foundIndex = BREADS.findIndex((bread) => bread.key === selectedBreadKey);
    return foundIndex >= 0 ? foundIndex : 0;
  }, [selectedBreadKey]);

  const [selectedIndex, setSelectedIndex] = useState<number>(() => getInitialIndex());

  useEffect(() => {
    if (!visible || carouselWidth === 0) return;
    const index = getInitialIndex();
    setSelectedIndex(index);
    requestAnimationFrame(() => {
      carouselRef.current?.scrollTo({ index, animated: false });
    });
  }, [visible, selectedBreadKey, getInitialIndex, carouselWidth]);

  const handleSelect = (index: number) => {
    const bread = BREADS[index];
    if (bread && bread.level <= level) {
      setSelectedIndex(index);
      carouselRef.current?.scrollTo({ index, animated: true });
    }
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
        data={BREADS}
        ref={carouselRef}
        defaultIndex={selectedIndex}
        onSnapToItem={(index) => {
          setSelectedIndex(index);
          const bread = BREADS[index];
          if (bread && bread.level <= level) {
            setSelectedBread(bread.key);
          }
        }}
        renderItem={({ item: bread, index }) => {
          const isSelected = index === selectedIndex;
          const isLocked = bread.level > level;
          return (
            <TouchableOpacity
              className="py-1 w-full px-4"
              onPress={() => handleSelect(index)}
              activeOpacity={0.85}
              disabled={isLocked}
            >
              <View style={{ height: ITEM_HEIGHT }}>
                <View
                  className={`flex-1 flex-row items-center ${
                    isSelected
                      ? 'bg-gray-200'
                      : 'transparent'
                  }`}
                  style={{ borderRadius: 8 }}
                >
                  {/* 왼쪽: 빵 이미지 */}
                  <View className="items-center justify-center" style={{ width: IMAGE_SIZE, height: IMAGE_SIZE }}>
                    <Image
                      source={bread.source as ImageSourcePropType}
                      style={{
                        width: IMAGE_SIZE,
                        height: IMAGE_SIZE,
                        opacity: isLocked ? 0.3 : 1,
                      }}
                      resizeMode="contain"
                    />
                    {isLocked && (
                      <View className="absolute inset-0 items-center justify-center bg-white/50 rounded">
                        <Text text={t("common.levelShort", { level: bread.level })} type="caption1" className="text-center text-gray-800" />
                      </View>
                    )}
                  </View>
                  
                  {/* 오른쪽: 빵 이름 */}
                  <View className="flex-1 ml-3">
                    <Text
                      text={t(`bread.${bread.key}.name`)}
                      className={`font-semibold ${
                        isSelected ? 'text-gray-800' : 'text-gray-400'
                      }`}
                    />
                  </View>
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
        onRequestClose={onRequestClose}
      >
        <TouchableWithoutFeedback onPress={onRequestClose}>
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
                    <Text text={t("oven.selectBreadTitle")} type="title4" className="text-center text-blue-ribbon-50" />
                  </View>
                  
                  <View className="bg-white w-full overflow-hidden" style={{ borderRadius: 24 }}>
                    {renderCarousel()}
                    <View className="border-t border-gray-200"/>
                    <TouchableOpacity
                      onPress={onRequestClose}
                      className="px-4 py-3 items-center bg-white"
                    >
                      <Text text={t("common.confirm")} className="text-blue-ribbon-900 font-semibold" />
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

