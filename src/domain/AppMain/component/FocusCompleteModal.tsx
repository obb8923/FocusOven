import React from "react";
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Text } from "@component/Text";
import { Bread } from "@shared/constant/breads";
import { BreadImage } from "@shared/component/BreadImage";

export type FocusCompleteModalProps = {
  visible: boolean;
  onRequestClose: () => void;
  selectedBread: Bread | null;
  gainedExperience?: number | null;
};

export const FocusCompleteModal = ({
  visible,
  onRequestClose,
  selectedBread,
  gainedExperience = null,
}: FocusCompleteModalProps) => {
  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View className="flex-1 bg-black/50 justify-center items-center">
          <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
            <View className="bg-white rounded-xl w-full max-w-sm gap-y-6 p-6 items-center">
            {selectedBread ? (
                <>
              <Text text={`${selectedBread?.koName}을 구웠어요!`} type="title3" className="text-center text-gray-900" />
                <View className="w-2/3 aspect-square">
                  <BreadImage source={selectedBread.source} selected={false} />
                </View>
                {typeof gainedExperience === "number" ? (
                  <View className="px-4 py-2 rounded-full bg-primary/10">
                    <Text text={`+${gainedExperience} XP`} type="title4" className="text-primary font-semibold" />
                  </View>
                ) : null}
                </>
              ) : (
                <View className="items-center">
                  <Text text="선택된 빵이 없어요." className="text-gray-600" />
                </View>
              )}
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

