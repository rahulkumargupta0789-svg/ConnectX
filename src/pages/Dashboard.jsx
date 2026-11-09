import { useEffect, useMemo, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import {
    Video,
    Plus,
    Calendar,
    CalendarClock,
    Settings,
    LayoutDashboard,
    ListVideo,
    LogIn,
    Clock,
    Copy,
    Link2,
    Trash2,
    X,
} from "lucide-react";

import "./Dashboard.css";
import { getMeetings, saveMeeting, markJoined, deleteMeeting, generateMeetingId, parseMeetingId, meetingLink } from "../utils/Meetings";

import { copyText } from "../utils/Clipboard";
import { getProfile } from "../utils/profile";

const GRACE_MS = 60 * 60 * 1000;

function pad(n) {
    return String(n).padStart(2, "0");
}

function todayString() {
    const d = new Date();
    return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
}

function formatDate(iso) {
    const date = new Date(iso);
    if (Number.isNaN(date.getTime())) return "";
    return date.toLocaleString([], { dateStyle: "medium", timeStyle: "short" });
}

function Modal({ title, onClose, children }) {
    useEffect(() => {
        function onKey(e) {
            if (e.key === "Escape") onClose();
        }
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose]);

    return (
        <div
            className="modal-overlay"
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div
                className="meeting-modal"
                role="dialog"
                aria-modal="true"
                aria-label={title}
            >
                <button
                    type="button"
                    className="modal-close"
                    onClick={onClose}
                    aria-label="Close"
                >
                    <X size={18} />
                </button>
                <h2>{title}</h2>
                {children}
            </div>
        </div>
    );
}

function MeetingRow({ meeting, onOpen, onCopy, onDelete }) {
    const upcoming = meeting.type === "scheduled" && !meeting.lastJoinedAt;

    let detail = `Created ${formatDate(meeting.createdAt)}`;
    if (upcoming) detail = `Scheduled for ${formatDate(meeting.scheduledFor)}`;
    else if (meeting.lastJoinedAt)
        detail = `Last joined ${formatDate(meeting.lastJoinedAt)}`;

    return (
        <li className="meeting-row">
            <div className="meeting-row-icon">
                {upcoming ? <CalendarClock size={20} /> : <Video size={20} />}
            </div>

            <div className="meeting-row-info">
                <strong>{meeting.title}</strong>
                <span>
                    <code>{meeting.id}</code> &middot; {detail}
                </span>
            </div>

            <div className="meeting-row-actions">
                <button
                    type="button"
                    className="btn-primary small"
                    onClick={() => onOpen(meeting)}
                >
                    {upcoming ? "Start" : "Rejoin"}
                </button>
                <button
                    type="button"
                    className="icon-btn"
                    onClick={() => onCopy(meeting)}
                    title="Copy meeting ID"
                    aria-label={`Copy meeting ID ${meeting.id}`}
                >
                    <Copy size={16} />
                </button>
                <button
                    type="button"
                    className="icon-btn danger"
                    onClick={() => onDelete(meeting)}
                    title="Remove from list"
                    aria-label={`Remove meeting ${meeting.id}`}
                >
                    <Trash2 size={16} />
                </button>
            </div>
        </li>
    );
}

function Dashboard() {
    const navigate = useNavigate();
    const profile = getProfile();
    const firstName = profile.name.trim().split(" ")[0] || "there";

    const [view, setView] = useState("dashboard");
    const [filter, setFilter] = useState("all");
    const [meetings, setMeetings] = useState(() => getMeetings());
    const [modal, setModal] = useState(null);
    const [created, setCreated] = useState(null);
    const [joinInput, setJoinInput] = useState("");
    const [joinError, setJoinError] = useState("");
    const [form, setForm] = useState({ title: "", date: "", time: "" });
    const [formError, setFormError] = useState("");
    const [toast, setToast] = useState("");

    useEffect(() => {
        if (!toast) return;
        const timer = setTimeout(() => setToast(""), 2500);
        return () => clearTimeout(timer);
    }, [toast]);

    const { upcoming, recent } = useMemo(() => {
        const now = Date.now();
        const up = meetings
            .filter(
                (m) =>
                    m.type === "scheduled" &&
                    !m.lastJoinedAt &&
                    new Date(m.scheduledFor).getTime() >= now - GRACE_MS
            )
            .sort(
                (a, b) =>
                    new Date(a.scheduledFor).getTime() -
                    new Date(b.scheduledFor).getTime()
            );
        const upIds = new Set(up.map((m) => m.id));
        const rec = meetings
            .filter((m) => !upIds.has(m.id))
            .sort(
                (a, b) =>
                    new Date(b.lastJoinedAt || b.createdAt).getTime() -
                    new Date(a.lastJoinedAt || a.createdAt).getTime()
            );
        return { upcoming: up, recent: rec };
    }, [meetings]);

    function closeModal() {
        setModal(null);
        setJoinError("");
        setFormError("");
    }

    function openMeeting(meeting) {
        setMeetings(markJoined(meeting.id, meeting.title));
        navigate(`/meeting/${meeting.id}`);
    }

    function createInstantMeeting() {
        const meeting = {
            id: generateMeetingId(),
            title: "Instant meeting",
            type: "instant",
            createdAt: new Date().toISOString(),
            scheduledFor: null,
            lastJoinedAt: null,
        };
        setMeetings(saveMeeting(meeting));
        setCreated(meeting);
        setModal("create");
    }

    async function copy(text, message) {
        const ok = await copyText(text);
        setToast(ok ? message : "Couldn't copy. Select the text and copy it manually.");
    }

    function handleJoin(e) {
        e.preventDefault();

        if (!joinInput.trim()) {
            setJoinError("Enter a meeting ID or link.");
            return;
        }

        const id = parseMeetingId(joinInput);
        if (!id) {
            setJoinError(
                "That isn't a valid meeting ID. IDs are 6–12 letters or numbers, like ABCD-EFGH."
            );
            return;
        }

        const known = meetings.find((m) => m.id === id);
        setMeetings(markJoined(id, known?.title));
        setJoinInput("");
        setJoinError("");
        setModal(null);
        navigate(`/meeting/${id}`);
    }

    function handleSchedule(e) {
        e.preventDefault();

        const title = form.title.trim();
        if (!title) {
            setFormError("Give the meeting a title.");
            return;
        }
        if (title.length > 60) {
            setFormError("Keep the title under 60 characters.");
            return;
        }
        if (!form.date || !form.time) {
            setFormError("Choose both a date and a time.");
            return;
        }

        const when = new Date(`${form.date}T${form.time}`);
        if (Number.isNaN(when.getTime())) {
            setFormError("That date or time isn't valid.");
            return;
        }
        if (when.getTime() < Date.now()) {
            setFormError("Choose a time in the future.");
            return;
        }

        const meeting = {
            id: generateMeetingId(),
            title,
            type: "scheduled",
            createdAt: new Date().toISOString(),
            scheduledFor: when.toISOString(),
            lastJoinedAt: null,
        };
        setMeetings(saveMeeting(meeting));
        setForm({ title: "", date: "", time: "" });
        setFormError("");
        setModal(null);
        setToast(`Scheduled "${title}". ID: ${meeting.id}`);
    }

    function handleDelete(meeting) {
        setMeetings(deleteMeeting(meeting.id));
        setToast("Removed from your list.");
    }

    function renderList(list, emptyTitle, emptyText) {
        if (list.length === 0) {
            return (
                <div className="empty-state">
                    <Clock size={35} />
                    <h3>{emptyTitle}</h3>
                    <p>{emptyText}</p>
                </div>
            );
        }

        return (
            <ul className="meeting-list">
                {list.map((meeting) => (
                    <MeetingRow
                      key={meeting.id}
            meeting={meeting}
                     onOpen={openMeeting}
                onCopy={(m) => copy(m.id, "Meeting ID copied.")}
                  onDelete={handleDelete}
                    />
                ))}
            </ul>
        );
    }

    const allMeetings = [...upcoming, ...recent];
    const filtered =
        filter === "upcoming" ? upcoming : filter === "recent" ? recent : allMeetings;

    return (
        <div className="dashboard">
            <aside className="sidebar">
                <Link to="/" className="sidebar-logo" title="Back to home">
                    <span className="logo-word">connect</span>
                    <span className="logo-x">X</span>
                </Link>

                <nav className="sidebar-nav">
                    <button
                        type="button"
                        className={view =="dashboard" ? "active" : ""}
                        onClick={() => setView("dashboard")}
                    >
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </button>
                    <button
                        type="button"
                        className={view === "meetings" ? "active" : ""}
                        onClick={() => setView("meetings")}
                    >
                        <ListVideo size={20} />
                        <span>Meetings</span>
                    </button>
                    <Link to="/settings">
                        <Settings size={20} />
                        <span>Settings</span>
                    </Link>
                </nav>

                <Link to="/settings" className="sidebar-profile" title="Edit profile">
                    <div className="profile-avatar">
                        {profile.name.trim().charAt(0).toUpperCase() || "U"}
                    </div>
                    <div className="profile-text">
                        <strong>{profile.name}</strong>
                        <span>{profile.email}</span>
                    </div>
                </Link>
            </aside>

            <main className="dashboard-main">
                <header className="dashboard-header">
                    <div>
                        <h2>
                            {view === "dashboard"
                                ? `Welcome back, ${firstName}!`
                                : "Your meetings"}
                        </h2>
                        <p>
                            {view === "dashboard"
                                ? "Manage your meetings and stay connected."
                                : "Everything you've created, scheduled, or joined on this device."}
                        </p>
                    </div>

                    <button type="button" className="create-btn" onClick={createInstantMeeting}>
                        <Plus size={20} />
                        Create Meeting
                    </button>
                </header>

                {view === "dashboard" && (
                    <>
                        <section className="quick-actions">
                            <button type="button" className="action-card" onClick={createInstantMeeting}>
                                <Video className="action-icon blue" />
                                <strong>New Meeting</strong>
                                <span>Start an instant meeting.</span>
                            </button>

                            <button type="button" className="action-card" onClick={() => setModal("join")}>
                                <LogIn className="action-icon purple" />
                                <strong>Join Meeting</strong>
                                <span>Join with a meeting ID or link.</span>
                            </button>

                            <button type="button" className="action-card" onClick={() => setModal("schedule")}>
                                <Calendar className="action-icon green" />
                                <strong>Schedule</strong>
                                <span>Plan your next meeting.</span>
                            </button>
                        </section>

                        {upcoming.length > 0 && (
                            <section className="meetings-section">
                                <h2>Upcoming</h2>
                                {renderList(upcoming)}
                            </section>
                        )}

                        <section className="meetings-section">
                            <div className="section-head">
                                <h2>Recent Meetings</h2>
                                {recent.length > 5 && (
                                    <button
                                        type="button"
                                        className="link-btn"
                                        onClick={() => {
                                            setFilter("recent");
                                            setView("meetings");
                                        }}
                                    >
                                        View all
                                    </button>
                                )}
                            </div>
                            {renderList(
                                recent.slice(0, 5),
                                "No recent meetings",
                                "Meetings you create or join will show up here."
                            )}
                        </section>
                    </>
                )}

                {view === "meetings" && (
                    <section className="meetings-section">
                        <div className="filter-tabs" role="tablist">
                            {[
                                ["all", `All (${allMeetings.length})`],
                                ["upcoming", `Upcoming (${upcoming.length})`],
                                ["recent", `Recent (${recent.length})`],
                            ].map(([key, label]) => (
                                <button
                                    key={key}
                                    type="button"
                                    role="tab"
                                    aria-selected={filter === key}
                                    className={filter === key ? "active" : ""}
                                    onClick={() => setFilter(key)}
                                >
                                    {label}
                                </button>
                            ))}
                        </div>

                        {renderList(
                            filtered,
                            "Nothing here yet",
                            "Create, schedule, or join a meeting to get started."
                        )}
                    </section>
                )}
            </main>

            {modal === "create" && created && (
                <Modal title="Meeting created" onClose={closeModal}>
                    <p>Share this ID with the people you want to invite.</p>

                    <div className="meeting-id">{created.id}</div>

                    <div className="modal-actions">
                        <button
                            type="button"
                            className="btn-primary"
                            onClick={() => {
                                closeModal();
                                openMeeting(created);
                            }}
                        >
                            <Video size={16} /> Start meeting
                        </button>
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => copy(created.id, "Meeting ID copied.")}
                        >
                            <Copy size={16} /> Copy ID
                        </button>
                        <button
                            type="button"
                            className="btn-secondary"
                            onClick={() => copy(meetingLink(created.id), "Invite link copied.")}
                        >
                            <Link2 size={16} /> Copy link
                        </button>
                    </div>

                    <p className="modal-note">
                        connectX is a frontend-only demo. The ID opens a room in this
                        browser; other people can't connect to it yet.
                    </p>
                </Modal>
            )}

            {modal === "join" && (
                <Modal title="Join meeting" onClose={closeModal}>
                    <form onSubmit={handleJoin} noValidate>
                        <label htmlFor="join-id">Meeting ID or link</label>
                        <input
                            id="join-id"
                            type="text"
                            autoFocus
                            autoComplete="off"
                            placeholder="ABCD-EFGH"
                            value={joinInput}
                            onChange={(e) => {
                                setJoinInput(e.target.value);
                                setJoinError("");
                            }}
                        />
                        {joinError && <p className="field-error">{joinError}</p>}

                        <div className="modal-actions">
                            <button type="submit" className="btn-primary">
                                Join now
                            </button>
                            <button type="button" className="btn-ghost" onClick={closeModal}>
                                Cancel
                            </button>
                        </div>
                    </form>

                    <p className="modal-note">
                        Joining opens the room on this device only. Connecting with other
                        people needs a signaling server, which this project doesn't have.
                    </p>
                </Modal>
            )}

            {modal === "schedule" && (
                <Modal title="Schedule meeting" onClose={closeModal}>
                    <form onSubmit={handleSchedule} noValidate>
                        <label htmlFor="sched-title">Title</label>
                        <input
                            id="sched-title"
                            type="text"
                            autoFocus
                            maxLength={60}
                            placeholder="Weekly project sync"
                            value={form.title}
                            onChange={(e) => setForm({ ...form, title: e.target.value })}
                        />

                        <div className="form-row">
                            <div>
                                <label htmlFor="sched-date">Date</label>
                                <input
                                    id="sched-date"
                                    type="date"
                                    min={todayString()}
                                    value={form.date}
                                    onChange={(e) => setForm({ ...form, date: e.target.value })}
                                />
                            </div>
                            <div>
                                <label htmlFor="sched-time">Time</label>
                                <input
                                    id="sched-time"
                                    type="time"
                                    value={form.time}
                                    onChange={(e) => setForm({ ...form, time: e.target.value })}
                                />
                            </div>
                        </div>

                        {formError && <p className="field-error">{formError}</p>}

                        <div className="modal-actions">
                            <button type="submit" className="btn-primary">
                                Schedule
                            </button>
                            <button type="button" className="btn-ghost" onClick={closeModal}>
                                Cancel
                            </button>
                        </div>
                    </form>

                    <p className="modal-note">
                        Scheduled meetings are saved in this browser. connectX doesn't send
                        invites or reminders.
                    </p>
                </Modal>
            )}

            {toast && (
                <div className="toast" role="status">
                    {toast}
                </div>
            )}
        </div>
    );
}

export default Dashboard;
