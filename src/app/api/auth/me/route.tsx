import { verify } from 'jsonwebtoken';
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function GET() {
  const cookieStore = cookies();
  const token = (await cookieStore).get('accessToken');

  console.log("Token: ", token);

  if (!token) {
    return NextResponse.json(
      { message: "Token not found." },
      { status: 401 }
    );
  }

  try {
    const secret = process.env.ACCESS_TOKEN_SECRET;
    if (!secret) {
      throw new Error("ACCESS_TOKEN_SECRET not defined");
    }

    const decoded = verify(token.value, secret);

    console.log("Decoded: ", decoded)
    return NextResponse.json(
      { message: "Authorized", 
        status : 200,
        data: decoded },
    );
  } catch (err) {
    return NextResponse.json(
      { message: "Invalid token", 
        data: err,
        status: 401
       },
    );
  }
}
