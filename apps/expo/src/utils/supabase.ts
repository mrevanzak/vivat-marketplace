import { StorageClient } from "@supabase/storage-js";
import type { UploadOptions } from "use-tus";

const STORAGE_URL = process.env.EXPO_PUBLIC_SUPABASE_STORAGE_URL;
const SERVICE_KEY = process.env.EXPO_PUBLIC_SUPABASE_SERVICE_KEY;

if (!STORAGE_URL || !SERVICE_KEY) {
  throw new Error("Missing env variables for Supabase");
}

export const storageClient = new StorageClient(STORAGE_URL, {
  apikey: SERVICE_KEY,
  Authorization: `Bearer ${SERVICE_KEY}`,
});

export const uploadOptions = (
  bucketName: string,
  fileName: string,
): UploadOptions => ({
  endpoint: `${STORAGE_URL}/upload/resumable`,
  retryDelays: [0, 3000, 5000, 10000, 20000],
  headers: {
    authorization: `Bearer ${SERVICE_KEY}`,
    "x-upsert": "true", // optionally set upsert to true to overwrite existing files
  },
  uploadDataDuringCreation: true,
  removeFingerprintOnSuccess: true, // Important if you want to allow re-uploading the same file https://github.com/tus/tus-js-client/blob/main/docs/api.md#removefingerprintonsuccess
  metadata: {
    bucketName: bucketName,
    objectName: fileName,
    contentType: "image/png",
    cacheControl: "3600",
  },
  chunkSize: 6 * 1024 * 1024, // NOTE: it must be set to 6MB (for now) do not change it
});
