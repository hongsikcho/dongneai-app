import { Placeholder } from '@/components/Placeholder';

/** FEED-02 글 상세 */
export default function Feed02Screen() {
  return (
    <Placeholder
      screenId="FEED-02"
      title="글 상세"
      description="본문, 이미지, 장소 태그, 공감, 댓글·대댓글, 더보기(수정·삭제·신고·차단)."
      links={[{ label: "작성자 프로필 (USER-01)", href: "/users/1" }, { label: "이미지 뷰어 (MOD-04)", href: "/modals/image-viewer" }]}
    />
  );
}
