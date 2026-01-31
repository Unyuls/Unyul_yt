import { NextRequest, NextResponse } from "next/server";
import { securityLogger } from "@/lib/security";
import contentScanner from "@/lib/content-scanner";

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const type = searchParams.get("type");

    let logs = securityLogger.getLogs(limit);

    if (type) {
      logs = logs.filter((log) => log.type === type);
    }

    const stats = {
      total: logs.length,
      suspicious: logs.filter((l) => l.type === "suspicious").length,
      blocked: logs.filter((l) => l.type === "blocked").length,
      warning: logs.filter((l) => l.type === "warning").length,
    };

    return NextResponse.json({
      success: true,
      stats,
      logs,
    });
  } catch (error) {
    console.error("Security monitor error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to fetch security logs" },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { type, reason, details } = body;

    if (!type || !reason) {
      return NextResponse.json(
        { success: false, error: "Type and reason are required" },
        { status: 400 },
      );
    }

    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    securityLogger.log({
      type,
      ip,
      reason,
      details,
    });
    securityLogger.log({
      type,
      ip,
      reason,
      details,
    });

    return NextResponse.json({
      success: true,
      message: "Security incident logged",
    });
  } catch (error) {
    console.error("Security report error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to report incident" },
      { status: 500 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const olderThanHours = parseInt(searchParams.get("hours") || "24");
    const olderThanMs = olderThanHours * 60 * 60 * 1000;

    securityLogger.clearOldLogs(olderThanMs);

    return NextResponse.json({
      success: true,
      message: `Cleared logs older than ${olderThanHours} hours`,
    });
  } catch (error) {
    console.error("Security clear error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to clear logs" },
      { status: 500 },
    );
  }
}
