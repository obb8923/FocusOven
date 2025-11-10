import { Image, ImageSourcePropType, View } from "react-native";
import { Text } from "@component/Text";

export type BreadImageProps = {
  source: ImageSourcePropType;
  selected: boolean;
  locked?: boolean;
  requiredLevel?: number;
  lockedLabel?: string;
  breadName?: string;
};

export const BreadImage = ({ source, selected, locked = false, requiredLevel, lockedLabel, breadName }: BreadImageProps) => {
  const label = lockedLabel ?? (requiredLevel != null ? `Lv.${requiredLevel}` : "잠금");

  return (
    <View 
      className={`h-full items-center justify-center pb-1 ${selected ? 'border-2 border-blue-ribbon-500 rounded-3xl' : ''}`}
      style={{
        aspectRatio: 1,
        overflow: "hidden",
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