
import { DB, readDB } from "@lib/DB";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const POST = async (request: NextRequest) => {
  readDB();

  const body = await request.json();

  const check = DB.users.find((check : any) => check.username === body.username && check.password === body.password);

  if(!check) {
    return NextResponse.json( 
    {
      ok: false,
      message: "Username or Password is incorrect",
    },
      { status: 400 }
    );
  }

  const token = nanoid();

  return NextResponse.json({ ok: true, token });
};
