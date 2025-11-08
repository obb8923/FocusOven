import { Image, ImageSourcePropType, View, Text as RNText } from "react-native";

export type BreadImageProps = {
  source: ImageSourcePropType;
  selected: boolean;
  locked?: boolean;
  requiredLevel?: number;
}

export const BreadImage = ({ source, selected, locked = false, requiredLevel }: BreadImageProps) => {
  return (
    <View 
      className={`h-full rounded-xl items-center justify-center ${selected ? 'bg-white' : 'bg-transparent'} border border-2 ${selected ? 'border-blue-500' : 'border-transparent'}`}
      style={{
        aspectRatio: 1,
        overflow: "hidden",
      }}>
      <View className="w-full h-full items-center justify-center">
        <Image
          source={source}
          className="w-4/5 h-4/5"
          resizeMode="contain"
          style={{
            opacity: locked ? 0.3 : 1,
          }}
        />
        {locked && (
          <View className="absolute inset-0 items-center justify-center bg-white/50">
            <RNText style={{ fontSize: 12, color: '#444444', fontFamily: 'Pretendard-SemiBold' }}>
              {requiredLevel ? `Lv.${requiredLevel}` : '잠금'}
            </RNText>
          </View>
        )}
      </View>
    </View>
  );
};