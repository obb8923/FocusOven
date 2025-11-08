import React from "react";
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Text } from "@component/Text";

export type LevelStatusModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  level: number;
  experience: number;
};

export const LevelStatusModal = ({
  visible,
  onRequestClose,
  level,
  experience,
}: LevelStatusModalProps) => {
  const displayLevel = Math.max(0, level - 1);
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <TouchableWithoutFeedback onPress={(event) => event.stopPropagation()}>
            <View className="bg-white rounded-xl w-full max-w-sm gap-y-5 p-6 items-center">
              <View className="w-full px-4 py-3 items-center gap-y-1">
                <Text text={`제빵사 레벨: Lv.${displayLevel}`} type="title4" className="text-gray-900 font-semibold" />
                <Text text={`총 경험치: ${experience} XP`} className="text-gray-700" />
              </View>
              <TouchableOpacity
                onPress={onRequestClose}
                className="w-full rounded-lg px-4 py-3 items-center bg-primary"
                activeOpacity={0.85}
              >
                <Text text="확인" className="text-white font-semibold" />
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};


