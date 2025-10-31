import fetch from "node-fetch";
import { google } from "googleapis";
import { promises as fs } from "fs";
import { NextRequest, NextResponse } from "next/server";
import * as cron from "node-cron";

interface LastChecked {
  lastVideoId: string;
  lastLiveId: string | null;
}

const lastCheckedPath = "./last_checked.json";

async function loadLastChecked(): Promise<LastChecked> {
  try {
    const data = await fs.readFile(lastCheckedPath, "utf-8");
    return JSON.parse(data);
  } catch {
    return { lastVideoId: "", lastLiveId: null };
  }
}

async function saveLastChecked(data: LastChecked) {
  await fs.writeFile(lastCheckedPath, JSON.stringify(data, null, 2));
}

async function sendDiscordMessage(message: string) {
  const response = await fetch(
    `https://discord.com/api/v10/channels/${process.env.CHANNEL_ID}/messages`,
    {
      method: "POST",
      headers: {
        Authorization: `Bot ${process.env.DISCORD_TOKEN}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ content: message }),
    }
  );
  if (!response.ok) {
    throw new Error(
      `Discord API error: ${response.status} ${response.statusText}`
    );
  }
}

async function checkLiveStreams(
  lastLiveId: string | null
): Promise<{ newId: string | null; notified: boolean }> {
  const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY,
  });
  const response = await youtube.search.list({
    part: ["snippet"],
    channelId: process.env.YOUTUBE_CHANNEL_ID,
    eventType: "live",
    type: "video",
    maxResults: 1,
  } as any);
  const items = (response as any).data.items || [];
  if (items.length > 0) {
    const live = items[0];
    const videoId = live.id!.videoId!;
    if (videoId !== lastLiveId) {
      const title = live.snippet!.title!;
      const url = `https://www.youtube.com/watch?v=${videoId}`;
      const message = `Halo para <@&${process.env.MENTION_ROLE_ID}>, Pak RT Unyul lagi Stream **${title}** nih, Gas nonton!\n${url}`;
      await sendDiscordMessage(message);
      return { newId: videoId, notified: true };
    }
  }
  return { newId: lastLiveId, notified: false };
}

async function checkNewVideos(
  lastVideoId: string
): Promise<{ newId: string; notified: boolean }> {
  const youtube = google.youtube({
    version: "v3",
    auth: process.env.YOUTUBE_API_KEY,
  });
  const channelResponse = await youtube.channels.list({
    part: ["contentDetails"],
    id: [process.env.YOUTUBE_CHANNEL_ID!],
  } as any);
  const uploadsPlaylistId = (channelResponse as any).data.items![0]
    .contentDetails!.relatedPlaylists!.uploads!;
  const playlistResponse = await youtube.playlistItems.list({
    part: ["snippet"],
    playlistId: uploadsPlaylistId,
    maxResults: 5,
  } as any);
  const items = (playlistResponse as any).data.items || [];
  if (items.length > 0) {
    const latestVideo = items[0];
    const videoId = latestVideo.snippet!.resourceId!.videoId!;
    if (videoId !== lastVideoId) {
      const title = latestVideo.snippet!.title!;
      const url = `https://www.youtube.com/watch?v=${videoId}`;
      const message = `Halo para <@&${process.env.MENTION_ROLE_ID}>, Pak RT Unyul upload video baru nih! **${title}** nih, Gas nonton!\n${url}`;
      await sendDiscordMessage(message);
      return { newId: videoId, notified: true };
    }
  }
  return { newId: lastVideoId, notified: false };
}

async function performChecks(): Promise<{
  liveNotified: boolean;
  videoNotified: boolean;
}> {
  let lastChecked = await loadLastChecked();

  const liveResult = await checkLiveStreams(lastChecked.lastLiveId);
  const videoResult = await checkNewVideos(lastChecked.lastVideoId);

  lastChecked = {
    lastVideoId: videoResult.newId,
    lastLiveId: liveResult.newId,
  };
  await saveLastChecked(lastChecked);

  return {
    liveNotified: liveResult.notified,
    videoNotified: videoResult.notified,
  };
}

// Start cron job every 1 hour
let cronStarted = false;
if (!cronStarted) {
  cron.schedule("0 * * * *", async () => {
    console.log("Running scheduled check...");
    await performChecks();
  });
  cronStarted = true;
}

export async function GET(request: NextRequest) {
  try {
    const result = await performChecks();

    return NextResponse.json({
      success: true,
      message: "Checked and notified if necessary",
      liveNotified: result.liveNotified,
      videoNotified: result.videoNotified,
    });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { success: false, error: (error as Error).message },
      { status: 500 }
    );
  }
}
