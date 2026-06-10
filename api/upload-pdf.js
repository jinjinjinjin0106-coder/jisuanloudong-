// Vercel Serverless Function — 上传 PDF 到 Blob Storage
// 依赖: npm install @vercel/blob

import { put } from '@vercel/blob';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { pdf } = req.body;
    if (!pdf) return res.status(400).json({ error: 'pdf required' });

    // pdf is a base64 string from client-side jsPDF
    const buffer = Buffer.from(pdf, 'base64');
    const result = await put('plan-' + Date.now() + '.pdf', buffer, {
      access: 'public',
      contentType: 'application/pdf',
    });

    res.status(200).json({ url: result.url });
  } catch (e) {
    console.error(e);
    res.status(500).json({ error: String(e) });
  }
}
