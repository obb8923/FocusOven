import { Image, ImageSourcePropType, View } from "react-native";
import { Text } from "@component/Text";
import { useTranslation } from "react-i18next";

export type BreadImageProps = {
  source: ImageSourcePropType;
  selected: boolean;
  locked?: boolean;
  requiredLevel?: number;
  lockedLabel?: string;
  breadName?: string;
};

export const BreadImage = ({ source, selected, locked = false, requiredLevel, lockedLabel, breadName }: BreadImageProps) => {
  const { t } = useTranslation();

  const label =
    lockedLabel ??
    (requiredLevel != null
      ? t("common.levelShort", { level: requiredLevel })
      : t("common.locked"));

  return (
    <View 
      className={`h-full items-center justify-center pb-1 ${selected ? 'border border-primary/30 bg-primary/20 rounded-3xl' : ''}`}
      style={{
        aspectRatio: 1,
        overflow: "hidden",
        boxShadow:selected ? [
          {
            inset: true,
            offsetX: 0,
            offsetY: 0,
            blurRadius: 5,
            spreadDistance: 0,
            color: '#0763F64d',
          },
        ] : undefined,
      }}>
      <View className="w-full h-full items-center justify-center">
        <Image
          source={source}
          className="flex-1" 
          resizeMode="contain"
          style={{
            opacity: locked ? 0.3 : 1,
          }}
        />
        {breadName && (
          <Text text={breadName} type="caption1" className="text-center text-gray-800" numberOfLines={1}/>
        )}
        {locked && (
          <View className="absolute inset-0 items-center justify-center bg-white/50">
            <Text text={label} type="caption1" className="text-center text-gray-800" />
          </View>
      )}
     
    </View>
  </View>
);
};