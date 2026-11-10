// API 명세서의 열거형·응답 타입. 백엔드와 이름을 맞춘다.

export type AgeGroup = 'PREGNANCY' | 'AGE_0_1' | 'AGE_1_2' | 'AGE_3_5';
export type OnboardingStep = 'TERMS' | 'PROFILE' | 'REGION' | 'DONE';
export type UserRole = 'USER' | 'ADMIN';
export type UserStatus = 'ACTIVE' | 'SUSPENDED' | 'BANNED' | 'WITHDRAWN';

export interface Me {
  id: number;
  nickname: string | null;
  childAgeGroup: AgeGroup | null;
  role: UserRole;
  status: UserStatus;
  onboardingStep: OnboardingStep;
}

export interface Region {
  id: number;
  name: string;
  fullName: string;
}

export interface CursorPage<T> {
  items: T[];
  nextCursor: string | null;
}

export interface ApiErrorBody {
  code: string;
  message: string;
  details?: Record<string, unknown>;
}

export const AGE_GROUP_LABEL: Record<AgeGroup, string> = {
  PREGNANCY: '임신·출산 준비',
  AGE_0_1: '0~12개월',
  AGE_1_2: '1~2세',
  AGE_3_5: '3~5세',
};

export type TermsCode = 'SERVICE' | 'PRIVACY' | 'MARKETING';

export interface Terms {
  code: TermsCode;
  title: string;
  required: boolean;
  version: string;
}

export interface NicknameCheck {
  available: boolean;
  reason: 'INVALID_FORMAT' | 'FORBIDDEN_WORD' | 'DUPLICATED' | null;
}

export interface UserRegion extends Region {
  primary: boolean;
}

export const AGE_GROUPS: AgeGroup[] = ['PREGNANCY', 'AGE_0_1', 'AGE_1_2', 'AGE_3_5'];

// ── 장소 ──────────────────────────────────────────
export type PlaceCategory = 'KIDS_CAFE' | 'PEDIATRICS' | 'PLAYGROUND' | 'NURSING_ROOM' | 'CULTURE_CENTER' | 'RESTAURANT';
export type Amenity = 'PARKING' | 'STROLLER' | 'NURSING_ROOM' | 'DIAPER_TABLE';
export type AmenityStatus = 'YES' | 'NO' | 'UNKNOWN';
export type PlaceSort = 'LATEST' | 'REVIEWS';

export const PLACE_CATEGORIES: PlaceCategory[] = [
  'KIDS_CAFE',
  'PEDIATRICS',
  'PLAYGROUND',
  'NURSING_ROOM',
  'CULTURE_CENTER',
  'RESTAURANT',
];
export const PLACE_CATEGORY_LABEL: Record<PlaceCategory, string> = {
  KIDS_CAFE: '키즈카페',
  PEDIATRICS: '소아과',
  PLAYGROUND: '놀이터',
  NURSING_ROOM: '수유실',
  CULTURE_CENTER: '문화센터',
  RESTAURANT: '유아 동반 식당',
};
export const AMENITIES: Amenity[] = ['PARKING', 'STROLLER', 'NURSING_ROOM', 'DIAPER_TABLE'];
export const AMENITY_LABEL: Record<Amenity, string> = {
  PARKING: '주차',
  STROLLER: '유모차',
  NURSING_ROOM: '수유실',
  DIAPER_TABLE: '기저귀대',
};

export interface PlaceSummary {
  id: number;
  name: string;
  category: PlaceCategory;
  address: string;
  reviewCount: number;
  amenities: Amenity[];
  verifiedAt: string | null;
}

export interface PlaceDetail {
  id: number;
  name: string;
  category: PlaceCategory;
  region: { id: number; name: string } | null;
  address: string;
  lat: number | null;
  lng: number | null;
  kakaoPlaceId: string | null;
  source: 'ADMIN' | 'USER';
  status: 'VISIBLE' | 'HIDDEN' | 'MERGED';
  verifiedAt: string | null;
  reviewCount: number;
  postCount: number;
  amenities: { amenity: Amenity; status: AmenityStatus; confirmedCount: number }[];
}

export interface ExternalPlace {
  kakaoPlaceId: string;
  name: string;
  categoryName: string;
  address: string;
  roadAddress: string;
  lat: number | null;
  lng: number | null;
  registeredPlaceId: number | null;
}
