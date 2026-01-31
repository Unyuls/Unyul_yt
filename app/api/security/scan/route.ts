import { NextRequest, NextResponse } from "next/server";
import contentScanner from "@/lib/content-scanner";

/**
 * CONTENT SCAN API
 * Endpoint untuk scan konten mencari ancaman seperti iklan judol, XSS, SQL injection, dll
 */

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { content, detailed = false } = body;

    if (!content) {
      return NextResponse.json(
        { success: false, error: "Content is required" },
        { status: 400 },
      );
    }

    // Scan the content
    const scanResult = contentScanner.scan(content);

    // Check if content should be blocked
    const shouldBlock = contentScanner.shouldBlock(content);

    let response: any = {
      success: true,
      isClean: scanResult.isClean,
      shouldBlock,
      score: scanResult.score,
      threatCount: scanResult.threats.length,
    };

    // Add detailed information if requested
    if (detailed) {
      response.threats = scanResult.threats;
      response.report = contentScanner.getReport(content);
    } else {
      // Just summary
      response.threatTypes = [
        ...new Set(scanResult.threats.map((t) => t.type)),
      ];
      response.highestSeverity =
        scanResult.threats.length > 0
          ? scanResult.threats.reduce(
              (max, t) => {
                const severityOrder: Record<string, number> = {
                  low: 1,
                  medium: 2,
                  high: 3,
                  critical: 4,
                };
                const maxOrder = severityOrder[max] || 0;
                const tOrder = severityOrder[t.severity] || 0;
                return tOrder > maxOrder ? t.severity : max;
              },
              "low" as "low" | "medium" | "high" | "critical",
            )
          : null;
    }

    return NextResponse.json(response);
  } catch (error) {
    console.error("Content scan error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to scan content" },
      { status: 500 },
    );
  }
}

// GET endpoint for testing with query params
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const content = searchParams.get("content");

    if (!content) {
      return NextResponse.json(
        {
          success: false,
          error: "Content query parameter is required",
          usage: "GET /api/security/scan?content=your+content+here",
        },
        { status: 400 },
      );
    }

    const scanResult = contentScanner.scan(content);
    const shouldBlock = contentScanner.shouldBlock(content);

    return NextResponse.json({
      success: true,
      isClean: scanResult.isClean,
      shouldBlock,
      score: scanResult.score,
      report: contentScanner.getReport(content),
    });
  } catch (error) {
    console.error("Content scan error:", error);
    return NextResponse.json(
      { success: false, error: "Failed to scan content" },
      { status: 500 },
    );
  }
}
