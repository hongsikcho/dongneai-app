import { Placeholder } from '@/components/Placeholder';

/** MY-05 설정 */
export default function My05Screen() {
  return (
    <Placeholder
      screenId="MY-05"
      title="설정"
      description="차단 목록, 약관·개인정보 처리방침, 문의, 로그아웃, 탈퇴."
      links={[{ label: "차단 목록 (MY-06)", href: "/my/blocks" }, { label: "문의하기 (MY-08)", href: "/my/inquiry" }, { label: "회원 탈퇴 (MY-07)", href: "/my/withdraw" }]}
    />
  );
}
