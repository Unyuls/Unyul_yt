import { NextRequest, NextResponse } from "next/server";
import { securityLogger } from "@/lib/security";
import contentScanner from "@/lib/content-scanner";

/**
 * SECURITY MONITORING API
 * Endpoint untuk monitoring ancaman keamanan real-time
 */

// GET /api/security/monitor - Get security logs
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get("limit") || "100");
    const type = searchParams.get("type"); // suspicious | blocked | warning

    let logs = securityLogger.getLogs(limit);

    // Filter by type if specified
    if (type) {
      logs = logs.filter((log) => log.type === type);
    }

    // Statistics
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

// POST /api/security/monitor - Report security incident
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

    // Get client IP
    const ip =
      request.headers.get("x-forwarded-for")?.split(",")[0] ||
      request.headers.get("x-real-ip") ||
      "unknown";

    // Log the incident
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

// DELETE /api/security/monitor - Clear old logs
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
