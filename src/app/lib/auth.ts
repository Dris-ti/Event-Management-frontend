import jwt from 'jsonwebtoken';
import { NextApiRequest } from 'next';

const JWT_SECRET = process.env.ACCESS_TOKEN_SECRET || 'tour-guide-2024';

export function getUserFromCookie(req: NextApiRequest) {
  const cookie = req.headers.cookie || '';
  
  // Find the 'accessToken' cookie from the request headers
  const token = cookie.split('; ').find(row => row.startsWith('accessToken='))?.split('=')[1];

  if (!token) return null;

  try {
    const decoded = jwt.verify(token, JWT_SECRET);
    console.log("Decoded:", decoded);
    return decoded;
  } catch (err) {
    console.error("JWT verification error:", err);
    return null;
  }
}
