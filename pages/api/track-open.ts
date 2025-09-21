import type { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const email = req.query.email as string;

  if (!email) return res.status(400).end();

  try {
    // Trigger Make.com webhook
    const webhookResponse = await fetch("https://hook.eu2.make.com/gnub4m0flainfntagvfym05hdz5939tm", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    if (!webhookResponse.ok) {
      const text = await webhookResponse.text();
      console.error("Make webhook failed:", webhookResponse.status, text);
      return res.status(500).end();
    }

    // 1x1 transparent GIF (tracking pixel)
    const pixel = Buffer.from(
      "R0lGODlhAQABAPAAAP///wAAACH5BAAAAAAALAAAAAABAAEAAAICRAEAOw==",
      "base64"
    );
    res.setHeader("Content-Type", "image/gif");
    res.setHeader("Content-Length", pixel.length.toString());
    return res.status(200).send(pixel);
  } catch (err) {
    console.error("Error in /api/track-open:", err);
    return res.status(500).end();
  }
}
