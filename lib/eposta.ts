/**
 * Resend ile e-posta gönderir. RESEND_API_KEY tanımlı değilse sessizce false döner
 * (uygulama yine çalışır; sadece e-posta gönderilmez).
 */
export async function epostaGonder(
  konu: string,
  html: string
): Promise<boolean> {
  const key = process.env.RESEND_API_KEY;
  const alici = process.env.BILDIRIM_EPOSTA || "erdemkurt@live.com";
  const gonderen = process.env.BILDIRIM_FROM || "Mevzuat <onboarding@resend.dev>";
  if (!key) return false;

  try {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${key}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ from: gonderen, to: [alici], subject: konu, html }),
    });
    return res.ok;
  } catch {
    return false;
  }
}
