import { router } from 'expo-router';
import { Tabs } from 'expo-router/js-tabs';

import { colors } from '@/theme/colors';

/** 하단 탭 (P0: 홈·장소·글쓰기·마이). 알림 탭은 P1에서 추가. 아이콘은 추후 적용. */
export default function TabsLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: colors.textSub,
        tabBarIconStyle: { display: 'none' },
        tabBarLabelStyle: { fontSize: 14, fontWeight: '600' },
        headerTintColor: colors.text,
      }}
    >
      <Tabs.Screen name="index" options={{ title: '홈' }} />
      <Tabs.Screen name="places" options={{ title: '장소', headerShown: false }} />
      <Tabs.Screen
        name="write"
        options={{ title: '글쓰기' }}
        listeners={{
          tabPress: (e) => {
            e.preventDefault();
            router.push('/posts/write');
          },
        }}
      />
      <Tabs.Screen name="my" options={{ title: '마이' }} />
    </Tabs>
  );
}
