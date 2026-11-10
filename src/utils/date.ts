const STALE_DAYS = 180;

/** 정보 확인일 표시. 6개월이 지났거나 확인 전이면 stale. */
export function formatVerified(verifiedAt: string | null): { text: string; stale: boolean } {
  if (!verifiedAt) return { text: '운영자 확인 전', stale: true };
  const days = Math.floor((Date.now() - Date.parse(verifiedAt)) / 86_400_000);
  const date = verifiedAt.replaceAll('-', '.');
  if (days > STALE_DAYS) return { text: `정보 확인 ${date} · 확인 필요`, stale: true };
  return { text: `정보 확인 ${date}`, stale: false };
}
