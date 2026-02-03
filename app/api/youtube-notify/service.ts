import { loadLastChecked, saveLastChecked } from "./storage";
import { checkLiveStreams, checkNewVideos } from "./youtube";
import { LastChecked } from "./types";

const log = (action: string, details: Record<string, unknown>) => {
  const timestamp = new Date().toISOString();
  console.log(
    `[SERVICE ${timestamp}] ${action}:`,
    JSON.stringify(details, null, 2),
  );
};

export async function performChecks(): Promise<{
  liveNotified: boolean;
  videoNotified: boolean;
  liveType: "live" | "upcoming" | null;
  videoTitle?: string;
  checkedAt: string;
}> {
  const checkedAt = new Date().toISOString();
  log("CHECK_START", { checkedAt });

  let lastChecked = await loadLastChecked();

  log("LOADED_LAST_CHECKED", {
    lastCheckedAt: lastChecked.lastCheckedAt,
    lastVideoId: lastChecked.lastVideoId,
    lastLiveId: lastChecked.lastLiveId,
  });

  const liveResult = await checkLiveStreams(
    lastChecked.lastLiveId,
    lastChecked.lastLiveStatus,
  );
  const videoResult = await checkNewVideos(lastChecked.lastVideoId);

  const newLastChecked: LastChecked = {
    lastVideoId: videoResult.newId || lastChecked.lastVideoId,
    lastLiveId: liveResult.newId,
    lastLiveStatus: liveResult.newStatus,
    lastCheckedAt: checkedAt,
  };

  log("SAVING_NEW_CHECKED", {
    newLastCheckedAt: newLastChecked.lastCheckedAt,
    newVideoId: newLastChecked.lastVideoId,
    newLiveId: newLastChecked.lastLiveId,
  });

  await saveLastChecked(newLastChecked);

  log("CHECK_COMPLETED", {
    checkedAt,
    liveNotified: liveResult.notified,
    videoNotified: videoResult.notified,
  });

  return {
    liveNotified: liveResult.notified,
    videoNotified: videoResult.notified,
    liveType: liveResult.type,
    videoTitle: videoResult.videoTitle,
    checkedAt,
  };
}
