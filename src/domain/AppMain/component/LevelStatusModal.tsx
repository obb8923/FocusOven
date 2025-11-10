import React from "react";
import { Modal, TouchableOpacity, TouchableWithoutFeedback, View } from "react-native";
import { Text } from "@component/Text";
import { useGetBakerExperience, useGetBakerLevel } from "@store/bakerStore";
import {Button} from "@component/Button";
import { Portal } from "@gorhom/portal";
import LinearGradient from "react-native-linear-gradient";
export type LevelStatusModalProps = {
  visible: boolean;
  onRequestClose: () => void;
};

export const LevelStatusModal = ({
  visible,
  onRequestClose,
}: LevelStatusModalProps) => {
  const level = useGetBakerLevel();
  const experience = useGetBakerExperience();
  const displayLevel = Math.max(0, level - 1);
  return (
    <Portal>
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onRequestClose}
    >
      <TouchableWithoutFeedback onPress={onRequestClose}>
        <View className="flex-1 bg-black/50 justify-center items-center px-6">
          <TouchableWithoutFeedback onPress={(event) => event.stopPropagation()}>
          
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
              </View>
            <View className="bg-white w-full overflow-hidden" style={{ borderRadius: 24 }}>

            <View className="bg-white rounded-xl w-full max-w-sm gap-y-5 p-6 items-center">
              <View className="w-full flex-row items-center justify-between">
                <Text text={`제빵사 레벨`} type="title4" className="text-gray-900" />
                <Text text={`Lv.${displayLevel}`} type="title4" className="text-blue-ribbon-900" />
              </View>
              <View className="w-full flex-row items-center justify-between">
              <Text text={`총 경험치`} className="text-gray-700" />
              <Text text={`${experience} XP`} className="text-gray-700" />
              </View>

             
              <View className="border-t border-gray-200 bg-red-500"/>
                <TouchableOpacity
                  onPress={onRequestClose}
                  className="px-4 py-3 items-center"
                >
                  <Text text="확인" className="text-blue-ribbon-900 font-semibold" />
                </TouchableOpacity>
            </View>

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


