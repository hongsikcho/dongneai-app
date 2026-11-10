import { useEffect, useState } from 'react';

import { regionApi } from '@/api/endpoints';
import type { UserRegion } from '@/api/types';

let cache: UserRegion | null = null;

/** 내 기본 동네. 장소·피드 목록의 기본 필터로 쓴다. 한 번 불러오면 앱 실행 동안 재사용. */
export function usePrimaryRegion() {
  const [region, setRegion] = useState<UserRegion | null>(cache);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (cache) return;
    regionApi
      .mine()
      .then((list) => {
        cache = list.find((r) => r.primary) ?? list[0] ?? null;
        setRegion(cache);
      })
      .catch(() => setError('동네 정보를 불러오지 못했어요.'));
  }, []);

  return { region, error };
}

/** 관심 지역을 바꾼 뒤 호출 */
export function clearPrimaryRegionCache() {
  cache = null;
}
