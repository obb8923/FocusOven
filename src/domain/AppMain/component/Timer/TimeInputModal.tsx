import React, { useState } from 'react';
import { View, TextInput, TouchableOpacity, Modal, TouchableWithoutFeedback } from 'react-native';
import { Portal } from '@gorhom/portal';
import { Text } from '@component/Text';

export type TimeInputModalProps = {
  visible: boolean;
  onClose: () => void;
  initialMinutes: string;
  initialSeconds: string;
  onConfirm: (minutes: string, seconds: string) => void;
  inline?: boolean; // 타이머 내부에 임베드할 때 카드만 렌더
};

export const TimeInputModal = ({
  visible,
  onClose,
  initialMinutes,
  initialSeconds,
  onConfirm,
  inline = false,
}: TimeInputModalProps) => {
  const [minutesInput, setMinutesInput] = useState<string>(initialMinutes);
  const [secondsInput, setSecondsInput] = useState<string>(initialSeconds);

  React.useEffect(() => {
    if (visible) {
      setMinutesInput(initialMinutes);
      setSecondsInput(initialSeconds);
    }
  }, [visible, initialMinutes, initialSeconds]);

  const handleConfirm = () => {
    onConfirm(minutesInput, secondsInput);
    onClose();
  };

  if (inline) {
    if (!visible) return null;
    return (
      <View className="bg-white rounded-xl p-4 w-full">
        <Text text="시간 설정" className="text-xl font-bold mb-4 text-center" />
        <View className="flex-row items-center mb-4">
          <View className="flex-1 mr-3">
            <Text text="분" className="mb-2 text-neutral-500" />
            <TextInput
              value={minutesInput}
              onChangeText={setMinutesInput}
              keyboardType="number-pad"
              placeholder="분"
              className="border border-neutral-300 rounded-lg px-4 py-3 text-lg"
            />
          </View>
          <View className="w-24">
            <Text text="초" className="mb-2 text-neutral-500" />
            <TextInput
              value={secondsInput}
              onChangeText={setSecondsInput}
              keyboardType="number-pad"
              placeholder="초"
              maxLength={2}
              className="border border-neutral-300 rounded-lg px-4 py-3 text-lg"
            />
          </View>
        </View>
        <View className="flex-row">
          <TouchableOpacity
            onPress={onClose}
            className="flex-1 mr-2 rounded-lg px-4 py-3 items-center bg-neutral-200"
          >
            <Text text="취소" className="text-neutral-700 font-semibold" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleConfirm}
            className="flex-1 ml-2 rounded-lg px-4 py-3 items-center bg-emerald-600"
          >
            <Text text="확인" className="text-white font-semibold" />
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <Portal>
      <Modal
        visible={visible}
        transparent={true}
        animationType="fade"
        onRequestClose={onClose}
      >
        <TouchableWithoutFeedback onPress={onClose}>
          <View className="flex-1 bg-black/50 justify-center items-center px-6">
            <TouchableWithoutFeedback onPress={(e) => e.stopPropagation()}>
              <View className="bg-white rounded-xl p-6 w-full max-w-sm">
                <Text text="시간 설정" className="text-2xl font-bold mb-6 text-center" />
                
                <View className="flex-row items-center mb-6">
                  <View className="flex-1 mr-3">
                    <Text text="분" className="mb-2 text-neutral-500" />
                    <TextInput
                      value={minutesInput}
                      onChangeText={setMinutesInput}
                      keyboardType="number-pad"
                      placeholder="분"
                      className="border border-neutral-300 rounded-lg px-4 py-3 text-lg"
                    />
                  </View>
                  <View className="w-24">
                    <Text text="초" className="mb-2 text-neutral-500" />
                    <TextInput
                      value={secondsInput}
                      onChangeText={setSecondsInput}
                      keyboardType="number-pad"
                      placeholder="초"
                      maxLength={2}
                      className="border border-neutral-300 rounded-lg px-4 py-3 text-lg"
                    />
                  </View>
                </View>

                <View className="flex-row">
                  <TouchableOpacity
                    onPress={onClose}
                    className="flex-1 mr-2 rounded-lg px-4 py-3 items-center bg-neutral-200"
                  >
                    <Text text="취소" className="text-neutral-700 font-semibold" />
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={handleConfirm}
                    className="flex-1 ml-2 rounded-lg px-4 py-3 items-center bg-emerald-600"
                  >
                    <Text text="확인" className="text-white font-semibold" />
                  </TouchableOpacity>
                </View>
              </View>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </Portal>
  );
};

