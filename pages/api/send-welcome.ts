import type { NextApiRequest, NextApiResponse } from "next";
import nodemailer from "nodemailer";
import { supabase } from "@/lib/supabaseClient";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method !== "POST") return res.status(405).end(); // No message

  const { name, email } = req.body;

  try {
    // 1️⃣ Insert into Supabase
    const { error } = await supabase.from("profiles").insert([
      { full_name: name, email: email, email_sent: false },
    ]);
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
      from: `"My App" <${process.env.SMTP_USER}>`,
      to: email,
      subject: "🎉 Welcome to Afftitans",
      html: `<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Exclusive Early Bird Offer</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;color:#333;font-family:Arial, sans-serif;padding:30px;border-radius:10px;">

          <!-- Logo -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <a href="https://afftitans.com" target="_blank" style="text-decoration:none;">
                <img src="https://pepeleads.com/uploads/1756199032-7299397.png" 
                     alt="PepeLeads " style="width:200px;height:auto;">
              </a>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td>
              <h2 style="font-size:24px;color:#ff4d4d;margin:0 0 15px 0;">
                 Early Bird Offer 
                <img src="https://pepeleads.com/uploads/1756316873-7946244.png" 
                     alt="Offer Icon" 
                     style="width:30px;height:30px;vertical-align:middle;margin-left:8px;">
              </h2>
              <p style="font-size:15px;line-height:1.6;color:#555;margin:0 0 20px;">
                We’re excited to share an exclusive opportunity for our early partners. 
                Join now and get <strong>200 offers free for 2 weeks</strong>.  
                Plus, enjoy a <strong>20% discount</strong> available only in <b>August & September</b>.  
              </p>
            </td>
          </tr>

          <!-- Offer Details -->
          <tr>
            <td style="background:#ffe6e6;padding:20px;border-radius:8px;text-align:center;">
              <h3 style="color:#ff4d4d;margin:0 0 10px;"> What You Get</h3>
              <p style="margin:0 0 10px;color:#333;">✔ Free listing of 200 offers for 2 weeks</p>
              <p style="margin:0 0 10px;color:#333;">✔ 20% OFF on premium plans (Aug–Sept)</p>
              <p style="margin:0 0 10px;color:#333;">✔ Network-wide promotion + visibility</p>
              <p style="margin:0;color:#333;">
                ✔ Priority support from our 
                <a href="https://afftitans.com/" target="_blank" style="color:#ff4d4d; font-weight:bold; text-decoration:none;">
                  team
                </a>
              </p>
            </td>
          </tr>

          <!-- Website Link -->
          <tr>
            <td align="center" style="padding:20px 0;">
              <a href="https://afftitans.com" 
                 style="font-family:Arial, sans-serif; font-size:14px; color:#ff4d4d; text-decoration:none; font-weight:bold;">
                 🌐 Visit Us: Afftitans.com
              </a>
            </td>
          </tr>

          <!-- Updates Info -->
          <tr>
            <td>
              <h3 style="font-size:18px;color:#333;margin:0 0 10px;">
                Think of AffTitans as your hub to explore:
              </h3>
              <p style="font-size:14px;color:#555;line-height:1.5;margin:0 0 20px;">
                We’ll also keep you posted about:  
                <br>• New offers and opportunities updated regularly
                <br>• Partners joining from across industries
                <br>• Reviews, insights, and success stories from&nbsp;the&nbsp;
                <a href="https://afftitans.com/" target="_blank" style="color:#ff4d4d; font-weight:bold; text-decoration:none;">
                  community
                </a>
              </p>
            </td>
          </tr>

          <!-- Team Contact (Replaced with Logo Image) -->
          <tr>
            <td align="center" style="padding:20px;background:#f9f9f9;border-radius:8px;">
              <a href="https://afftitans.com" target="_blank" style="text-decoration:none;">
                <img src="https://pepeleads.com/uploads/1756199032-7299397.png" 
                     alt="AffTitans Logo" style="width:180px;height:auto;">
              </a>
            </td>
          </tr>

          <!-- Instagram QR Code -->
          <tr>
            <td align="center" style="padding:30px 0 0 0;">
              <table width="100%" cellpadding="0" cellspacing="0" style="max-width:600px;">
                <tr>
                  <!-- Left: Text -->
                  <td valign="middle" style="width:55%; padding-right:20px; text-align:left; font-family:Arial, sans-serif; font-size:15px; color:#444;">
                    <p style="margin:0 0 12px; font-size:18px; font-weight:bold; color:#222;"> Follow us on Instagram</p>
                    <p style="margin:0; font-size:14px; color:#555; line-height:1.6;">
                      Stay updated with our latest offers, expert tips, and exclusive content.  
                      <br> Don’t miss out — scan the code and join our Instagram family today! 
                    </p>
                  </td>
                  <!-- Right: QR Code -->
                  <td valign="middle" style="width:45%; text-align:right;">
                    <img src="https://pepeleads.com/uploads/1756201293-5430848.jpeg" 
                         alt="Instagram QR Code" 
                         style="width:200px; height:200px; border-radius:10px;">
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer with LinkedIn -->
          <tr>
            <td align="center" style="padding:25px 0 0 0; border-top:1px solid #ddd; margin-top:20px;">
              <p style="font-family:Arial, sans-serif; font-size:13px; color:#777; margin:0 0 10px;">
                Let’s connect professionally   
              </p>
              <a href="https://www.linkedin.com/in/aff-titans-309866380/" target="_blank" style="text-decoration:none;">
                <img src="https://cdn-icons-png.flaticon.com/512/1384/1384014.png" 
                     alt="LinkedIn" style="width:30px;height:30px;">
              </a>
              <p style="font-family:Arial, sans-serif; font-size:12px; color:#aaa; margin:10px 0 0;">
                © 2025 Afftitans. All rights reserved.
              </p>
            </td>
          </tr>

          <!-- 1x1 Tracking Pixel -->
<tr>
  <td>
    <img src="http://dummy-mailer.vercel.app/api/track-open?email=${email}" width="1" height="1" style="display:none;" />
  </td>
</tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
`,
    });

    // 3️⃣ Update email_sent to true
    await supabase.from("profiles").update({ email_sent: true }).eq("email", email);

    res.status(204).end(); // ✅ 204 No Content, nothing shown on frontend
  } catch (err) {
    console.error(err); // logged in server console only
    res.status(500).end(); // frontend sees nothing
  }
}
