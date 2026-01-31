import { promises as fs } from "fs";
import path from "path";
import { LastChecked } from "./types";

const getLastCheckedPath = () => {
  return path.join(process.cwd(), "last_checked.json");
};

export async function loadLastChecked(): Promise<LastChecked> {
  try {
    const data = await fs.readFile(getLastCheckedPath(), "utf-8");
    return JSON.parse(data);
  } catch {
    return {
      lastVideoId: "",
      lastLiveId: null,
      lastLiveStatus: "none",
      lastCheckedAt: new Date().toISOString(),
    };
  }
}

export async function saveLastChecked(data: LastChecked): Promise<void> {
  try {
    await fs.writeFile(
      getLastCheckedPath(),
      JSON.stringify(data, null, 2),
      "utf-8",
    );
  } catch (error) {
    console.error("Failed to save last checked data:", error);
  }
}
