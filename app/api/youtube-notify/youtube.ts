import { google } from "googleapis";
import { CONFIG } from "./config";
import { YouTubeVideoItem } from "./types";
import {
  sendDiscordEmbed,
  buildLiveStreamEmbed,
  buildUpcomingStreamEmbed,
  buildNewVideoEmbed,
} from "./discord";

function getYouTubeClient() {
  return google.youtube({
    version: "v3",
    auth: CONFIG.YOUTUBE_API_KEY,
  });
}

export async function checkLiveStreams(
  lastLiveId: string | null,
  lastLiveStatus: "live" | "upcoming" | "none",
): Promise<{
  newId: string | null;
  newStatus: "live" | "upcoming" | "none";
  notified: boolean;
  type: "live" | "upcoming" | null;
}> {
  const youtube = getYouTubeClient();

  try {
    const liveResponse = await youtube.search.list({
      part: ["snippet"],
      channelId: CONFIG.YOUTUBE_CHANNEL_ID,
      eventType: "live",
      type: ["video"],
      maxResults: 1,
    });

    const liveItems = liveResponse.data.items || [];

    if (liveItems.length > 0) {
      const live = liveItems[0] as YouTubeVideoItem;
      const videoId = live.id?.videoId || "";

      if (videoId !== lastLiveId || lastLiveStatus !== "live") {
        const content = `**Halo para** <@&${CONFIG.MENTION_ROLE_ID}>\n\nPak RT ${CONFIG.CHANNEL_NAME} lagi live streaming nih! Buruan gabung sebelum ketinggalan!`;
        const embed = buildLiveStreamEmbed(live);
        const sent = await sendDiscordEmbed(content, embed);

        return {
          newId: videoId,
          newStatus: "live",
          notified: sent,
          type: "live",
        };
      }

      return {
        newId: videoId,
        newStatus: "live",
        notified: false,
        type: null,
      };
    }
  } catch (error) {
    console.error("Error checking live streams:", error);
  }

  try {
    const upcomingResponse = await youtube.search.list({
      part: ["snippet"],
      channelId: CONFIG.YOUTUBE_CHANNEL_ID,
      eventType: "upcoming",
      type: ["video"],
      maxResults: 1,
    });

    const upcomingItems = upcomingResponse.data.items || [];

    if (upcomingItems.length > 0) {
      const upcoming = upcomingItems[0] as YouTubeVideoItem;
      const videoId = upcoming.id?.videoId || "";

      if (videoId !== lastLiveId && lastLiveStatus !== "upcoming") {
        const content = `**Halo para** <@&${CONFIG.MENTION_ROLE_ID}>\n\nPak RT ${CONFIG.CHANNEL_NAME} akan live streaming! Set reminder kalian biar nggak ketinggalan!`;
        const embed = buildUpcomingStreamEmbed(upcoming);
        const sent = await sendDiscordEmbed(content, embed);

        return {
          newId: videoId,
          newStatus: "upcoming",
          notified: sent,
          type: "upcoming",
        };
      }

      return {
        newId: videoId,
        newStatus: "upcoming",
        notified: false,
        type: null,
      };
    }
  } catch (error) {
    console.error("Error checking upcoming streams:", error);
  }

  return {
    newId: null,
    newStatus: "none",
    notified: false,
    type: null,
  };
}

export async function checkNewVideos(lastVideoId: string): Promise<{
  newId: string;
  notified: boolean;
  videoTitle?: string;
}> {
  const youtube = getYouTubeClient();

  try {
    const channelResponse = await youtube.channels.list({
      part: ["contentDetails"],
      id: [CONFIG.YOUTUBE_CHANNEL_ID!],
    });

    const uploadsPlaylistId =
      channelResponse.data.items?.[0]?.contentDetails?.relatedPlaylists
        ?.uploads;

    if (!uploadsPlaylistId) {
      console.error("Could not find uploads playlist");
      return { newId: lastVideoId, notified: false };
    }

    const playlistResponse = await youtube.playlistItems.list({
      part: ["snippet"],
      playlistId: uploadsPlaylistId,
      maxResults: 5,
    });

    const items = playlistResponse.data.items || [];

    if (items.length > 0) {
      const latestVideo = items[0] as YouTubeVideoItem;
      const videoId = latestVideo.snippet?.resourceId?.videoId || "";

      if (videoId && videoId !== lastVideoId) {
        const videoDetails = await youtube.videos.list({
          part: ["snippet", "liveStreamingDetails"],
          id: [videoId],
        });

        const videoData = videoDetails.data.items?.[0];
        const isLiveOrUpcoming =
          videoData?.snippet?.liveBroadcastContent !== "none";

        if (!isLiveOrUpcoming) {
          const content = `**Halo para** <@&${CONFIG.MENTION_ROLE_ID}>\n\nPak RT ${CONFIG.CHANNEL_NAME} baru upload video! Gas nonton!`;
          const embed = buildNewVideoEmbed(latestVideo);
          const sent = await sendDiscordEmbed(content, embed);

          return {
            newId: videoId,
            notified: sent,
            videoTitle: latestVideo.snippet?.title,
          };
        }
      }
    }

    return { newId: lastVideoId, notified: false };
  } catch (error) {
    console.error("Error checking new videos:", error);
    return { newId: lastVideoId, notified: false };
  }
}
