import React, { useMemo, useState } from 'react';
import { Modal, ScrollView, TouchableOpacity, TouchableWithoutFeedback, View } from 'react-native';
import { Text } from '@component/Text';
import { BreadImage } from '@component/BreadImage';
import { BREADS } from '@constant/breads';
import { TimerStatus } from '@store/timerStore';
import { useGetBakerLevel, useGetSelectedBreadKey, useSetSelectedBread } from '@store/bakerStore';

type OvenSettingsModalProps = {
  visible: boolean;
  status: TimerStatus;
  onStartPress: () => void;
  onRequestClose: () => void;
};

export const OvenSettingsModal = ({ visible, status, onStartPress, onRequestClose }: OvenSettingsModalProps) => {
  const level = useGetBakerLevel();
  const selectedBreadKey = useGetSelectedBreadKey();
  const setSelectedBread = useSetSelectedBread();
  const [containerWidth, setContainerWidth] = useState(0);

  const horizontalGap = 12;
  const columns = 4;

  const breadItemWidth = useMemo(() => {
    if (containerWidth <= 0) {
      return undefined;
    }
    const totalGap = horizontalGap * (columns - 1);
    return (containerWidth - totalGap) / columns;
  }, [containerWidth, horizontalGap, columns]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View className="flex-1 bg-black/40 justify-center items-center px-6">
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View className="w-full bg-white rounded-3xl px-4 py-8">
              <View className="w-full flex-row items-center justify-between mb-6">
                <Text text="빵 선택" type="title1" className="text-2xl font-bold" />
                <TouchableOpacity
                  onPress={onRequestClose}
                  className="px-3 py-2 rounded-full"
                  activeOpacity={0.85}
                >
                  <Text text="닫기" type="body1" className="text-gray-500 font-semibold" />
                </TouchableOpacity>
              </View>

              <View
                className="w-full"
                onLayout={(event) => setContainerWidth(event.nativeEvent.layout.width)}
              >
                <ScrollView
                  className="max-h-80"
                  contentContainerStyle={{
                    flexDirection: 'row',
                    flexWrap: 'wrap',
                    rowGap: 16,
                    columnGap: horizontalGap,
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
                        />
                        </View>
                        <Text
                          text={bread.koName}
                          type="caption1"
                          className="text-center text-gray-800"
                        />
                      </View>
                    </TouchableOpacity>
                  ))}
                </ScrollView>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

