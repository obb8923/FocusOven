import React from "react";
import { Image, Modal, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Text } from "@shared/component/Text";
import { Bread } from "@shared/constant/breads";

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
            <View className="bg-white rounded-3xl p-6 w-full max-w-sm gap-y-4">
              <Text text={bread.koName} type="title2" className="text-center" />
              <Image
                source={bread.source}
                className="w-32 h-32 self-center"
                resizeMode="contain"
              />
              <Text
                text={`필요 레벨: ${displayLevel != null ? `Lv.${displayLevel}` : '-'}`}
                type="body2"
                className="text-center text-gray-500"
              />
              <Text
                text={`보유 개수: ${ownedCount}개`}
                type="body1"
                className="text-center font-semibold"
              />
              {lastObtained ? (
                <Text
                  text={`마지막 획득: ${lastObtained}`}
                  type="body2"
                  className="text-center text-gray-600"
                />
              ) : (
                <Text text="아직 획득하지 않았어요." type="body2" className="text-center text-gray-600" />
              )}
              <Text text={bread.description} type="body2" className="text-gray-700 text-center" />
              <TouchableOpacity
                onPress={onRequestClose}
                className="mt-2 rounded-full bg-blue-500 py-3 items-center"
                activeOpacity={0.85}
              >
                <Text text="확인" type="body2" className="text-white font-semibold" />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};


