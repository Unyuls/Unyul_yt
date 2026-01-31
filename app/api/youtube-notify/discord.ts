import { CONFIG } from "./config";
import { DiscordEmbed, YouTubeVideoItem } from "./types";

export async function sendDiscordEmbed(
  content: string,
  embed: DiscordEmbed,
): Promise<boolean> {
  try {
    const response = await fetch(
      `https://discord.com/api/v10/channels/${CONFIG.CHANNEL_ID}/messages`,
      {
        method: "POST",
        headers: {
          Authorization: `Bot ${CONFIG.DISCORD_TOKEN}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          content: content,
          embeds: [embed],
        }),
      },
    );

    if (!response.ok) {
      const errorBody = await response.text();
      console.error(
        `Discord API error: ${response.status} ${response.statusText}`,
        errorBody,
      );
      return false;
    }

    console.log("Discord message sent successfully!");
    return true;
  } catch (error) {
    console.error("Failed to send Discord message:", error);
    return false;
  }
}

export function buildLiveStreamEmbed(video: YouTubeVideoItem): DiscordEmbed {
  const title = video.snippet?.title || "Untitled Stream";
  const thumbnail =
    video.snippet?.thumbnails?.maxres?.url ||
    video.snippet?.thumbnails?.high?.url ||
    "";
  const videoId = video.id?.videoId || "";
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const description = video.snippet?.description?.substring(0, 200) || "";

  return {
    title: `LIVE NOW: ${title}`,
    description: description + (description.length >= 200 ? "..." : ""),
    url: url,
    color: CONFIG.COLORS.LIVE,
    image: { url: thumbnail },
    author: {
      name: CONFIG.CHANNEL_NAME,
      icon_url: CONFIG.CHANNEL_AVATAR,
      url: `https://www.youtube.com/channel/${CONFIG.YOUTUBE_CHANNEL_ID}`,
    },
    footer: {
      text: "YouTube Live Stream",
      icon_url:
        "https://www.youtube.com/s/desktop/f981c1e5/img/favicon_144x144.png",
    },
    timestamp: new Date().toISOString(),
    fields: [
      {
        name: "Watch Now",
        value: `[Click here to join the stream!](${url})`,
        inline: true,
      },
    ],
  };
}

export function buildUpcomingStreamEmbed(
  video: YouTubeVideoItem,
): DiscordEmbed {
  const title = video.snippet?.title || "Untitled Stream";
  const thumbnail =
    video.snippet?.thumbnails?.maxres?.url ||
    video.snippet?.thumbnails?.high?.url ||
    "";
  const videoId = video.id?.videoId || "";
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const scheduledTime = video.snippet?.publishedAt || "";

  return {
    title: `UPCOMING: ${title}`,
    description: `Stream akan dimulai segera! Jangan sampai ketinggalan!`,
    url: url,
    color: CONFIG.COLORS.UPCOMING,
    image: { url: thumbnail },
    author: {
      name: CONFIG.CHANNEL_NAME,
      icon_url: CONFIG.CHANNEL_AVATAR,
      url: `https://www.youtube.com/channel/${CONFIG.YOUTUBE_CHANNEL_ID}`,
    },
    footer: {
      text: "Upcoming YouTube Stream",
      icon_url:
        "https://www.youtube.com/s/desktop/f981c1e5/img/favicon_144x144.png",
    },
    timestamp: scheduledTime || new Date().toISOString(),
    fields: [
      {
        name: "Set Reminder",
        value: `[Click here to set a reminder!](${url})`,
        inline: true,
      },
    ],
  };
}

export function buildNewVideoEmbed(video: YouTubeVideoItem): DiscordEmbed {
  const title = video.snippet?.title || "Untitled Video";
  const thumbnail =
    video.snippet?.thumbnails?.maxres?.url ||
    video.snippet?.thumbnails?.high?.url ||
    "";
  const videoId = video.snippet?.resourceId?.videoId || "";
  const url = `https://www.youtube.com/watch?v=${videoId}`;
  const description = video.snippet?.description?.substring(0, 200) || "";
  const publishedAt = video.snippet?.publishedAt || "";

  return {
    title: `NEW VIDEO: ${title}`,
    description: description + (description.length >= 200 ? "..." : ""),
    url: url,
    color: CONFIG.COLORS.VIDEO,
    image: { url: thumbnail },
    author: {
      name: CONFIG.CHANNEL_NAME,
      icon_url: CONFIG.CHANNEL_AVATAR,
      url: `https://www.youtube.com/channel/${CONFIG.YOUTUBE_CHANNEL_ID}`,
    },
    footer: {
      text: "New YouTube Video",
      icon_url:
        "https://www.youtube.com/s/desktop/f981c1e5/img/favicon_144x144.png",
    },
    timestamp: publishedAt || new Date().toISOString(),
    fields: [
      {
        name: "Watch Now",
        value: `[Click here to watch!](${url})`,
        inline: true,
      },
    ],
  };
}
