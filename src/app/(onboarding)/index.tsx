import { Redirect } from 'expo-router';

import { useAuth } from '@/auth/AuthProvider';

/** 서버가 알려준 온보딩 단계로 바로 이동한다. */
export default function OnboardingIndex() {
  const { me } = useAuth();
  switch (me?.onboardingStep) {
    case 'PROFILE':
      return <Redirect href="/profile-setup" />;
    case 'REGION':
      return <Redirect href="/region-setup" />;
    default:
      return <Redirect href="/terms" />;
  }
}
