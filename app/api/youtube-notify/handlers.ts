import { NextRequest, NextResponse } from "next/server";
import { CONFIG } from "./config";
import { loadLastChecked, saveLastChecked, refreshFromFile } from "./storage";
import { sendDiscordEmbed } from "./discord";
import { performChecks } from "./service";
import { DiscordEmbed } from "./types";

// Logging helper
const log = (action: string, details: Record<string, unknown>) => {
  const timestamp = new Date().toISOString();
  console.log(
    `[HANDLER ${timestamp}] ${action}:`,
    JSON.stringify(details, null, 2),
  );
};

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const force = searchParams.get("force") === "true";
  const status = searchParams.get("status") === "true";

  log("REQUEST_RECEIVED", {
    type: "GET",
    force,
    status,
    url: request.url,
  });

  const missingEnvVars = [];
  if (!CONFIG.DISCORD_TOKEN) missingEnvVars.push("DISCORD_TOKEN");
  if (!CONFIG.CHANNEL_ID) missingEnvVars.push("CHANNEL_ID");
  if (!CONFIG.YOUTUBE_API_KEY) missingEnvVars.push("YOUTUBE_API_KEY");
  if (!CONFIG.YOUTUBE_CHANNEL_ID) missingEnvVars.push("YOUTUBE_CHANNEL_ID");
  if (!CONFIG.MENTION_ROLE_ID) missingEnvVars.push("MENTION_ROLE_ID");

  if (missingEnvVars.length > 0) {
    return NextResponse.json(
      {
        success: false,
        error: `Missing environment variables: ${missingEnvVars.join(", ")}`,
      },
      { status: 500 },
    );
  }

  try {
    if (status) {
      // Force refresh from file to ensure we get the latest data
      const lastChecked = await refreshFromFile();
      const serverTime = new Date().toISOString();

      log("STATUS_REQUEST", {
        lastCheckedAt: lastChecked.lastCheckedAt,
        serverTime,
        lastVideoId: lastChecked.lastVideoId,
      });

      return NextResponse.json({
        success: true,
        status: "active",
        lastChecked,
        serverTime,
        config: {
          channelId: CONFIG.YOUTUBE_CHANNEL_ID,
          channelName: CONFIG.CHANNEL_NAME,
          discordChannelId: CONFIG.CHANNEL_ID,
        },
      });
    }

    if (force) {
      const testEmbed: DiscordEmbed = {
        title: "Test Notification",
        description:
          "This is a test notification from the YouTube notification bot. If you see this, the bot is working correctly!",
        color: 0x00ff00,
        author: {
          name: CONFIG.CHANNEL_NAME,
          icon_url: CONFIG.CHANNEL_AVATAR,
        },
        footer: {
          text: "Test notification",
        },
        timestamp: new Date().toISOString(),
      };

      const sent = await sendDiscordEmbed(
        `**Para** <@&${CONFIG.MENTION_ROLE_ID}>\n\nsorry yak, ini test notif`,
        testEmbed,
      );

      // Update lastCheckedAt even for test notifications
      const currentData = await loadLastChecked();
      const newTimestamp = new Date().toISOString();
      await saveLastChecked({
        ...currentData,
        lastCheckedAt: newTimestamp,
      });

      log("TEST_NOTIFICATION_SENT", {
        success: sent,
        newLastCheckedAt: newTimestamp,
      });

      return NextResponse.json({
        success: sent,
        message: sent
          ? "Test notification sent!"
          : "Failed to send test notification",
        timestamp: newTimestamp,
        checkedAt: newTimestamp,
      });
    }

    const result = await performChecks();

    log("CHECK_COMPLETED", {
      liveNotified: result.liveNotified,
      videoNotified: result.videoNotified,
      checkedAt: result.checkedAt,
    });

    return NextResponse.json({
      success: true,
      message: "Check completed successfully",
      ...result,
    });
  } catch (error) {
    log("ERROR", {
      message: (error as Error).message,
      stack: (error as Error).stack,
    });
    console.error("Error in YouTube notification check:", error);
    return NextResponse.json(
      {
        success: false,
        error: (error as Error).message,
        timestamp: new Date().toISOString(),
      },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const contentType = request.headers.get("content-type") || "";
    if (contentType.includes("application/x-www-form-urlencoded")) {
      const body = await request.text();
      const params = new URLSearchParams(body);
      const challenge = params.get("hub.challenge");

      if (challenge) {
        console.log("WebSub verification challenge received");
        return new NextResponse(challenge, {
          status: 200,
          headers: { "Content-Type": "text/plain" },
        });
      }
    }

    if (
      contentType.includes("application/atom+xml") ||
      contentType.includes("text/xml")
    ) {
      const xmlBody = await request.text();
      console.log("Received WebSub notification:", xmlBody.substring(0, 500));

      const videoIdMatch = xmlBody.match(/<yt:videoId>([^<]+)<\/yt:videoId>/);
      const titleMatch = xmlBody.match(/<title>([^<]+)<\/title>/);

      if (videoIdMatch) {
        const videoId = videoIdMatch[1];
        const title = titleMatch ? titleMatch[1] : "New Video";

        console.log(`WebSub notification for video: ${videoId} - ${title}`);

        await performChecks();
      }

      return NextResponse.json({
        success: true,
        message: "WebSub notification processed",
      });
    }

    const result = await performChecks();
    return NextResponse.json({
      success: true,
      message: "Check triggered via POST",
      ...result,
    });
  } catch (error) {
    console.error("Error in POST handler:", error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 },
    );
  }
}
