import { promises as fs } from "fs";
import path from "path";
import { LastChecked } from "./types";

const getLastCheckedPath = () => {
  return path.join(process.cwd(), "last_checked.json");
};

let inMemoryCache: LastChecked | null = null;

const getDefaultLastChecked = (): LastChecked => ({
  lastVideoId: "",
  lastLiveId: null,
  lastLiveStatus: "none",
  lastCheckedAt: new Date().toISOString(),
});

const log = (action: string, details: Record<string, unknown>) => {
  const timestamp = new Date().toISOString();
  console.log(
    `[STORAGE ${timestamp}] ${action}:`,
    JSON.stringify(details, null, 2),
  );
};

export async function loadLastChecked(): Promise<LastChecked> {
  const filePath = getLastCheckedPath();

  try {
    const data = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(data);

    if (inMemoryCache && inMemoryCache.lastCheckedAt !== parsed.lastCheckedAt) {
      log("CACHE_STALE_DETECTED", {
        cacheTime: inMemoryCache.lastCheckedAt,
        fileTime: parsed.lastCheckedAt,
        source: "file_read",
      });
    }

    inMemoryCache = parsed;

    log("LOAD_SUCCESS", {
      source: "file",
      lastCheckedAt: parsed.lastCheckedAt,
      filePath,
    });

    return parsed;
  } catch (fileError) {
    log("FILE_READ_FAILED", {
      error: (fileError as Error).message,
      filePath,
      fallbackToCache: !!inMemoryCache,
    });

    if (inMemoryCache) {
      log("USING_CACHE_FALLBACK", {
        lastCheckedAt: inMemoryCache.lastCheckedAt,
      });
      return inMemoryCache;
    }

    const defaultData = getDefaultLastChecked();
    inMemoryCache = defaultData;

    log("USING_DEFAULT", {
      lastCheckedAt: defaultData.lastCheckedAt,
    });

    return defaultData;
  }
}

export async function saveLastChecked(data: LastChecked): Promise<void> {
  const filePath = getLastCheckedPath();

  log("SAVE_START", {
    newLastCheckedAt: data.lastCheckedAt,
    previousCacheTime: inMemoryCache?.lastCheckedAt || "none",
    filePath,
  });

  inMemoryCache = data;

  try {
    await fs.writeFile(filePath, JSON.stringify(data, null, 2), "utf-8");

    log("SAVE_SUCCESS", {
      lastCheckedAt: data.lastCheckedAt,
      filePath,
    });
  } catch (error) {
    log("SAVE_FAILED", {
      error: (error as Error).message,
      lastCheckedAt: data.lastCheckedAt,
      filePath,
    });
    console.error("Failed to save last checked data to file:", error);
  }
}

export async function refreshFromFile(): Promise<LastChecked> {
  const filePath = getLastCheckedPath();

  log("FORCE_REFRESH_START", { filePath });

  try {
    const data = await fs.readFile(filePath, "utf-8");
    const parsed = JSON.parse(data);

    log("FORCE_REFRESH_SUCCESS", {
      oldCacheTime: inMemoryCache?.lastCheckedAt || "none",
      newTime: parsed.lastCheckedAt,
    });

    inMemoryCache = parsed;
    return parsed;
  } catch (error) {
    log("FORCE_REFRESH_FAILED", {
      error: (error as Error).message,
    });
    return inMemoryCache || getDefaultLastChecked();
  }
}

export function clearCache(): void {
  log("CACHE_CLEARED", {
    previousCacheTime: inMemoryCache?.lastCheckedAt || "none",
  });
  inMemoryCache = null;
}
