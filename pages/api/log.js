/**
 * 用于 Vercel 后台记录日志
 */
export default async function handler(req, res) {
  if (req.method === 'POST') {
    const logData = req.body;
    console.error(logData);

    res.status(200).json({ status: 'success', message: 'Logs received' });
  }
}
