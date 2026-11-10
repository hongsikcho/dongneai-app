import type { ReactNode } from 'react';
import { ScrollView, StyleSheet, View, type ViewStyle } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';

import { colors } from '@/theme/colors';

interface Props {
  children: ReactNode;
  scroll?: boolean;
  /** 헤더가 있는 스택 화면은 위쪽 안전 영역을 헤더가 처리하므로 기본값은 아래쪽만 */
  edges?: Edge[];
  style?: ViewStyle;
}

export function Screen({ children, scroll = false, edges = ['bottom'], style }: Props) {
  const content = scroll ? (
    <ScrollView contentContainerStyle={[styles.content, style]}>{children}</ScrollView>
  ) : (
    <View style={[styles.content, styles.fill, style]}>{children}</View>
  );
  return (
    <SafeAreaView style={styles.root} edges={edges}>
      {content}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: colors.ground },
  fill: { flex: 1 },
  content: { padding: 16, gap: 12 },
});
