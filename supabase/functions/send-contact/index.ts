import { serve } from "https://deno.land/std@0.224.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const RESEND_API_KEY = Deno.env.get("RESEND_API_KEY");
const TO_EMAIL = "srujanchowdary24@gmail.com";
const FROM_EMAIL = Deno.env.get("FROM_EMAIL") || "portfolio@resend.dev";

interface ContactPayload {
  name?: string;
  email?: string;
  message?: string;
}

function validate(p: ContactPayload): string | null {
  if (!p.name || !p.name.trim()) return "Name is required.";
  if (!p.email || !p.email.trim()) return "Email is required.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(p.email)) return "A valid email is required.";
  if (!p.message || p.message.trim().length < 10) return "Message must be at least 10 characters.";
  if (p.message.length > 5000) return "Message is too long.";
  return null;
}

serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (!RESEND_API_KEY) {
      return new Response(
        JSON.stringify({
          error:
            "Email service is not configured yet. The site owner needs to add a RESEND_API_KEY secret. See setup instructions.",
        }),
        { status: 503, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const payload = (await req.json()) as ContactPayload;
    const validationError = validate(payload);
    if (validationError) {
      return new Response(
        JSON.stringify({ error: validationError }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const { name, email, message } = payload;
    const html = `
      <div style="font-family: Inter, Arial, sans-serif; max-width: 560px; margin: auto; padding: 24px;">
        <h2 style="color: #ff8a3d;">New message from your portfolio</h2>
        <p><strong>Name:</strong> ${escapeHtml(name!)}</p>
        <p><strong>Email:</strong> ${escapeHtml(email!)}</p>
        <hr style="border: none; border-top: 1px solid #eee;" />
        <p style="white-space: pre-wrap;">${escapeHtml(message!)}</p>
        <hr style="border: none; border-top: 1px solid #eee;" />
        <p style="color: #888; font-size: 12px;">Sent from srujan-portfolio contact form.</p>
      </div>
    `;
    const text = `New message from your portfolio\n\nName: ${name}\nEmail: ${email}\n\n${message}\n\n— from srujan-portfolio contact form`;

    const resendRes = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${RESEND_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from: FROM_EMAIL,
        to: TO_EMAIL,
        reply_to: email,
        subject: `Portfolio contact: ${name}`,
        html,
        text,
      }),
    });

    if (!resendRes.ok) {
      const errBody = await resendRes.text();
      console.error("Resend error:", resendRes.status, errBody);
      return new Response(
        JSON.stringify({ error: "Email delivery failed. Please try again later." }),
        { status: 502, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    return new Response(
      JSON.stringify({ ok: true }),
      { status: 200, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  } catch (err) {
    console.error("send-contact error:", err);
    return new Response(
      JSON.stringify({ error: "Something went wrong. Please try again later." }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

function escapeHtml(s: string): string {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}
