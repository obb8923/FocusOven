import React, { useMemo } from 'react';
import { Modal, FlatList, TouchableOpacity, TouchableWithoutFeedback, View, useWindowDimensions } from 'react-native';
import { useTranslation } from "react-i18next";
import { Text } from '@component/Text';
import { BreadImage } from '@component/BreadImage';
import { BREADS } from '@constant/breads';
import { TimerStatus } from '@store/timerStore';
import { useGetBakerLevel, useGetSelectedBreadKey, useSetSelectedBread } from '@store/bakerStore';
import { Portal } from '@gorhom/portal';
import LinearGradient from 'react-native-linear-gradient';

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
  const { width: windowWidth } = useWindowDimensions();
  const { t } = useTranslation();

  const horizontalGap = 12;
  const horizontalPadding = 8;
  const columns = 4;
  
  // 모달 너비 비율 (80%)
  const modalWidthRatio = 0.8;
  // LinearGradient 내부 패딩
  const gradientPadding = 8;
  // FlatList columnWrapperStyle 좌우 패딩
  const flatListHorizontalPadding = horizontalPadding * 2;

  const breadItemWidth = useMemo(() => {
    // LinearGradient 실제 너비 (화면 너비의 80%)
    const modalWidth = windowWidth * modalWidthRatio;
    // LinearGradient 내부 좌우 패딩 제외
    const availableWidth = modalWidth - (gradientPadding * 2) - flatListHorizontalPadding;
    // 아이템 간 간격 총합 (4개 아이템이므로 간격은 3개)
    const totalGap = horizontalGap * (columns - 1);
    // 4등분하여 각 아이템 너비 계산
    return (availableWidth - totalGap) / columns;
  }, [windowWidth, modalWidthRatio, gradientPadding, flatListHorizontalPadding, horizontalGap, columns]);

  return (
    
    <Portal>
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            {/* 전체 컨테이너 */}
            <LinearGradient 
                          style={{
                            width: '80%',
                            height: 'auto',
                            maxHeight: '60%',
                            borderRadius: 28,
                            borderWidth: 1,
                            borderColor: '#0763f6',
                          }}

            start={{ x: 0, y: 1 }}
            end={{ x: 0, y: 0 }}
            colors={['#0763f6', '#527dfe']}
            >
              <View className="w-full h-full" style={{ padding: gradientPadding }}>
              {/* 헤더 */}
              <View className="w-full items-center justify-center mb-2 py-2 px-4 flex-row justify-between">
                <Text text={t("oven.selectBreadTitle")} type="title4" className="text-center text-blue-ribbon-50" />
              </View>
              
            <View className="bg-white overflow-hidden" style={{ borderRadius: 24, flex: 1 }}>

                <FlatList
                  data={BREADS}
                  numColumns={4}
                  keyExtractor={(item) => item.key}
                  renderItem={({ item: bread }) => (
                    <TouchableOpacity
                      disabled={bread.level > level}
                      activeOpacity={0.8}
                      onPress={() => setSelectedBread(bread.key)}
                      className="items-center"
                      style={{ width: breadItemWidth ,height: breadItemWidth}}
                    >
                        <BreadImage
                          source={bread.source}
                          selected={selectedBreadKey === bread.key}
                          locked={bread.level > level}
                          requiredLevel={bread.level}
                          breadName={t(`bread.${bread.key}.name`)}
                        />
                       
                    
                    </TouchableOpacity>
                  )}
                  columnWrapperStyle={{
                    paddingHorizontal: horizontalPadding,
                    gap: horizontalGap,
                  }}
                  contentContainerStyle={{
                    paddingVertical: horizontalPadding,
                    rowGap: 8,
                  }}
                  showsVerticalScrollIndicator={false}
                  style={{ flex: 1 }}
                />



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

