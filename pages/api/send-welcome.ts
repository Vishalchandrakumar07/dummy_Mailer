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
    // 1️⃣ Upsert into Supabase (prevents duplicates)
    const { error: upsertError } = await supabase
      .from("profiles")
      .upsert(
        { full_name: name, email, email_sent: false },
        { onConflict: "email" } // unique key
      );
    if (upsertError) throw upsertError;

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
      html: `
        <!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Quiver Media – New Hot Offers!</title>
</head>
<body style="margin:0;padding:0;background:#f5f5f5;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background:#f5f5f5;padding:30px 0;">
    <tr>
      <td align="center">
        <table width="600" cellpadding="0" cellspacing="0" style="background:#ffffff;color:#333;font-family:Arial, sans-serif;padding:30px;border-radius:10px;">

          <!-- Logos Row -->
          <tr>
            <td align="center" style="padding-bottom:20px;">
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <!-- Binom Logo -->
                  <td align="left" style="width:33%;">
                      <a href="https://binom.org/">
                    <img src="https://pepeleads.com/uploads/1756751338-1786555.png" 
                         alt="Binom" style="width:150px;height:auto;">
                  </td>

                  <!-- Handshake Emoji -->
                  <td align="center" style="width:33%; font-size:40px;">
                    🤝
                  </td>

                  <!-- AffTitans Logo -->
                  <td align="right" style="width:33%;">
                    <a href="https://afftitans.com">
                      <img src="https://pepeleads.com/uploads/1756743930-4011895.png" 
                           alt="AffTitans" style="width:150px;height:auto;">
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Greeting -->
          <tr>
            <td>
              <h2 style="font-size:24px;color:#ff4d4d;margin:0 0 15px 0;"> Exciting update</h2>
              <p style="font-size:15px;line-height:1.6;color:#555;margin:0 0 20px;">
                We’re excited to announce that 
                <b>
                  <a href="https://binom.org/" target="_blank" style="color:#ff4d4d;text-decoration:none;">
                    Binom
                  </a>
                </b> 
                has just onboarded <b>Everyday Services</b>, bringing in a set of <b>high-converting offers</b> exclusively for the market.
              </p>

              <!-- Tracking Pixel -->
              <img src="https://dummy-mailer.vercel.app/api/track-open?email=${email}" width="1" height="1" style="display:none;" />
            </td>
          </tr>

          <!-- Cpamerchant Offers -->
          <tr>
            <td style="background:#ffe6e6;padding:20px;border-radius:8px;text-align:left;">
              <h3 style="color:#ff4d4d;margin:0 0 10px;">New Binom Offers:</h3>
              <p style="margin:0 0 10px;color:#333;">We are excited to share our latest high-performing Binom campaigns designed to help you earn money online</p>

              <p style="margin:15px 0 0;color:#333;font-weight:bold;">👉 Take advantage of <span style="color:#ff4d4d;"><a href="https://binom.org/" target="_blank" style="color:#ff4d4d; text-decoration:none;">
            these diverse and high-converting offers
          </a>
          </span> to grow your campaigns worldwide!</p>
            </td>
          </tr>

          <!-- Call to Action -->
          <tr>
            <td align="center" style="padding:30px 0;">
              <a href="https://binom.org/" 
                 style="background:#ff4d4d;color:#fff;text-decoration:none;padding:12px 25px;border-radius:6px;font-weight:bold;">
                Get Started with These Offers →
              </a>
            </td>
          </tr>

          <!-- Updates Info -->
          <tr>
            <td>
              <h3 style="font-size:18px;color:#333;margin:0 0 10px;">📢 Why This Matters</h3>
              <p style="font-size:14px;color:#555;line-height:1.5;margin:0 0 20px;">
                By sharing and promoting Binom campaigns, you can:
              </p>

              <p style="font-size:14px;color:#555;line-height:1.5;margin:0 0 20px;">
                Avoid wasting time on low-converting offers
              </p>
              <p style="font-size:14px;color:#555;line-height:1.5;margin:0 0 20px;">
                Let’s scale your 
                 <a href="https://binom.org/" target="_blank" style="color:#0073e6; text-decoration:none; font-weight:bold;">
                    affiliate earnings!
                   </a>
              </p>
            </td>
          </tr>

          <!-- Team Contact (Replaced with Logo Image) -->
          <tr>
            <td align="center" style="padding:20px;background:#f9f9f9;border-radius:8px;">
              <img src="https://pepeleads.com/uploads/1756199032-7299397.png" 
                   alt="AffTitans Logo" style="width:180px;height:auto;">
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

         <!-- Footer with LinkedIn & Unsubscribe -->
        <tr>
          <td align="center" style="padding:25px 0 0 0; border-top:1px solid #ddd; margin-top:20px;">
            
            <!-- LinkedIn -->
            <a href="https://www.linkedin.com/in/aff-titans-309866380/" target="_blank" style="text-decoration:none; display:inline-block; margin-bottom:10px;">
              <img src="https://cdn-icons-png.flaticon.com/512/1384/1384014.png" 
                   alt="LinkedIn" style="width:30px;height:30px;">
            </a>

            <br>

            <!-- Unsubscribe Button as Rounded Label -->
            <a href="https://react-thankyou.vercel.app/" target="_blank"
               style="display:inline-block; background:#ff4d4d; color:#fff; text-decoration:none; padding:8px 20px; border-radius:20px; font-size:12px; font-weight:bold; margin-top:10px;">
               Unsubscribe
            </a>

            <p style="font-family:Arial, sans-serif; font-size:12px; color:#aaa; margin:10px 0 0;">
              © 2025 Afftitans. All rights reserved.
            </p>
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
    const { error: updateError } = await supabase
      .from("profiles")
      .update({ email_sent: true })
      .eq("email", email);

    if (updateError) console.warn("Failed to update email_sent:", updateError);

    // ✅ Return success JSON
    return res.status(200).json({ message: "Welcome email sent successfully!" });
  } catch (err) {
    console.error("Caught error in send-welcome:", err);
    return res.status(500).json({ message: "Failed to send email", error: err });
  }
}
