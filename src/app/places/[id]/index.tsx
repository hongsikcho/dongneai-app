import { router, Stack, useLocalSearchParams } from 'expo-router';
import { useCallback, useEffect, useState } from 'react';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError } from '@/api/client';
import { placeApi } from '@/api/endpoints';
import { AMENITY_LABEL, PLACE_CATEGORY_LABEL, type PlaceDetail } from '@/api/types';
import { Button } from '@/components/Button';
import { colors } from '@/theme/colors';
import { formatVerified } from '@/utils/date';

const STATUS_TEXT = { YES: '있음', NO: '없음', UNKNOWN: '확인 필요' } as const;

/** PLACE-02 장소 상세. 후기·이야기 목록은 후기 기능(5단계)에서 채운다. */
export default function PlaceDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [place, setPlace] = useState<PlaceDetail | null>(null);
  const [error, setError] = useState<string | null>(null);

  const load = useCallback(() => {
    setError(null);
    placeApi
      .detail(Number(id))
      .then(setPlace)
      .catch((e) => setError(e instanceof ApiError ? e.message : '장소를 불러오지 못했어요.'));
  }, [id]);

  useEffect(load, [load]);

  if (!place) {
    return (
      <View style={styles.center}>
        <Stack.Screen options={{ title: '' }} />
        {error ? (
          <>
            <Text style={styles.error}>{error}</Text>
            <Button label="다시 시도" variant="secondary" onPress={load} />
          </>
        ) : (
          <ActivityIndicator color={colors.primary} />
        )}
      </View>
    );
  }

  const verified = formatVerified(place.verifiedAt);

  return (
    <SafeAreaView style={styles.root} edges={['bottom']}>
      <Stack.Screen options={{ title: place.name }} />
      <ScrollView contentContainerStyle={styles.content}>
        <View style={styles.photo}>
          <Text style={styles.photoText}>사진은 후기 기능과 함께 추가돼요</Text>
        </View>

        <View style={styles.section}>
          <Text style={styles.meta}>
            {PLACE_CATEGORY_LABEL[place.category]}
            {place.region ? ` · ${place.region.name}` : ''}
          </Text>
          <Text style={styles.name}>{place.name}</Text>
          <Text style={styles.address}>{place.address}</Text>
          <Text style={[styles.verified, verified.stale && styles.stale]}>
            출처: {place.source === 'ADMIN' ? '운영자 등록' : '이웃 등록'} · {verified.text}
          </Text>
        </View>

        <View style={styles.grid}>
          {place.amenities.map((a) => (
            <View key={a.amenity} style={[styles.amenity, a.status === 'YES' && styles.amenityYes]}>
              <Text style={[styles.amenityName, a.status === 'YES' && styles.amenityNameYes]}>
                {AMENITY_LABEL[a.amenity]} {STATUS_TEXT[a.status]}
              </Text>
              <Text style={styles.amenityCount}>
                {a.confirmedCount > 0 ? `후기 ${a.confirmedCount}명 확인` : '확인한 후기 없음'}
              </Text>
            </View>
          ))}
        </View>

        <View style={styles.tabs}>
          <Text style={styles.tabActive}>후기 {place.reviewCount}</Text>
          <Text style={styles.tab}>이 장소 이야기 {place.postCount}</Text>
        </View>
        <Text style={styles.placeholder}>후기 목록은 다음 단계(후기 기능)에서 연결돼요.</Text>
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.flex1}>
          <Button label="질문하기" variant="secondary" onPress={() => router.push('/posts/write')} />
        </View>
        <View style={styles.flex2}>
          <Button label="후기 쓰기" onPress={() => router.push(`/places/${place.id}/review`)} />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.surface },
  center: { flex: 1, alignItems: 'stretch', justifyContent: 'center', padding: 24, gap: 12, backgroundColor: colors.ground },
  error: { textAlign: 'center', color: colors.danger },
  content: { paddingBottom: 24 },
  photo: { height: 160, backgroundColor: colors.primaryTint, alignItems: 'center', justifyContent: 'center' },
  photoText: { fontSize: 13, color: colors.primaryDark },
  section: { padding: 16, gap: 4 },
  meta: { fontSize: 13, color: colors.textSub },
  name: { fontSize: 22, fontWeight: '700', color: colors.text },
  address: { fontSize: 14, color: colors.text },
  verified: { fontSize: 12, color: colors.textSub, marginTop: 4 },
  stale: { color: colors.ad },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, paddingHorizontal: 16 },
  amenity: { width: '48%', padding: 12, borderRadius: 10, backgroundColor: colors.chip, gap: 2 },
  amenityYes: { backgroundColor: colors.primaryTint },
  amenityName: { fontSize: 14, fontWeight: '700', color: colors.text },
  amenityNameYes: { color: colors.primaryDark },
  amenityCount: { fontSize: 12, color: colors.textSub },
  tabs: {
    flexDirection: 'row',
    gap: 20,
    marginTop: 20,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  tabActive: {
    fontSize: 15,
    fontWeight: '700',
    color: colors.text,
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: colors.text,
  },
  tab: { fontSize: 15, color: colors.textSub, paddingVertical: 12 },
  placeholder: { padding: 16, fontSize: 14, color: colors.textSub },
  footer: {
    flexDirection: 'row',
    gap: 8,
    padding: 16,
    borderTopWidth: 1,
    borderTopColor: colors.border,
    backgroundColor: colors.surface,
  },
  flex1: { flex: 1 },
  flex2: { flex: 2 },
});
