import { useEffect, useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ApiError } from '@/api/client';
import { regionApi } from '@/api/endpoints';
import type { Region } from '@/api/types';
import { useAuth } from '@/auth/AuthProvider';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { StepHeader } from '@/components/StepHeader';
import { colors } from '@/theme/colors';

/** AUTH-05 동네 설정. 온보딩에서는 기본 동네 1개만 고르고, 추가 동네는 MY-04에서 관리한다. */
export default function RegionSetupScreen() {
  const { refreshMe } = useAuth();
  const [submitting, setSubmitting] = useState(false);
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<Region[]>([]);
  const [selected, setSelected] = useState<Region | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query.trim();
    if (!q) {
      setResults([]);
      return;
    }
    const timer = setTimeout(async () => {
      setLoading(true);
      setError(null);
      try {
        setResults(await regionApi.search(q));
      } catch (e) {
        setError(e instanceof ApiError ? e.message : '검색에 실패했습니다.');
      } finally {
        setLoading(false);
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [query]);

  const submit = async () => {
    if (!selected) return;
    setSubmitting(true);
    try {
      await regionApi.replaceMine([{ regionId: selected.id, primary: true }]);
      await refreshMe(); // onboardingStep이 DONE이 되면 루트 레이아웃이 홈 탭으로 전환한다
    } catch (e) {
      Alert.alert('저장하지 못했어요', e instanceof ApiError ? e.message : '잠시 후 다시 시도해 주세요.');
      setSubmitting(false);
    }
  };

  return (
    <Screen edges={['top', 'bottom']}>
      <StepHeader step={3} total={3} title="자주 다니는 동네를 선택해 주세요" />
      <TextInput
        style={styles.input}
        placeholder="동 이름으로 검색 (예: 행복동)"
        placeholderTextColor={colors.textSub}
        value={query}
        onChangeText={setQuery}
        autoFocus
        accessibilityLabel="동네 검색"
      />
      {loading && <ActivityIndicator color={colors.primary} />}
      {error && <Text style={styles.error}>{error}</Text>}
      <FlatList
        data={results}
        keyExtractor={(item) => String(item.id)}
        style={styles.list}
        ListEmptyComponent={
          query.trim() && !loading && !error ? <Text style={styles.empty}>검색 결과가 없어요.</Text> : undefined
        }
        renderItem={({ item }) => {
          const active = selected?.id === item.id;
          return (
            <Pressable
              accessibilityRole="button"
              accessibilityState={{ selected: active }}
              onPress={() => setSelected(item)}
              style={[styles.row, active && styles.rowActive]}
            >
              <Text style={styles.name}>{item.name}</Text>
              <Text style={styles.fullName}>{item.fullName}</Text>
            </Pressable>
          );
        }}
      />
      <View style={styles.footer}>
        <Button
          label={selected ? `${selected.name}(으)로 시작하기` : '동네를 선택해 주세요'}
          disabled={!selected}
          loading={submitting}
          onPress={submit}
        />
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  input: {
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    fontSize: 16,
    color: colors.text,
  },
  error: { color: colors.danger },
  list: { flex: 1 },
  empty: { color: colors.textSub, paddingVertical: 16, textAlign: 'center' },
  row: { paddingVertical: 12, paddingHorizontal: 12, borderRadius: 10, gap: 2 },
  rowActive: { backgroundColor: colors.primaryTint },
  name: { fontSize: 16, fontWeight: '600', color: colors.text },
  fullName: { fontSize: 13, color: colors.textSub },
  footer: { paddingTop: 8 },
});
