import { router } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, FlatList, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { ApiError } from '@/api/client';
import { placeApi } from '@/api/endpoints';
import { PLACE_CATEGORIES, PLACE_CATEGORY_LABEL, type ExternalPlace, type PlaceCategory } from '@/api/types';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Screen } from '@/components/Screen';
import { usePrimaryRegion } from '@/hooks/usePrimaryRegion';
import { colors } from '@/theme/colors';

/** PLACE-04 장소 등록: 카카오 장소 검색 → 선택 → 카테고리 지정 → 등록 */
export default function NewPlaceScreen() {
  const { region } = usePrimaryRegion();
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<ExternalPlace[] | null>(null);
  const [searching, setSearching] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selected, setSelected] = useState<ExternalPlace | null>(null);
  const [category, setCategory] = useState<PlaceCategory | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const search = async () => {
    const q = query.trim();
    if (!q) return;
    setSearching(true);
    setError(null);
    setSelected(null);
    try {
      setResults(await placeApi.externalSearch(region ? `${region.name} ${q}` : q));
    } catch (e) {
      setResults(null);
      setError(e instanceof ApiError ? e.message : '검색에 실패했어요.');
    } finally {
      setSearching(false);
    }
  };

  const submit = async () => {
    if (!selected || !category || !region) return;
    setSubmitting(true);
    try {
      const place = await placeApi.create({
        regionId: region.id,
        name: selected.name,
        category,
        address: selected.roadAddress || selected.address,
        lat: selected.lat,
        lng: selected.lng,
        kakaoPlaceId: selected.kakaoPlaceId,
      });
      router.replace(`/places/${place.id}`);
    } catch (e) {
      const existingId = e instanceof ApiError ? e.details?.placeId : undefined;
      if (typeof existingId === 'number') {
        router.replace(`/places/${existingId}`);
        return;
      }
      Alert.alert('등록하지 못했어요', e instanceof ApiError ? e.message : '잠시 후 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Screen>
      <Text style={styles.guide}>
        {region ? `${region.name}` : '우리 동네'}에 있는 장소를 검색해서 등록해 주세요.
      </Text>
      <View style={styles.searchRow}>
        <TextInput
          style={styles.input}
          value={query}
          onChangeText={setQuery}
          onSubmitEditing={search}
          placeholder="장소 이름 (예: 키즈카페)"
          placeholderTextColor={colors.textSub}
          returnKeyType="search"
          accessibilityLabel="등록할 장소 검색"
        />
        <Pressable accessibilityRole="button" onPress={search} style={styles.searchButton}>
          <Text style={styles.searchLabel}>검색</Text>
        </Pressable>
      </View>
      {searching && <ActivityIndicator color={colors.primary} />}
      {error && <Text style={styles.error}>{error}</Text>}

      {!selected ? (
        <FlatList
          style={styles.flex}
          data={results ?? []}
          keyExtractor={(p) => p.kakaoPlaceId}
          ListEmptyComponent={
            results && !searching ? <Text style={styles.empty}>검색 결과가 없어요.</Text> : undefined
          }
          renderItem={({ item }) => (
            <Pressable
              accessibilityRole="button"
              style={styles.result}
              onPress={() =>
                item.registeredPlaceId ? router.replace(`/places/${item.registeredPlaceId}`) : setSelected(item)
              }
            >
              <Text style={styles.resultName}>{item.name}</Text>
              <Text style={styles.resultMeta} numberOfLines={1}>
                {item.roadAddress || item.address}
              </Text>
              <Text style={item.registeredPlaceId ? styles.registered : styles.resultMeta} numberOfLines={1}>
                {item.registeredPlaceId ? '이미 등록된 장소 · 보러 가기' : item.categoryName}
              </Text>
            </Pressable>
          )}
        />
      ) : (
        <View style={styles.flex}>
          <View style={styles.selectedCard}>
            <Text style={styles.resultName}>{selected.name}</Text>
            <Text style={styles.resultMeta}>{selected.roadAddress || selected.address}</Text>
            <Pressable onPress={() => setSelected(null)}>
              <Text style={styles.change}>다른 장소 선택</Text>
            </Pressable>
          </View>
          <Text style={styles.label}>카테고리</Text>
          <View style={styles.chips}>
            {PLACE_CATEGORIES.map((c) => (
              <Chip key={c} label={PLACE_CATEGORY_LABEL[c]} selected={category === c} onPress={() => setCategory(c)} />
            ))}
          </View>
          <View style={styles.flex} />
          <Button label="등록하기" onPress={submit} disabled={!category || !region} loading={submitting} />
        </View>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  guide: { fontSize: 15, color: colors.text },
  searchRow: { flexDirection: 'row', gap: 8 },
  input: {
    flex: 1,
    height: 48,
    borderRadius: 12,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    paddingHorizontal: 14,
    fontSize: 16,
    color: colors.text,
  },
  searchButton: {
    height: 48,
    paddingHorizontal: 16,
    borderRadius: 12,
    backgroundColor: colors.primary,
    justifyContent: 'center',
  },
  searchLabel: { color: '#FFFFFF', fontWeight: '700', fontSize: 15 },
  error: { color: colors.danger },
  empty: { color: colors.textSub, textAlign: 'center', paddingVertical: 24 },
  result: { paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: colors.border, gap: 2 },
  resultName: { fontSize: 16, fontWeight: '700', color: colors.text },
  resultMeta: { fontSize: 13, color: colors.textSub },
  registered: { fontSize: 13, color: colors.primary, fontWeight: '600' },
  selectedCard: { backgroundColor: colors.surface, borderRadius: 12, padding: 14, gap: 4, marginBottom: 16 },
  change: { fontSize: 13, color: colors.primary, marginTop: 4 },
  label: { fontSize: 15, fontWeight: '700', color: colors.text, marginBottom: 8 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
