import { Stack } from 'expo-router';

import { colors } from '@/theme/colors';

/**
 * 온보딩은 네이티브 헤더를 쓰지 않는다. (투명 헤더가 입력칸을 덮어 터치가 막히는 문제 방지)
 * 각 화면이 위쪽 안전 영역과 제목을 직접 그린다.
 */
export default function OnboardingLayout() {
  return (
    <Stack
      screenOptions={{
        headerShown: false,
        gestureEnabled: false,
        contentStyle: { backgroundColor: colors.ground },
      }}
    />
  );
}
