import { api } from './client';
import type {
  AgeGroup,
  Amenity,
  CursorPage,
  ExternalPlace,
  Me,
  NicknameCheck,
  PlaceCategory,
  PlaceDetail,
  PlaceSort,
  PlaceSummary,
  Region,
  Terms,
  TermsCode,
  UserRegion,
} from './types';

/** 백엔드에 구현된 API만 여기에 추가한다. */
export const authApi = {
  me: () => api.get<Me>('/auth/me'),
  /** local 프로필 전용 개발 토큰 */
  devToken: (devId: string) =>
    api.post<{ userId: number; accessToken: string }>('/dev/token', { query: { devId } }),
};

export const termsApi = {
  list: () => api.get<Terms[]>('/terms'),
  agree: (agreements: { code: TermsCode; agreed: boolean }[]) =>
    api.post<Me>('/users/me/agreements', { body: { agreements } }),
};

export const userApi = {
  checkNickname: (nickname: string) => api.get<NicknameCheck>('/users/nickname/check', { query: { nickname } }),
  updateProfile: (body: { nickname?: string; childAgeGroup?: AgeGroup }) => api.patch<Me>('/users/me', { body }),
};

export const regionApi = {
  search: (q: string) => api.get<Region[]>('/regions', { query: { q } }),
  mine: () => api.get<UserRegion[]>('/users/me/regions'),
  replaceMine: (regions: { regionId: number; primary: boolean }[]) =>
    api.put<UserRegion[]>('/users/me/regions', { body: { regions } }),
};

export interface PlaceSearchParams {
  regionId?: number;
  category?: PlaceCategory;
  amenities?: Amenity[];
  q?: string;
  sort?: PlaceSort;
  cursor?: string | null;
  size?: number;
}

export const placeApi = {
  search: ({ amenities, ...rest }: PlaceSearchParams) =>
    api.get<CursorPage<PlaceSummary>>('/places', {
      query: { ...rest, amenities: amenities?.length ? amenities.join(',') : undefined },
    }),
  detail: (id: number) => api.get<PlaceDetail>(`/places/${id}`),
  externalSearch: (q: string) => api.get<ExternalPlace[]>('/places/external-search', { query: { q } }),
  create: (body: {
    regionId: number;
    name: string;
    category: PlaceCategory;
    address: string;
    lat: number | null;
    lng: number | null;
    kakaoPlaceId: string;
  }) => api.post<PlaceDetail>('/places', { body }),
};
