import { Placeholder } from '@/components/Placeholder';

/** FEED-03 글 작성·수정 */
export default function Feed03Screen() {
  return (
    <Placeholder
      screenId="FEED-03"
      title="글 작성·수정"
      description="카테고리, 본문, 이미지 첨부, 장소 태그(MOD-01), 연령대."
      links={[{ label: "장소 태그 선택 (MOD-01)", href: "/modals/place-picker" }]}
    />
  );
}
