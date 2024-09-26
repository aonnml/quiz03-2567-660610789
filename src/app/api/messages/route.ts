import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async (request: NextRequest) => {
  readDB();

  const roomId = request.nextUrl.searchParams.get('roomId');

  const check_room = DB.rooms.find((rooms : any) => rooms.roomId === roomId);
  
  if(!check_room){
  return NextResponse.json(
    {
      ok: false,
      message: `Room is not found`,
    },
    { status: 404 }
    );
  }

  return NextResponse.json(
    {
      ok: true,
      messages: DB.messages.filter((messages : any) => messages.roomId === roomId),
    }
  )
};

export const POST = async (request: NextRequest) => {
  readDB();

  const body = await request.json();

  const check_room = DB.rooms.find((rooms : any) => rooms.roomId === body.roomId);

  if(!check_room){
    return NextResponse.json(
    {
      ok: false,
      message: `Room is not found`,
    },
      { status: 404 }
  );
  }

  const messageId = nanoid();

  DB.messages.push({
    roomId: body.roomId,
    messageId: messageId,
    messageText: body.messageText,
  });

  writeDB();

  return NextResponse.json({
    ok: true,
    messageId,
    message: "Message has been sent",
  });
};

export const DELETE = async (request: NextRequest) => {
  const payload = checkToken();
  const body = await request.json();

  if(!payload){
    return NextResponse.json(
    {
      ok: false,
      message: "Invalid token",
    },
      { status: 401 }
  );
  }

  readDB();
  const check_message = DB.messages.find((messege : any) => messege.messageId === body.message);
  if(!check_message) {
    return NextResponse.json(
    {
      ok: false,
      message: "Message is not found",
    },
      { status: 404 }
  );
  }

  DB.messages.splice(DB.messages.indexOf(check_message));
  writeDB();

  return NextResponse.json({
    ok: true,
    message: "Message has been deleted",
  });
};
