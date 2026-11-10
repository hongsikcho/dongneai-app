import { router } from 'expo-router';
import { useCallback, useEffect, useRef, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Pressable,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from 'react-native';

import { SafeAreaView } from 'react-native-safe-area-context';

import { ApiError } from '@/api/client';
import { placeApi } from '@/api/endpoints';
import {
  AMENITIES,
  AMENITY_LABEL,
  PLACE_CATEGORIES,
  PLACE_CATEGORY_LABEL,
  type Amenity,
  type PlaceCategory,
  type PlaceSort,
  type PlaceSummary,
} from '@/api/types';
import { Chip } from '@/components/Chip';
import { PlaceCard } from '@/components/PlaceCard';
import { usePrimaryRegion } from '@/hooks/usePrimaryRegion';
import { colors } from '@/theme/colors';

const PAGE_SIZE = 20;

/** PLACE-01 장소 탐색 */
export default function PlacesScreen() {
  const { region, error: regionError } = usePrimaryRegion();
  const [category, setCategory] = useState<PlaceCategory | undefined>();
  const [amenities, setAmenities] = useState<Amenity[]>([]);
  const [sort, setSort] = useState<PlaceSort>('REVIEWS');
  const [query, setQuery] = useState('');
  const [keyword, setKeyword] = useState('');

  const [items, setItems] = useState<PlaceSummary[]>([]);
  const [cursor, setCursor] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const requestId = useRef(0);

  // 검색어는 입력이 멈추면 반영
  useEffect(() => {
    const timer = setTimeout(() => setKeyword(query.trim()), 300);
    return () => clearTimeout(timer);
  }, [query]);

  const load = useCallback(
    async (reset: boolean) => {
      if (!region) return;
      const id = ++requestId.current;
      setLoading(true);
      setError(null);
      try {
        const page = await placeApi.search({
          regionId: region.id,
          category,
          amenities,
          q: keyword || undefined,
          sort,
          cursor: reset ? null : cursor,
          size: PAGE_SIZE,
        });
        if (id !== requestId.current) return; // 필터가 바뀐 뒤 도착한 이전 응답은 버린다
        setItems((prev) => (reset ? page.items : [...prev, ...page.items]));
        setCursor(page.nextCursor);
      } catch (e) {
        if (id === requestId.current) setError(e instanceof ApiError ? e.message : '목록을 불러오지 못했어요.');
      } finally {
        if (id === requestId.current) {
          setLoading(false);
          setRefreshing(false);
        }
      }
    },
    [region, category, amenities, keyword, sort, cursor],
  );

  // 필터가 바뀌면 처음부터 다시
  useEffect(() => {
    void load(true);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [region, category, amenities, keyword, sort]);

  const toggleAmenity = (a: Amenity) =>
    setAmenities((prev) => (prev.includes(a) ? prev.filter((x) => x !== a) : [...prev, a]));

  const header = (
    <View style={styles.header}>
      <View style={styles.titleRow}>
        <Text style={styles.title}>{region ? `${region.name} 장소` : '장소'}</Text>
        <Pressable accessibilityRole="button" onPress={() => router.push('/places/new')} style={styles.addButton}>
          <Text style={styles.addLabel}>+ 장소 등록</Text>
        </Pressable>
      </View>
      <TextInput
        style={styles.search}
        value={query}
        onChangeText={setQuery}
        placeholder="장소 이름 검색"
        placeholderTextColor={colors.textSub}
        returnKeyType="search"
        accessibilityLabel="장소 이름 검색"
      />
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        <Chip label="전체" selected={!category} onPress={() => setCategory(undefined)} />
        {PLACE_CATEGORIES.map((c) => (
          <Chip key={c} label={PLACE_CATEGORY_LABEL[c]} selected={category === c} onPress={() => setCategory(c)} />
        ))}
      </ScrollView>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
        {AMENITIES.map((a) => (
          <Chip key={a} label={AMENITY_LABEL[a]} selected={amenities.includes(a)} onPress={() => toggleAmenity(a)} />
        ))}
      </ScrollView>
      <View style={styles.sortRow}>
        <Text style={styles.count}>{items.length > 0 ? `${items.length}곳${cursor ? '+' : ''}` : ''}</Text>
        <Pressable
          accessibilityRole="button"
          onPress={() => setSort((s) => (s === 'REVIEWS' ? 'LATEST' : 'REVIEWS'))}
        >
          <Text style={styles.sort}>{sort === 'REVIEWS' ? '후기 많은 순' : '최근 등록 순'} ⇅</Text>
        </Pressable>
      </View>
    </View>
  );

  if (regionError) {
    return (
      <View style={styles.center}>
        <Text style={styles.error}>{regionError}</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.list} edges={['top']}>
    <FlatList
      style={styles.list}
      contentContainerStyle={styles.content}
      data={items}
      keyExtractor={(p) => String(p.id)}
      renderItem={({ item }) => <PlaceCard place={item} />}
      ListHeaderComponent={header}
      ItemSeparatorComponent={() => <View style={styles.gap} />}
      onEndReachedThreshold={0.4}
      onEndReached={() => {
        if (cursor && !loading) void load(false);
      }}
      refreshControl={
        <RefreshControl
          refreshing={refreshing}
          onRefresh={() => {
            setRefreshing(true);
            void load(true);
          }}
        />
      }
      ListEmptyComponent={
        loading ? (
          <ActivityIndicator color={colors.primary} style={styles.loader} />
        ) : (
          <View style={styles.empty}>
            <Text style={styles.emptyText}>{error ?? '조건에 맞는 장소가 아직 없어요.'}</Text>
          </View>
        )
      }
      ListFooterComponent={loading && items.length > 0 ? <ActivityIndicator style={styles.loader} /> : undefined}
    />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  list: { flex: 1, backgroundColor: colors.ground },
  content: { padding: 16, paddingBottom: 32 },
  header: { gap: 10, marginBottom: 12 },
  titleRow: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between' },
  title: { fontSize: 20, fontWeight: '700', color: colors.text },
  addButton: {
    minHeight: 36,
    paddingHorizontal: 12,
    borderRadius: 18,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    justifyContent: 'center',
  },
  addLabel: { fontSize: 13, color: colors.text },
  search: {
    height: 44,
    borderRadius: 12,
    backgroundColor: colors.chip,
    paddingHorizontal: 14,
    fontSize: 15,
    color: colors.text,
  },
  row: { gap: 8 },
  sortRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  count: { fontSize: 13, color: colors.textSub },
  sort: { fontSize: 13, color: colors.textSub, paddingVertical: 6 },
  gap: { height: 10 },
  loader: { marginVertical: 24 },
  empty: { paddingVertical: 40, alignItems: 'center' },
  emptyText: { fontSize: 14, color: colors.textSub },
  center: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: colors.ground },
  error: { color: colors.danger },
});
