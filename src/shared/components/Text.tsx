import {Text as RNText, TextStyle} from 'react-native';
export type TextProps = {
    text: string;
    type: 'regular' | 'semibold' | 'extrabold' | 'black';
    className?: string;
    style?: TextStyle | TextStyle[];
    numberOfLines?: number;
  };
const fontStyle = (type: 'regular' | 'semibold' | 'extrabold' | 'black'): TextStyle => {
  switch(type){
    case 'regular':
      return {
        fontFamily: 'Pretendard-Regular',
      };
    case 'semibold':
      return {
        fontFamily: 'Pretendard-SemiBold',
      };
    case 'extrabold':
      return {
        fontFamily: 'Pretendard-ExtraBold',
      };
    case 'black':
      return {
        fontFamily: 'Pretendard-Black',
      };
    default:
      return {
        fontFamily: 'Pretendard-Regular',
      };
  }
}
export const Text = ({text, type='regular', ...props}: TextProps) => {
  return (
    <RNText 
    {...props}
      className={props.className}
      style={[fontStyle(type), props.style]}
      numberOfLines={props.numberOfLines}>
      {text}
    </RNText>
  );
};
