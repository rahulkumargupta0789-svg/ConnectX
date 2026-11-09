import { loadJSON, saveJSON } from "./Storage";
 
const MEETINGS_KEY = "connectx:meetings";
const MAX_MEETINGS = 30;

const ALPHABET = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
 
function randomChars(count) {
  const values = new Uint32Array(count);
  crypto.getRandomValues(values);
  return Array.from(values, (v) => ALPHABET[v % ALPHABET.length]).join("");
}
 
function activityTime(meeting) {
  return new Date(meeting.lastJoinedAt || meeting.createdAt).getTime() || 0;
}
 
export function getMeetings() {
  const list = loadJSON(MEETINGS_KEY, []);
  if (!Array.isArray(list)) return [];
  return list.filter((m) => m && typeof m.id === "string");
}
 
function persist(list) {
  const trimmed = [...list]
    .sort((a, b) => activityTime(b) - activityTime(a))
    .slice(0, MAX_MEETINGS);
  saveJSON(MEETINGS_KEY, trimmed);
  return trimmed;
}
export function generateMeetingId() {
  const taken = new Set(getMeetings().map((m) => m.id));
  let id;
  do {
    id = `${randomChars(4)}-${randomChars(4)}`;
  } while (taken.has(id));
  return id;
}

export function parseMeetingId(input) {
  if (typeof input !== "string") return null;
 
  let value = input.trim();
  const marker = "/meeting/";
  const at = value.toLowerCase().lastIndexOf(marker);
  if (at !== -1) {
    value = value.slice(at + marker.length).split(/[?#/]/)[0];
  }
 
  const clean = value.toUpperCase().replace(/[^A-Z0-9]/g, "");
  if (clean.length < 6 || clean.length > 12) return null;
 
  return clean.length === 8 ? `${clean.slice(0, 4)}-${clean.slice(4)}` : clean;
}
 
export function meetingLink(id) {
  return `${window.location.origin}/meeting/${id}`;
}
 

export function saveMeeting(meeting) {
  const list = getMeetings();
  const index = list.findIndex((m) => m.id === meeting.id);
  if (index >= 0) {
    list[index] = { ...list[index], ...meeting };
  } else {
    list.unshift(meeting);
  }
  return persist(list);
}

export function markJoined(id, title) {
  const now = new Date().toISOString();
  const existing = getMeetings().find((m) => m.id === id);
 
  if (existing) {
    return saveMeeting({ ...existing, lastJoinedAt: now });
  }
 
  return saveMeeting({
    id,
    title: title || "Joined meeting",
    type: "joined",
    createdAt: now,
    scheduledFor: null,
    lastJoinedAt: now,
  });
}
 
export function deleteMeeting(id) {
  return persist(getMeetings().filter((m) => m.id !== id));
}