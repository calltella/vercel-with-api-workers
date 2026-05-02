// lib/utils/mailgun.ts

export async function sendMail({
  to,
  subject,
  text,
}: {
  to: string;
  subject: string;
  text: string;
}) {
  const domain = process.env.MAILGUN_DOMAIN!;
  const apiKey = process.env.MAILGUN_API_KEY!;
  const from = process.env.MAIL_FROM!;

  const url = `https://api.mailgun.net/v3/${domain}/messages`;

  const form = new URLSearchParams();

  form.append("from", from);
  form.append("to", to);
  form.append("subject", subject);
  form.append("text", text);

  const auth = `api:${apiKey}`;
  const encoded = typeof btoa !== "undefined"
    ? btoa(auth)
    : Buffer.from(auth).toString("base64");

  const res = await fetch(url, {
    method: "POST",
    headers: {
      Authorization: `Basic ${encoded}`,
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: form,
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(JSON.stringify(data));
  }
  //console.log(`data: ${JSON.stringify(data)}`);
  return data;
}