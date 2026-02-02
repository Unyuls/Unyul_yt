import { NextRequest, NextResponse } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const { token } = await request.json();

    const validToken = process.env.NEXT_PUBLIC_NOTIFY_TOKEN;

    if (!token || token !== validToken) {
      return NextResponse.json(
        { success: false, message: "Invalid access token" },
        { status: 401 },
      );
    }

    return NextResponse.json({
      success: true,
      message: "Access granted",
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, message: "Internal server error" },
      { status: 500 },
    );
  }
}
