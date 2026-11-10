import { router } from 'expo-router';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { AMENITY_LABEL, PLACE_CATEGORY_LABEL, type PlaceSummary } from '@/api/types';
import { colors } from '@/theme/colors';
import { formatVerified } from '@/utils/date';

export function PlaceCard({ place }: { place: PlaceSummary }) {
  const verified = formatVerified(place.verifiedAt);
  return (
    <Pressable
      accessibilityRole="button"
      onPress={() => router.push(`/places/${place.id}`)}
      style={({ pressed }) => [styles.card, pressed && styles.pressed]}
    >
      <View style={styles.thumb} />
      <View style={styles.body}>
        <Text style={styles.name} numberOfLines={1}>
          {place.name}
        </Text>
        <Text style={styles.meta} numberOfLines={1}>
          {PLACE_CATEGORY_LABEL[place.category]} · 후기 {place.reviewCount}
        </Text>
        {place.amenities.length > 0 && (
          <View style={styles.tags}>
            {place.amenities.map((a) => (
              <Text key={a} style={styles.tag}>
                {AMENITY_LABEL[a]}
              </Text>
            ))}
          </View>
        )}
        <Text style={[styles.verified, verified.stale && styles.stale]}>{verified.text}</Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  card: { flexDirection: 'row', gap: 12, backgroundColor: colors.surface, borderRadius: 14, padding: 14 },
  pressed: { opacity: 0.85 },
  thumb: { width: 72, height: 72, borderRadius: 10, backgroundColor: colors.primaryTint },
  body: { flex: 1, gap: 4 },
  name: { fontSize: 16, fontWeight: '700', color: colors.text },
  meta: { fontSize: 13, color: colors.textSub },
  tags: { flexDirection: 'row', flexWrap: 'wrap', gap: 4 },
  tag: {
    fontSize: 12,
    color: colors.text,
    backgroundColor: colors.chip,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 5,
    overflow: 'hidden',
  },
  verified: { fontSize: 12, color: colors.textSub },
  stale: { color: colors.ad },
});
