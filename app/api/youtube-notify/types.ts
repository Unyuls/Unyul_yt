export interface LastChecked {
  lastVideoId: string;
  lastLiveId: string | null;
  lastLiveStatus: "live" | "upcoming" | "none";
  lastCheckedAt: string;
}

export interface DiscordEmbed {
  title: string;
  description: string;
  url?: string;
  color: number;
  thumbnail?: { url: string };
  image?: { url: string };
  author?: { name: string; icon_url?: string; url?: string };
  footer?: { text: string; icon_url?: string };
  timestamp?: string;
  fields?: Array<{ name: string; value: string; inline?: boolean }>;
}

export interface YouTubeVideoItem {
  id?: { videoId?: string };
  snippet?: {
    title?: string;
    description?: string;
    thumbnails?: {
      high?: { url: string };
      maxres?: { url?: string };
    };
    publishedAt?: string;
    channelTitle?: string;
    liveBroadcastContent?: string;
    resourceId?: { videoId?: string };
  };
}
