import { promises as fs } from "fs";
import path from "path";
import { LastChecked } from "./types";

const getLastCheckedPath = () => {
  return path.join(process.cwd(), "last_checked.json");
};

// In-memory cache for serverless environments where file system is ephemeral
let inMemoryCache: LastChecked | null = null;

const getDefaultLastChecked = (): LastChecked => ({
  lastVideoId: "",
  lastLiveId: null,
  lastLiveStatus: "none",
  lastCheckedAt: new Date().toISOString(),
});

export async function loadLastChecked(): Promise<LastChecked> {
  // First check in-memory cache (for serverless environments)
  if (inMemoryCache) {
    return inMemoryCache;
  }

  try {
    const data = await fs.readFile(getLastCheckedPath(), "utf-8");
    const parsed = JSON.parse(data);
    // Update in-memory cache
    inMemoryCache = parsed;
    return parsed;
  } catch {
    const defaultData = getDefaultLastChecked();
    inMemoryCache = defaultData;
    return defaultData;
  }
}

export async function saveLastChecked(data: LastChecked): Promise<void> {
  // Always update in-memory cache first (critical for serverless)
  inMemoryCache = data;

  try {
    await fs.writeFile(
      getLastCheckedPath(),
      JSON.stringify(data, null, 2),
      "utf-8",
    );
  } catch (error) {
    console.error("Failed to save last checked data to file:", error);
    // In-memory cache is already updated, so the app will still work
  }
}

// Force refresh from file (useful for debugging)
export async function refreshFromFile(): Promise<LastChecked> {
  try {
    const data = await fs.readFile(getLastCheckedPath(), "utf-8");
    const parsed = JSON.parse(data);
    inMemoryCache = parsed;
    return parsed;
  } catch {
    return inMemoryCache || getDefaultLastChecked();
  }
}
