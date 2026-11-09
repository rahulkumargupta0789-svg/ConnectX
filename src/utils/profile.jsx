import { loadJSON, saveJSON } from "./Storage";
 
const PROFILE_KEY = "connectx:profile";
 
export const DEFAULT_PROFILE = {
  name: "ConnectX User",
  email: "user@example.com",
  notifications: true,
  theme: "dark",
};
 
export function getProfile() {
  const saved = loadJSON(PROFILE_KEY, {});
  return { ...DEFAULT_PROFILE, ...(saved && typeof saved === "object" ? saved : {}) };
}
 
export function saveProfile(profile) {
  return saveJSON(PROFILE_KEY, profile);
}