import { colors } from './colors';

/**
 * 모든 스택의 공통 헤더 옵션.
 * iOS 최신 버전에서는 헤더가 기본으로 투명(글래스)이라 본문이 헤더 밑으로 들어가므로 불투명 헤더로 고정한다.
 */
export const stackScreenOptions = {
  headerTransparent: false,
  headerStyle: { backgroundColor: colors.ground },
  headerShadowVisible: false,
  headerTintColor: colors.text,
  headerBackTitle: '뒤로',
  contentStyle: { backgroundColor: colors.ground },
} as const;
