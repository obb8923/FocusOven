import { View, ViewStyle } from "react-native"
import { useSafeAreaInsets } from "react-native-safe-area-context"

type BackgroundProps = {
  children: React.ReactNode;
  className?: string;
  style?: ViewStyle | ViewStyle[];
  isStatusBarGap?: boolean;
}
export const Background = ({children,isStatusBarGap=false,...props}: BackgroundProps) => {
  const insets = useSafeAreaInsets();

  return (
    <View className={`flex-1 bg-background ${props.className}`} style={{paddingTop: isStatusBarGap ? insets.top : 0, ...props.style}}>
      {children}
    </View>    
  )
}
