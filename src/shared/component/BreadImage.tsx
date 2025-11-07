import { Image, ImageSourcePropType, View } from "react-native";

export type BreadImageProps = {
  source: ImageSourcePropType;
  selected: boolean;
}

export const BreadImage = ({ source, selected }: BreadImageProps) => {
  return (
    <View 
    className={`h-full rounded-lg ${selected ? 'bg-white' : 'bg-transparent'}`} 
    style={{
      aspectRatio: 1,
      boxShadow:[{
        offsetX: 0,
        offsetY: 0,
        blurRadius: selected ? 10 : 0,
        spreadDistance: 0,
        color: 'rgba(0, 0, 0, 0.1)',
      }]
      }}>  
      <Image source={source} className="w-full h-full" resizeMode="contain" />
    </View>
  );
};