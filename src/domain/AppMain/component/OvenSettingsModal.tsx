import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
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
  const [containerWidth, setContainerWidth] = useState(0);
  const { t } = useTranslation();

  const horizontalGap = 12;
  const horizontalPadding = 8;
  const columns = 4;

  const breadItemWidth = useMemo(() => {
    if (containerWidth <= 0) {
      return undefined;
    }
    const totalGap = horizontalGap * (columns - 1);
    const totalPadding = horizontalPadding * 2;
    return (containerWidth - totalGap - totalPadding) / columns;
  }, [containerWidth, horizontalGap, horizontalPadding, columns]);

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
                            width: '100%',
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

            <View
                className="w-full"
              >
                <ScrollView
                  onLayout={(event) => {
                    setContainerWidth(event.nativeEvent.layout.width);
                  }}
                  contentContainerStyle={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    rowGap: 8,
                    columnGap: horizontalGap,
                    padding: horizontalPadding,
                  }}
                  showsVerticalScrollIndicator={false}
                >
                  {BREADS.map((bread) => (
                    <TouchableOpacity
                      key={bread.key}
                      disabled={bread.level > level}
                      activeOpacity={0.8}
                      onPress={() => setSelectedBread(bread.key)}
                      className="items-center"
                      style={breadItemWidth != null ? { width: breadItemWidth } : undefined}
                    >
                      <View className="w-full items-center">
                        <View
                          className="w-full"
                          style={{ aspectRatio: 1 }}
                        >
                        <BreadImage
                          source={bread.source}
                          selected={selectedBreadKey === bread.key}
                          locked={bread.level > level}
                          requiredLevel={bread.level}
                          breadName={t(`bread.${bread.key}.name`)}
                        />
                        </View>
                       
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>



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

