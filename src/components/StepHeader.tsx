import { StyleSheet, Text, View } from 'react-native';

import { colors } from '@/theme/colors';

interface Props {
  step: number;
  total: number;
  title: string;
}

/** 온보딩 화면 상단: 진행 단계 + 제목 */
export function StepHeader({ step, total, title }: Props) {
  return (
    <View style={styles.wrap}>
      <Text style={styles.step}>
        {step} / {total}
      </Text>
      <Text style={styles.title} accessibilityRole="header">
        {title}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  wrap: { gap: 4, marginTop: 8, marginBottom: 8 },
  step: { fontSize: 13, fontWeight: '700', color: colors.primaryDark },
  title: { fontSize: 22, fontWeight: '700', lineHeight: 30, color: colors.text },
});
