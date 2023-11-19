import { StorageClient } from "@supabase/storage-js";

const STORAGE_URL = process.env.EXPO_PUBLIC_SUPABASE_STORAGE_URL;
const SERVICE_KEY = process.env.EXPO_PUBLIC_SUPABASE_SERVICE_KEY;

if (!STORAGE_URL || !SERVICE_KEY) {
  throw new Error("Missing env variables for Supabase");
}

export const storageClient = new StorageClient(STORAGE_URL, {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
});
