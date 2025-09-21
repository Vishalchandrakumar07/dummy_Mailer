import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") {
    return res.status(405).json({ message: "Method Not Allowed" });
  }

  const { name, email } = req.body;

  if (!name || !email) {
    return res.status(400).json({ message: "Name and email are required" });
  }

  try {
    // 1️⃣ Upsert into Supabase (insert or update)
    const { error } = await supabase
      .from("profiles")
      .upsert(
        { full_name: name, email: email, email_sent: true }, // data
        { onConflict: "email" } // unique column to check
      );
    if (error) throw error;

    // 2️⃣ Send Welcome Email
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: Number(process.env.SMTP_PORT),
      secure: false,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });

    await transporter.sendMail({
      from: `"AffTitans" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "🎉 Welcome to AffTitans",
      html: `
        <!DOCTYPE html>
        <html>
        <head><meta charset="UTF-8"><title>Welcome</title></head>
        <body>
          <h2>Hello ${name}, welcome!</h2>
          <p>Thank you for joining AffTitans.</p>
          <img src="https://dummy-mailer.vercel.app/api/track-open?email=${email}" width="1" height="1" style="display:none;" />
        </body>
        </html>
      `,
    });

    return res.status(200).json({ message: "Welcome email sent successfully!" });
  } catch (err) {
    console.error("Caught error in send-welcome:", err);
    return res.status(500).json({ message: "Failed to send email" });
  }
}
