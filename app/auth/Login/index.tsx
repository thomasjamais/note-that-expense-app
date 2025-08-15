import Button from '@/components/ui/Button';
import { theme } from '@/theme';
import FontAwesome from '@expo/vector-icons/FontAwesome';
import React, { useMemo, useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';
import { useLogin } from './hook';

export default function LoginScreen() {
  const { t } = useTranslation();
  const { mutate, isPending, error } = useLogin();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPwd, setShowPwd] = useState(false);
  const [touched, setTouched] = useState<{ email?: boolean; password?: boolean }>({});

  const emailValid = useMemo(() => /\S+@\S+\.\S+/.test(email), [email]);
  const pwdValid = useMemo(() => password.trim().length >= 8, [password]);
  const canSubmit = emailValid && pwdValid && !isPending;

  const readableError = useMemo(() => {
    if (!error) return '';
    const anyErr = error as any;
    const status = anyErr?.response?.status;
    const msg = anyErr?.response?.data?.message || anyErr?.message;

    if (status === 400 || status === 401) return t('account.emailOrPasswordInvalid');
    if (status === 429) return t('account.tooManyAttempts');
    if (status >= 500) return t('account.error500');
    return msg || t('account.genericError');
  }, [error]);

  const onSubmit = () => {
    if (!canSubmit) return;
    mutate({ email: email.trim(), password });
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.select({ ios: 'padding', android: undefined })}
      style={styles.root}
    >
      <View style={styles.card}>
        <Text style={styles.title}>{t('account.login')}</Text>

        <Text style={styles.label}>{t('account.email')}</Text>
        <View
          style={[styles.inputWrapper, touched.email && !emailValid && styles.inputWrapperError]}
        >
          <FontAwesome
            name="envelope"
            size={16}
            color={theme.colors.neutral[500]}
            style={{ marginRight: 8 }}
          />
          <TextInput
            value={email}
            onChangeText={setEmail}
            onBlur={() => setTouched((t) => ({ ...t, email: true }))}
            style={styles.input}
            placeholder="john.doe@email.com"
            autoCapitalize="none"
            keyboardType="email-address"
            textContentType="emailAddress"
            autoCorrect={false}
            returnKeyType="next"
          />
        </View>
        {touched.email && !emailValid && (
          <Text style={styles.helperError}>{t('account.emailInvalid')}</Text>
        )}

        <Text style={[styles.label, { marginTop: theme.spacing.md }]}>{t('account.password')}</Text>
        <View
          style={[styles.inputWrapper, touched.password && !pwdValid && styles.inputWrapperError]}
        >
          <FontAwesome
            name="lock"
            size={16}
            color={theme.colors.neutral[500]}
            style={{ marginRight: 8 }}
          />
          <TextInput
            value={password}
            onChangeText={setPassword}
            onBlur={() => setTouched((t) => ({ ...t, password: true }))}
            style={[styles.input, { flex: 1 }]}
            placeholder="••••••••"
            secureTextEntry={!showPwd}
            textContentType="password"
            autoCorrect={false}
            returnKeyType="done"
            onSubmitEditing={onSubmit}
          />
          <Pressable onPress={() => setShowPwd((s) => !s)} hitSlop={8}>
            <FontAwesome
              name={showPwd ? 'eye-slash' : 'eye'}
              size={18}
              color={theme.colors.neutral[500]}
            />
          </Pressable>
        </View>
        {touched.password && !pwdValid && (
          <Text style={styles.helperError}>{t('account.passwordInvalid')}</Text>
        )}

        {!!readableError && (
          <View style={styles.errorBanner}>
            <FontAwesome
              name="exclamation-circle"
              size={16}
              color={theme.colors.danger[600]}
              style={{ marginRight: 8 }}
            />
            <Text style={styles.errorText}>{readableError}</Text>
          </View>
        )}

        <Button
          label={isPending ? t('account.loggingIn') : t('account.login')}
          onPress={onSubmit}
          disabled={!canSubmit}
          style={{ marginTop: theme.spacing.lg }}
        />

        <Pressable
          onPress={() => {
            /* navigate('/auth/forgot') */
          }}
        >
          <Text style={styles.link}>{t('account.forgotPassword')}</Text>
        </Pressable>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    padding: theme.spacing.lg,
    justifyContent: 'center',
  },
  card: {
    backgroundColor: theme.colors.surface,
    borderRadius: theme.radii.xl,
    padding: theme.spacing.xl,
    borderWidth: 1,
    borderColor: theme.colors.primary[100],
    ...theme.shadow.level2,
  },
  title: {
    fontFamily: theme.typography.family.bold,
    fontSize: 22,
    textAlign: 'center',
    marginBottom: theme.spacing.lg,
    color: theme.colors.text.primary,
  },
  label: {
    fontFamily: theme.typography.family.medium,
    fontSize: 13,
    color: theme.colors.text.secondary,
    marginBottom: theme.spacing.xs,
  },
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 48,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.neutral[200],
    backgroundColor: theme.colors.neutral[50],
    paddingHorizontal: theme.spacing.md,
  },
  inputWrapperError: {
    borderColor: theme.colors.danger[300],
    backgroundColor: '#FFF6F6',
  },
  input: {
    flex: 1,
    fontFamily: theme.typography.family.regular,
    fontSize: 15,
    color: theme.colors.text.primary,
  },
  helperError: {
    marginTop: theme.spacing.xs,
    fontSize: 12,
    color: theme.colors.danger[600],
  },
  errorBanner: {
    marginTop: theme.spacing.md,
    padding: theme.spacing.sm,
    borderRadius: theme.radii.md,
    borderWidth: 1,
    borderColor: theme.colors.danger[200],
    backgroundColor: theme.colors.danger[50],
    flexDirection: 'row',
    alignItems: 'center',
  },
  errorText: {
    flex: 1,
    color: theme.colors.danger[700],
    fontSize: 13,
  },
  link: {
    marginTop: theme.spacing.md,
    textAlign: 'center',
    fontSize: 13,
    color: theme.colors.primary[700],
    textDecorationLine: 'underline',
  },
});
