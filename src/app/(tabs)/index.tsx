import { Link } from 'expo-router';
import { StyleSheet, Text, View } from 'react-native';

import { AGE_GROUP_LABEL } from '@/api/types';
import { useAuth } from '@/auth/AuthProvider';
import { Screen } from '@/components/Screen';
import { colors } from '@/theme/colors';

/** FEED-01 홈 피드. GET /feed 구현 전까지 연결 확인용 정보를 보여준다. */
export default function HomeScreen() {
  const { me } = useAuth();
  return (
    <Screen scroll>
      <View style={styles.card}>
        <Text style={styles.id}>FEED-01 · 연결 확인</Text>
        <Text style={styles.title}>로그인 성공</Text>
        <Text style={styles.body}>회원 ID {me?.id}</Text>
        <Text style={styles.body}>닉네임 {me?.nickname ?? '(미설정)'}</Text>
        <Text style={styles.body}>
          자녀 연령대 {me?.childAgeGroup ? AGE_GROUP_LABEL[me.childAgeGroup] : '(미설정)'}
        </Text>
        <Text style={styles.body}>온보딩 단계 {me?.onboardingStep}</Text>
      </View>
      <Text style={styles.section}>화면 이동 확인</Text>
      <Link href="/posts/1" style={styles.link}>글 상세 (FEED-02)</Link>
      <Link href="/places/1" style={styles.link}>장소 상세 (PLACE-02)</Link>
      <Link href="/search" style={styles.link}>통합 검색 (SRCH-01)</Link>
      <Link href="/users/1" style={styles.link}>사용자 프로필 (USER-01)</Link>
    </Screen>
  );
}

const styles = StyleSheet.create({
  card: { backgroundColor: colors.surface, borderRadius: 14, padding: 16, gap: 4 },
  id: { fontSize: 12, fontWeight: '700', color: colors.primaryDark },
  title: { fontSize: 18, fontWeight: '700', color: colors.text, marginBottom: 4 },
  body: { fontSize: 14, color: colors.text },
  section: { fontSize: 14, fontWeight: '700', color: colors.textSub, marginTop: 8 },
  link: { fontSize: 15, color: colors.primary, paddingVertical: 8 },
});
