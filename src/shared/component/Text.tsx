import {Text as RNText, TextStyle} from 'react-native';
export type TextProps = {
    text: string;
    type?: 'string' | 'number';
    className?: string;
    style?: TextStyle | TextStyle[];
    numberOfLines?: number;
    adjustsFontSizeToFit?: boolean;
    minimumFontScale?: number;
  };

export const Text = ({text, type = 'string', ...props}: TextProps) => {
  const fontFamily = type === 'number' ? 'Galmuri9' : 'MemomentKkukkukkR';
  return (
    <RNText 
    {...props}
      className={props.className}
      style={[{fontFamily}, props.style]}
      numberOfLines={props.numberOfLines}
      adjustsFontSizeToFit={props.adjustsFontSizeToFit}
      minimumFontScale={props.minimumFontScale}>
      {text}
    </RNText>
  );
};
