export interface StatusData {
  success: boolean;
  status?: string;
  lastChecked?: {
    lastVideoId: string;
    lastLiveId: string | null;
    lastLiveStatus: string;
    lastCheckedAt: string;
  };
  config?: {
    channelId: string;
    channelName: string;
    discordChannelId: string;
  };
}

export interface CheckResult {
  success: boolean;
  message?: string;
  liveNotified?: boolean;
  videoNotified?: boolean;
  liveType?: string;
  videoTitle?: string;
  checkedAt?: string;
  error?: string;
}

export interface NotificationState {
  type: "success" | "error";
  message: string;
}

export function formatDate(dateString: string): string {
  try {
    return new Date(dateString).toLocaleString("id-ID", {
      dateStyle: "medium",
      timeStyle: "short",
    });
  } catch {
    return dateString;
  }
}
