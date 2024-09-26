import { DB, readDB, writeDB } from "@lib/DB";
import { checkToken } from "@lib/checkToken";
import { nanoid } from "nanoid";
import { NextRequest, NextResponse } from "next/server";

export const GET = async () => {
  readDB();
  return NextResponse.json({
    ok: true,
    rooms: DB.rooms,
    totalRooms: DB.rooms.length,
  });
};

export const POST = async (request: NextRequest) => {
  const payload = checkToken();
  const body = await request.json();

  if(!payload) {
    return NextResponse.json(
    {
      ok: false,
      message: "Invalid token",
    },
      { status: 401 }
    );
  }

  readDB();
  const checkroom = DB.rooms.find((room) => room.roomName === body.roomName);
  if(!checkroom) {
    return NextResponse.json(
    {
      ok: false,
      message: `Room ${"replace this with room name"} already exists`,
    },
      { status: 400 }
  );
  }

  const roomId = nanoid();
  DB.rooms.push({
    roomId,
    roomName: body.roomName,
  });
  //call writeDB after modifying Database
  writeDB();

  return NextResponse.json({
    ok: true,
    roomId,
    message: `Room ${"replace this with room name"} has been created`,
  });
};
