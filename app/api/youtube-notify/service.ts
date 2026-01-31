import { loadLastChecked, saveLastChecked } from "./storage";
import { checkLiveStreams, checkNewVideos } from "./youtube";
import { LastChecked } from "./types";

export async function performChecks(): Promise<{
  liveNotified: boolean;
  videoNotified: boolean;
  liveType: "live" | "upcoming" | null;
  videoTitle?: string;
  checkedAt: string;
}> {
  const checkedAt = new Date().toISOString();
  console.log(`[${checkedAt}] Starting YouTube notification check...`);

  let lastChecked = await loadLastChecked();

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
  await saveLastChecked(newLastChecked);

  console.log(`[${checkedAt}] Check completed.`, {
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
