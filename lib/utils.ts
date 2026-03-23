import { BUCKET } from "./constants";

export function cn(...inputs: Array<string | false | null | undefined>) {
  return inputs.filter(Boolean).join(" ");
}
export function getStoragePath(url: string) {
  const parts = url.split(`storage/v1/object/public/${BUCKET}/`);
  return parts[1] || null;
}
