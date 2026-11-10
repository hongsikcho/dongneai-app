import { Placeholder } from '@/components/Placeholder';

/** MOD-01 장소 태그 선택 */
export default function Mod01Screen() {
  return (
    <Placeholder
      screenId="MOD-01"
      title="장소 태그 선택"
      description="장소 검색, 결과 목록, 없으면 장소 등록(PLACE-04)으로 이동."
      links={[{ label: "장소 등록 (PLACE-04)", href: "/places/new" }]}
    />
  );
}
