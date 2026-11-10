# dongneai-app

동네아이 모바일 앱. React Native · Expo SDK 58 · expo-router · TypeScript.

## 실행

```bash
npm ci
cp .env.example .env.local     # EXPO_PUBLIC_API_URL = 백엔드 주소
npx expo start -c              # 휴대폰 Expo Go 또는 i(iOS 시뮬레이터)
npm run typecheck
```

- 휴대폰에서는 `localhost` 대신 Mac의 IP를 넣는다. 핫스팟처럼 기기 간 접속이 막히면 `npx expo start --tunnel`.
- `.env.local`은 커밋하지 않는다.

## 구조

- `src/app/` 라우트 (화면 정의서의 화면 ID와 1:1)
- `src/api/` API 클라이언트·타입 (백엔드 API 명세서와 이름을 맞춘다)
- `src/auth/` 로그인 상태, 토큰 저장
- `src/components/`, `src/theme/` 공통 컴포넌트, 색상
