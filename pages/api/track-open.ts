import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const email = req.query.email as string;

  // 400 if email is missing
  if (!email) return res.status(400).end();

  try {
    // Trigger Make.com webhook
    await fetch("https://hook.eu2.make.com/gnub4m0flainfntagvfym05hdz5939tm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    // Return 1x1 transparent GIF pixel
    const pixel = Buffer.from(
      "R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
      "base64"
    );
    res.setHeader("Content-Type", "image/gif");
    res.status(200).send(pixel); // ✅ Use send(), do not return object
  } catch (err) {
    console.error(err);
    res.status(500).end(); // Internal server error
  }
}
