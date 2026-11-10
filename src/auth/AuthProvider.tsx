import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState, type ReactNode } from 'react';

import { ApiError, configureApiClient } from '@/api/client';
import { authApi } from '@/api/endpoints';
import type { Me } from '@/api/types';
import { tokenStorage } from '@/auth/tokenStorage';
import { clearPrimaryRegionCache } from '@/hooks/usePrimaryRegion';

type AuthStatus = 'loading' | 'signedOut' | 'signedIn';

interface AuthContextValue {
  status: AuthStatus;
  me: Me | null;
  /** 온보딩(약관·프로필·지역)이 끝나지 않았으면 true */
  needsOnboarding: boolean;
  signInWithToken: (accessToken: string) => Promise<void>;
  signInWithDevToken: (devId: string) => Promise<void>;
  signOut: () => Promise<void>;
  refreshMe: () => Promise<void>;
  /** 온보딩 API가 돌려준 최신 회원 정보를 바로 반영한다. */
  setMe: (me: Me) => void;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [status, setStatus] = useState<AuthStatus>('loading');
  const [me, setMe] = useState<Me | null>(null);
  const tokenRef = useRef<string | null>(null);

  const clearSession = useCallback(async () => {
    tokenRef.current = null;
    clearPrimaryRegionCache();
    setMe(null);
    setStatus('signedOut');
    await tokenStorage.clear();
  }, []);

  useEffect(() => {
    configureApiClient({
      getToken: () => tokenRef.current,
      onUnauthorized: () => {
        void clearSession();
      },
    });
  }, [clearSession]);

  const loadMe = useCallback(async () => {
    const result = await authApi.me();
    setMe(result);
    setStatus('signedIn');
  }, []);

  // 앱 시작(AUTH-01): 저장된 토큰이 있으면 내 정보를 조회한다.
  useEffect(() => {
    (async () => {
      const saved = await tokenStorage.get();
      if (!saved) {
        setStatus('signedOut');
        return;
      }
      tokenRef.current = saved;
      try {
        await loadMe();
      } catch (e) {
        if (e instanceof ApiError && e.status === 401) await clearSession();
        else setStatus('signedOut'); // 네트워크 오류 등: 로그인 화면에서 재시도
      }
    })();
  }, [loadMe, clearSession]);

  const signInWithToken = useCallback(
    async (accessToken: string) => {
      tokenRef.current = accessToken;
      await tokenStorage.set(accessToken);
      await loadMe();
    },
    [loadMe],
  );

  const signInWithDevToken = useCallback(
    async (devId: string) => {
      const { accessToken } = await authApi.devToken(devId);
      await signInWithToken(accessToken);
    },
    [signInWithToken],
  );

  const value = useMemo<AuthContextValue>(
    () => ({
      status,
      me,
      needsOnboarding: status === 'signedIn' && me?.onboardingStep !== 'DONE',
      signInWithToken,
      signInWithDevToken,
      signOut: clearSession,
      refreshMe: loadMe,
      setMe,
    }),
    [status, me, signInWithToken, signInWithDevToken, clearSession, loadMe],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth는 AuthProvider 안에서만 사용할 수 있습니다.');
  return ctx;
}
