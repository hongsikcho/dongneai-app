import { SplashScreen, Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useEffect } from 'react';

import { AuthProvider, useAuth } from '@/auth/AuthProvider';
import { stackScreenOptions } from '@/theme/navigation';

void SplashScreen.preventAutoHideAsync();

/**
 * AUTH-01: 토큰 확인 후 로그인 / 온보딩 / 메인으로 분기한다.
 * Stack.Protected의 guard가 false인 화면 그룹에는 들어갈 수 없다.
 */
function RootNavigator() {
  const { status, needsOnboarding } = useAuth();

  useEffect(() => {
    if (status !== 'loading') void SplashScreen.hideAsync();
  }, [status]);

  if (status === 'loading') return null;

  const signedIn = status === 'signedIn';

  return (
    <Stack
      screenOptions={stackScreenOptions}
    >
      <Stack.Protected guard={!signedIn}>
        <Stack.Screen name="(auth)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={signedIn && needsOnboarding}>
        <Stack.Screen name="(onboarding)" options={{ headerShown: false }} />
      </Stack.Protected>

      <Stack.Protected guard={signedIn && !needsOnboarding}>
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="posts/[id]" options={{ title: '' }} />
        <Stack.Screen name="posts/write" options={{ title: '글쓰기', presentation: 'modal' }} />
        <Stack.Screen name="places/[id]/index" options={{ title: '' }} />
        <Stack.Screen name="places/[id]/review" options={{ title: '후기 쓰기', presentation: 'modal' }} />
        <Stack.Screen name="places/new" options={{ title: '장소 등록' }} />
        <Stack.Screen name="search" options={{ title: '검색' }} />
        <Stack.Screen name="users/[id]" options={{ title: '' }} />
        <Stack.Screen name="my/activity" options={{ title: '내 활동' }} />
        <Stack.Screen name="my/profile" options={{ title: '프로필 수정' }} />
        <Stack.Screen name="my/regions" options={{ title: '관심 지역' }} />
        <Stack.Screen name="my/settings" options={{ title: '설정' }} />
        <Stack.Screen name="my/blocks" options={{ title: '차단 목록' }} />
        <Stack.Screen name="my/withdraw" options={{ title: '회원 탈퇴' }} />
        <Stack.Screen name="my/inquiry" options={{ title: '문의하기' }} />
        <Stack.Screen name="modals/place-picker" options={{ title: '장소 태그', presentation: 'modal' }} />
        <Stack.Screen name="modals/image-viewer" options={{ headerShown: false, presentation: 'fullScreenModal' }} />
      </Stack.Protected>
    </Stack>
  );
}

export default function RootLayout() {
  return (
    <AuthProvider>
      <StatusBar style="dark" />
      <RootNavigator />
    </AuthProvider>
  );
}
