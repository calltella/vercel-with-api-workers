"use server";

import { sendMail } from "@/lib/utils/mailgun";

export async function sendMailAction(
  to: string,
  subject: string,
  text: string
) {
  await sendMail({
    to,
    subject,
    text,
  });
}