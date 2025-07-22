import Colors from '@/constants/Colors';
import {
  Text as DefaultText,
  View as DefaultView,
  TouchableOpacity,
  TouchableOpacityProps,
} from 'react-native';
import { useColorScheme } from './useColorScheme';

type ThemeProps = {
  lightColor?: string;
  darkColor?: string;
};

export type TextProps = ThemeProps & DefaultText['props'];
export type ViewProps = ThemeProps & DefaultView['props'];

export function useThemeColor(
  props: { light?: string; dark?: string },
  colorName: keyof typeof Colors.light & keyof typeof Colors.dark,
) {
  const theme = useColorScheme() ?? 'light';
  const colorFromProps = props[theme];

  if (colorFromProps) {
    return colorFromProps;
  } else {
    return Colors[theme][colorName];
  }
}

export function Text(props: TextProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const color = useThemeColor({ light: lightColor, dark: darkColor }, 'text');
  return <DefaultText style={[{ color }, style]} {...otherProps} />;
}

export function View(props: ViewProps) {
  const { style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'background');
  return <DefaultView style={[{ backgroundColor }, style]} {...otherProps} />;
}

export function Button(
  props: TouchableOpacityProps & { title: string; lightColor?: string; darkColor?: string },
) {
  const { title, style, lightColor, darkColor, ...otherProps } = props;
  const backgroundColor = useThemeColor({ light: lightColor, dark: darkColor }, 'tint');

  return (
    <TouchableOpacity
      style={[
        {
          backgroundColor,
          paddingVertical: 10,
          paddingHorizontal: 16,
          borderRadius: 8,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}
      {...otherProps}
    >
      <DefaultText style={{ color: '#fff', fontWeight: '600' }}>{title}</DefaultText>
    </TouchableOpacity>
  );
}
