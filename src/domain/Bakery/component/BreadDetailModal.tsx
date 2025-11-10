import React from "react";
import { Image, Modal, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Text } from "@component/Text";
import { Bread } from "@constant/breads";
import { Button } from "@component/Button";
export type BreadDetailModalProps = {
  visible: boolean;
  bread: Bread | null;
  ownedCount: number;
  lastObtained: string | null;
  displayLevel: number | null;
  onRequestClose: () => void;
};

export const BreadDetailModal = ({
  visible,
  bread,
  ownedCount,
  lastObtained,
  displayLevel,
  onRequestClose,
}: BreadDetailModalProps) => {
  if (!bread) return null;

  return (
    <Modal
      visible={visible}
      animationType="fade"
      transparent
      onRequestClose={onRequestClose}
    >
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <TouchableWithoutFeedback onPress={(event) => event.stopPropagation()}>
            <View className="bg-white rounded-3xl p-6 w-full max-w-sm gap-y-4 items-center">
              <Image
                source={bread.source}
                className="w-32 h-32 self-center"
                resizeMode="contain"
              />
              <View className="flex-row justify-center items-end gap-x-2">
              <Text text={bread.koName} type="title2" className="text-center" />

              <Text
                text={`${displayLevel != null ? `Lv.${displayLevel}` : '-'}`}
                type="caption1"
                className="text-center text-gray-500 mb-1"
              />
              </View>
             
              <Text text={bread.description} type="body2" className="text-gray-700 text-center" />
              <Text
                text={`보유 개수: ${ownedCount}개`}
                type="body1"
                className="text-center"
              />
              <Button text="확인" onPress={onRequestClose} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};


