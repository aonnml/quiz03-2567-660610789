import { NextResponse } from "next/server";

export const GET = async () => {
  return NextResponse.json({
    ok: true,
    fullName: "Ratchanon Chaiwong",
    studentId: "660610789",
  });
};
