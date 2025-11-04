import {Text as RNText, TextStyle} from 'react-native';
export type TextProps = {
    text: string;
    // type: 'regular' | 'semibold' | 'extrabold' | 'black';
    className?: string;
    style?: TextStyle | TextStyle[];
    numberOfLines?: number;
  };
// const fontStyle = (type: 'regular' | 'semibold' | 'extrabold' | 'black'): TextStyle => {
//   switch(type){
//     case 'regular':
//       return {
//         fontFamily: 'MemomentKkukkukkR',
//       };
//     case 'semibold':
//       return {
//         fontFamily: 'MemomentKkukkukkR',
//       };
//     case 'extrabold':
//       return {
//         fontFamily: 'MemomentKkukkukkR',
//       };
//     case 'black':
//       return {
//         fontFamily: 'MemomentKkukkukkR',
//       };
//     default:
//       return {
//         fontFamily: 'MemomentKkukkukkR',
//       };
//   }
// }
export const Text = ({text, ...props}: TextProps) => {
  return (
    <RNText 
    {...props}
      className={props.className}
      style={[{fontFamily: 'MemomentKkukkukkR'}, props.style]}
      numberOfLines={props.numberOfLines}>
      {text}
    </RNText>
  );
};
