// /pages/api/me.ts
import { getUserFromCookie } from '@/app/lib/auth';
import type { NextApiRequest, NextApiResponse } from 'next';


export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const user = getUserFromCookie(req);
  console.log('User from cookie:', user); // ✅ This will print in terminal
  if (user) {
    res.status(200).json({ user });
  } else {
    res.status(401).json({ message: 'Unauthorized' });
  }
}
