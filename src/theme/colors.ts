/** 브라운 팔레트. 텍스트·버튼 대비는 WCAG AA(4.5:1) 이상으로 맞췄다. */
export const colors = {
  primary: '#7A5236', // 메인 브라운 (버튼, 선택 칩, 강조 텍스트)
  primaryDark: '#5B3C26', // 진한 브라운 (틴트 배경 위 텍스트)
  primaryTint: '#F3E9DF', // 연한 베이지 (선택 배경, 편의시설 있음)
  ground: '#FAF6F1', // 화면 배경 (아이보리)
  surface: '#FFFFFF', // 카드
  border: '#E8DFD5',
  chip: '#F2EBE3',
  text: '#2B2118',
  textSub: '#6E6157',
  ad: '#A8461B', // 광고 라벨, 정보 확인 필요 경고
  danger: '#B42318',
} as const;
