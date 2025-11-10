import React from "react";
import { Image, Modal, TouchableWithoutFeedback, View } from "react-native";
import { useTranslation } from "react-i18next";
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
  lastObtained: _lastObtained,
  displayLevel,
  onRequestClose,
}: BreadDetailModalProps) => {
  const { t } = useTranslation();

  if (!bread) return null;

  const breadName = t(`bread.${bread.key}.name`);
  const breadDescription = t(`bread.${bread.key}.description`);
  const ownedCountLabel = t("breadDetail.ownedCount", { count: ownedCount });
  const levelLabel = displayLevel != null ? t("common.levelShort", { level: displayLevel }) : "-";

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
              <Text text={breadName} type="title2" className="text-center" />

              <Text
                text={levelLabel}
                type="caption1"
                className="text-center text-gray-500 mb-1"
              />
              </View>
             
              <Text text={breadDescription} type="body2" className="text-gray-700 text-center" />
              <Text
                text={ownedCountLabel}
                type="body1"
                className="text-center"
              />
              <Button text={t("common.confirm")} onPress={onRequestClose} />
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};


