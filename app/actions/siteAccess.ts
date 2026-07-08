"use server";

import { checkSiteAccessCode, grantSiteAccess } from "@/lib/siteAccess";

export async function unlockSite(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const code = String(formData.get("code") ?? "");
  if (!checkSiteAccessCode(code)) {
    return { success: false, error: "Incorrect code." };
  }
  await grantSiteAccess();
  return { success: true };
}
