import { View } from 'react-native';
import { theme } from '../../theme';
export const Screen = ({ children }: { children: React.ReactNode }) => (
  <View
    style={{ flex: 1, backgroundColor: theme.colors.background, paddingVertical: theme.spacing.xl }}
  >
    {children}
  </View>
);
