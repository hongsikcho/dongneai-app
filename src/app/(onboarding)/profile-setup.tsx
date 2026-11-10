import { router } from 'expo-router';
import { useEffect, useState } from 'react';
import { Alert, StyleSheet, Text, TextInput, View } from 'react-native';

import { ApiError } from '@/api/client';
import { userApi } from '@/api/endpoints';
import { AGE_GROUPS, AGE_GROUP_LABEL, type AgeGroup, type NicknameCheck } from '@/api/types';
import { useAuth } from '@/auth/AuthProvider';
import { Button } from '@/components/Button';
import { Chip } from '@/components/Chip';
import { Screen } from '@/components/Screen';
import { StepHeader } from '@/components/StepHeader';
import { colors } from '@/theme/colors';

const REASON_MESSAGE: Record<NonNullable<NicknameCheck['reason']>, string> = {
  INVALID_FORMAT: '한글·영문·숫자 2~10자로 입력해 주세요.',
  FORBIDDEN_WORD: '사용할 수 없는 단어가 포함되어 있어요.',
  DUPLICATED: '이미 사용 중인 닉네임이에요.',
};

/** AUTH-04 프로필 설정 */
export default function ProfileSetupScreen() {
  const { me, setMe } = useAuth();
  const [nickname, setNickname] = useState(me?.nickname ?? '');
  const [ageGroup, setAgeGroup] = useState<AgeGroup | null>(me?.childAgeGroup ?? null);
  const [check, setCheck] = useState<NicknameCheck | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // 입력이 멈추면 0.4초 뒤 중복 확인
  useEffect(() => {
    const value = nickname.trim();
    setCheck(null);
    if (!value) return;
    let cancelled = false;
    const timer = setTimeout(() => {
      userApi
        .checkNickname(value)
        .then((result) => !cancelled && setCheck(result))
        .catch(() => {});
    }, 400);
    return () => {
      cancelled = true;
      clearTimeout(timer);
    };
  }, [nickname]);

  const submit = async () => {
    if (!ageGroup) return;
    setSubmitting(true);
    try {
      setMe(await userApi.updateProfile({ nickname: nickname.trim(), childAgeGroup: ageGroup }));
      router.replace('/region-setup');
    } catch (e) {
      Alert.alert('저장하지 못했어요', e instanceof ApiError ? e.message : '잠시 후 다시 시도해 주세요.');
    } finally {
      setSubmitting(false);
    }
  };

  const message = check ? (check.available ? '사용할 수 있는 닉네임이에요.' : REASON_MESSAGE[check.reason!]) : null;

  return (
    <Screen edges={['top', 'bottom']}>
      <StepHeader step={2} total={3} title="프로필을 만들어 주세요" />
      <Text style={styles.label}>닉네임</Text>
      <TextInput
        style={styles.input}
        value={nickname}
        onChangeText={setNickname}
        placeholder="동네에서 불릴 이름 (2~10자)"
        placeholderTextColor={colors.textSub}
        maxLength={10}
        autoCorrect={false}
        autoCapitalize="none"
        accessibilityLabel="닉네임"
      />
      {message && <Text style={[styles.hint, check?.available ? styles.ok : styles.bad]}>{message}</Text>}

      <Text style={[styles.label, styles.gap]}>아이 연령대</Text>
      <View style={styles.chips}>
        {AGE_GROUPS.map((g) => (
          <Chip key={g} label={AGE_GROUP_LABEL[g]} selected={ageGroup === g} onPress={() => setAgeGroup(g)} />
        ))}
      </View>
      <Text style={styles.note}>정확한 생년월일은 받지 않아요. 연령대에 맞는 정보를 보여드릴 때만 써요.</Text>

      <View style={styles.spacer} />
      <Button label="다음" onPress={submit} disabled={!check?.available || !ageGroup} loading={submitting} />
    </Screen>
  );
}

const styles = StyleSheet.create({
  label: { fontSize: 15, fontWeight: '700', color: colors.text },
  gap: { marginTop: 12 },
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
  hint: { fontSize: 13 },
  ok: { color: colors.primaryDark },
  bad: { color: colors.danger },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  note: { fontSize: 13, color: colors.textSub },
  spacer: { flex: 1 },
});
