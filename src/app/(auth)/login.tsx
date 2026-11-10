import { useState } from 'react';
import { Alert, StyleSheet, Text, View } from 'react-native';

import { ApiError, API_BASE_URL } from '@/api/client';
import { useAuth } from '@/auth/AuthProvider';
import { Button } from '@/components/Button';
import { Screen } from '@/components/Screen';
import { colors } from '@/theme/colors';

/** AUTH-02 로그인. 카카오·Apple 연동 전까지 개발용 로그인만 동작한다. */
export default function LoginScreen() {
  const { signInWithDevToken } = useAuth();
  const [loading, setLoading] = useState(false);

  const notReady = () => Alert.alert('준비 중', '소셜 로그인은 다음 단계에서 연동합니다.');

  const devLogin = async () => {
    setLoading(true);
    try {
      await signInWithDevToken('dev-user-1');
    } catch (e) {
      const message = e instanceof ApiError ? e.message : '알 수 없는 오류';
      Alert.alert('로그인 실패', `${message}\n(${API_BASE_URL})`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Screen edges={['top', 'bottom']} style={styles.container}>
      <View style={styles.hero}>
        <Text style={styles.logo}>동네아이</Text>
        <Text style={styles.tagline}>우리 동네 육아 정보, 부모들의 진짜 후기</Text>
      </View>
      <View style={styles.actions}>
        <Button label="카카오로 시작하기" onPress={notReady} />
        <Button label="Apple로 시작하기" variant="secondary" onPress={notReady} />
        {__DEV__ && <Button label="개발용 로그인" variant="secondary" onPress={devLogin} loading={loading} />}
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  container: { justifyContent: 'space-between', paddingVertical: 32 },
  hero: { flex: 1, justifyContent: 'center', gap: 8 },
  logo: { fontSize: 36, fontWeight: '800', color: colors.primary },
  tagline: { fontSize: 16, color: colors.textSub },
  actions: { gap: 10 },
});
