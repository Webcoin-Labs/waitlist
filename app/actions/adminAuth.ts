"use server";

import { redirect } from "next/navigation";
import { checkAdminPassphrase, setAdminCookie, clearAdminCookie } from "@/lib/adminAuth";

export async function adminLogin(formData: FormData): Promise<{ success: boolean; error?: string }> {
  const passphrase = String(formData.get("passphrase") ?? "");
  if (!checkAdminPassphrase(passphrase)) {
    return { success: false, error: "Incorrect passphrase." };
  }
  await setAdminCookie();
  return { success: true };
}

export async function adminLogout() {
  await clearAdminCookie();
  redirect("/admin");
}
