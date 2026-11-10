import { router } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, Alert, StyleSheet, Text, View } from 'react-native';

import { ApiError } from '@/api/client';
import { termsApi } from '@/api/endpoints';
import type { Terms, TermsCode } from '@/api/types';
import { useAuth } from '@/auth/AuthProvider';
import { Button } from '@/components/Button';
import { Checkbox } from '@/components/Checkbox';
import { Screen } from '@/components/Screen';
import { StepHeader } from '@/components/StepHeader';
import { colors } from '@/theme/colors';

/** AUTH-03 약관 동의 */
export default function TermsScreen() {
  const { setMe } = useAuth();
  const [terms, setTerms] = useState<Terms[] | null>(null);
  const [checked, setChecked] = useState<Partial<Record<TermsCode, boolean>>>({});
  const [submitting, setSubmitting] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);

  const load = useCallback(() => {
    setLoadError(null);
    termsApi
      .list()
      .then(setTerms)
      .catch((e) => setLoadError(e instanceof ApiError ? `${e.message} [${e.code}]` : '약관을 불러오지 못했어요.'));
  }, []);

  useEffect(load, [load]);

  if (!terms) {
    return (
      <Screen edges={['top', 'bottom']} style={styles.center}>
        {loadError ? (
          <>
            <Text style={styles.error}>{loadError}</Text>
            <Button label="다시 시도" variant="secondary" onPress={load} />
          </>
        ) : (
          <ActivityIndicator color={colors.primary} />
        )}
      </Screen>
    );
  }

  const allChecked = terms.every((t) => checked[t.code]);
  const requiredChecked = terms.filter((t) => t.required).every((t) => checked[t.code]);

  const toggleAll = () => setChecked(Object.fromEntries(terms.map((t) => [t.code, !allChecked])));
  const toggle = (code: TermsCode) => setChecked((prev) => ({ ...prev, [code]: !prev[code] }));

  const submit = async () => {
    setSubmitting(true);
    try {
      const me = await termsApi.agree(terms.map((t) => ({ code: t.code, agreed: !!checked[t.code] })));
      setMe(me);
      router.replace('/profile-setup');
    } catch (e) {
      Alert.alert('저장하지 못했어요', e instanceof ApiError ? e.message : '잠시 후 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <StepHeader step={1} total={3} title={'동네아이 이용을 위해\n약관에 동의해 주세요'} />
      <View style={styles.card}>
        <Checkbox label="전체 동의" checked={allChecked} onToggle={toggleAll} bold />
        <View style={styles.divider} />
        {terms.map((t) => (
          <Checkbox
            key={t.code}
            label={`${t.required ? '[필수]' : '[선택]'} ${t.title}`}
            checked={!!checked[t.code]}
            onToggle={() => toggle(t.code)}
          />
        ))}
      </View>
      <View style={styles.spacer} />
      <Button label="동의하고 계속하기" onPress={submit} disabled={!requiredChecked} loading={submitting} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  center: { justifyContent: 'center', alignItems: 'stretch' },
  error: { textAlign: 'center', color: colors.danger, fontSize: 15 },
  card: { backgroundColor: colors.surface, borderRadius: 14, paddingHorizontal: 16, paddingVertical: 8 },
  divider: { height: 1, backgroundColor: colors.border, marginVertical: 4 },
  spacer: { flex: 1 },
});
