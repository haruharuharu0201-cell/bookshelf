import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const { password } = await request.json();

  if (!password) {
    return Response.json({ error: "パスワードが必要です" }, { status: 400 });
  }

  if (password !== process.env.ADMIN_PASSWORD) {
    return Response.json({ error: "パスワードが違います" }, { status: 401 });
  }

  return Response.json({ success: true });
}
