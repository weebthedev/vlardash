// pages/api/auth.ts
import type { NextApiRequest, NextApiResponse } from 'next'

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  res.redirect('http://localhost:3002/auth/discord')
}
