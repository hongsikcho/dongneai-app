import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { useAuth } from '@/auth/AuthProvider';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors } from '@/theme/colors';

/** MY-01 마이 홈 */
export default function MyScreen() {
  const { me, signOut } = useAuth();
  return (
    <Screen scroll>
      <View style={styles.card}>
        <Text style={styles.name}>{me?.nickname ?? '닉네임 미설정'}</Text>
      </View>
      <View style={styles.menu}>
        <Link href="/my/activity" style={styles.item}>내 활동</Link>
        <Link href="/my/profile" style={styles.item}>프로필 수정</Link>
        <Link href="/my/regions" style={styles.item}>관심 지역</Link>
        <Link href="/my/settings" style={styles.item}>설정</Link>
      </View>
      <Button label="로그아웃" variant="secondary" onPress={signOut} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 14, padding: 16 },
  name: { fontSize: 18, fontWeight: '700', color: colors.text },
  menu: { backgroundColor: colors.surface, borderRadius: 14, paddingHorizontal: 16 },
  item: { fontSize: 16, color: colors.text, paddingVertical: 14 },
});
