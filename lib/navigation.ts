// lib/navigation.ts

"use client";

import {useRouter} from "next/navigation";

export function useAnchorNavigation() {
  const router = useRouter();

  const navigateToAnchor = (anchorId: string) => {
    // Memastikan kita kembali ke root ("/") dengan anchor
    router.push(`/#${anchorId}`);
  };

  return {navigateToAnchor};
}
