import { useParams, useNavigate } from "react-router-dom";
import { useState, useRef, useEffect } from "react";

import {
    Mic, MicOff, Video, VideoOff, MonitorUp,
    MessageSquare, Users, PhoneOff, Copy,
    Settings, MoreVertical, Send, X
} from "lucide-react";

import "./MeetingRoom.css";

function MeetingRoom() {
    const { meetingId } = useParams();
    const navigate = useNavigate();

    const videoRef = useRef(null);
    const streamRef = useRef(null);

    const [camera, setCamera] = useState(false);
       const [mic, setMic] = useState(false);
    const [sharing, setSharing] = useState(false);
    const [chatOpen, setChatOpen] = useState(false);
    const [peopleOpen, setPeopleOpen] = useState(false);
 const [message, setMessage] = useState("");
    const [messages, setMessages] = useState([]);
    const [cameraError, setCameraError] = useState("");

    const participants = [
        { name: "You", color: "#0ea5e9" },
        { name: "Alex Morgan", color: "#8b5cf6" },
        { name: "Sarah Wilson", color: "#ec4899" }
    ];

    async function startCamera() {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                video: true,
                audio: true
            });

            streamRef.current = stream;

            if (videoRef.current) {
                videoRef.current.srcObject = stream;
            }

            setCamera(true);
            setMic(true);
            setCameraError("");
        } catch (error) {
            setCameraError("Camera/microphone permission denied or unavailable.");
        }
    }

    function toggleCamera() {
        if (!streamRef.current) {
            startCamera();
            return;
        }

        const tracks = streamRef.current.getVideoTracks();

        tracks.forEach(track => {
            track.enabled = !camera;
        });

        setCamera(!camera);
    }

    function toggleMic() {
        if (!streamRef.current) {
            startCamera();
            return;
        }

        const tracks = streamRef.current.getAudioTracks();

        tracks.forEach(track => {
            track.enabled = !mic;
        });

        setMic(!mic);
    }

    async function toggleScreenShare() {
        try {
            if (sharing) {
                streamRef.current?.getVideoTracks().forEach(track => {
                    track.enabled = true;
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = streamRef.current;
                }

                setSharing(false);
                return;
            }

            const screenStream =
                await navigator.mediaDevices.getDisplayMedia({
                    video: true
                });

            if (videoRef.current) {
                videoRef.current.srcObject = screenStream;
            }

            setSharing(true);

            screenStream.getVideoTracks()[0].onended = () => {
                if (videoRef.current) {
                    videoRef.current.srcObject = streamRef.current;
                }
                setSharing(false);
            };

        } catch (error) {
            console.log("Screen sharing cancelled");
        }
    }

    function sendMessage(e) {
        e.preventDefault();

        if (!message.trim()) return;

        setMessages(prev => [
            ...prev,
            { text: message.trim(), sender: "You" }
        ]);

        setMessage("");
    }

    function copyMeetingId() {
        navigator.clipboard.writeText(meetingId);
        alert("Meeting ID copied!");
    }

    function leaveMeeting() {
        streamRef.current?.getTracks().forEach(track => track.stop());
        navigate("/dashboard");
    }

    useEffect(() => {
        return () => {
            streamRef.current?.getTracks().forEach(track => track.stop());
        };
    }, []);

    return (
        <div className="meeting-room">

            <header className="meeting-topbar">
                <h2 className="meeting-logo">
                    connect<span>X</span>
                </h2>

                <div className="meeting-info">
                    <span className="live-dot"></span>
                    Meeting ID: {meetingId}

                    <button onClick={copyMeetingId}>
                        <Copy size={15} />
                    </button>
                </div>

                <button className="top-settings">
                    <Settings size={19} />
                </button>
            </header>

            <main className="meeting-content">

                <section className="video-area">

                    <div className="video-grid">

                        <div className="video-card main-video">
                            <video
                                ref={videoRef}
                                autoPlay
                                muted
                                playsInline
                            />

                            {!camera && !sharing && (
                                <div className="camera-placeholder">
                                    <div className="avatar">R😍</div>
                                    <p>Your camera is off</p>
                                </div>
                            )}

                            <div className="video-name">
                                You(Batman) {mic ? "" : "• Muted"}
                            </div>
                        </div>

                        <div className="video-card demo-video">
                            <div className="avatar purple">P</div>
                            <p> Professor</p>
                            <span>Demo participant</span>
                        </div>

                        <div className="video-card demo-video">
                            <div className="avatar pink">C</div>
                            <p>Catman</p>
                            <span>Demo participant</span>
                        </div>

                    </div>

                    {cameraError && (
                        <p className="camera-error">{cameraError}</p>
                    )}

                    <div className="meeting-controls">

                        <button
                            className={!mic ? "control-btn disabled" : "control-btn"}
                            onClick={toggleMic}
                            title="Microphone"
                        >
                            {mic ? <Mic /> : <MicOff />}
                        </button>

                        <button
                            className={!camera ? "control-btn disabled" : "control-btn"}
                            onClick={toggleCamera}
                            title="Camera"
                        >
                            {camera ? <Video /> : <VideoOff />}
                        </button>

                        <button
                            className={sharing ? "control-btn active-share" : "control-btn"}
                            onClick={toggleScreenShare}
                            title="Share screen"
                        >
                            <MonitorUp />
                        </button>

                        <button
                            className="control-btn"
                            onClick={() => setPeopleOpen(!peopleOpen)}
                            title="Participants"
                        >
                            <Users />
                        </button>

                            <button
                                className="control-btn"
                                onClick={() => setChatOpen(!chatOpen)}
                                title="Chat"
                            >
                            <MessageSquare />
                        </button>

               <button
                            className="leave-btn"
                            onClick={leaveMeeting}
                            title="Leave meeting"
                        >
                            <PhoneOff />
                            Leave
                        </button>

                    </div>

                </section>

                {chatOpen && (
                    <aside className="meeting-panel">

                        <div className="panel-header">
                            <h3>Meeting Chat</h3>
                            <button onClick={() => setChatOpen(false)}>
                                <X />
                            </button>
                        </div>
                        <div className="chat-messages">
                            {messages.length === 0 && (
                                <p className="empty-chat">
                                    No messages yet. Start a conversation!
                                </p>
                            )}

                 {messages.map((item, index) => (
                                <div className="chat-message" key={index}>
                                    <strong>{item.sender}</strong>
                          <p>{item.text}</p>
                                </div>
                            ))}
                        </div>

                        <form className="chat-form" onSubmit={sendMessage}>
                            <input
                        value={message}
                   onChange={e => setMessage(e.target.value)}
                                placeholder="Type a message..."
                         />
                  <button type="submit">
                                <Send size={18} />
                            </button>
                        </form>

                    </aside>
                )}

                {peopleOpen && (
                    <aside className="meeting-panel">

                        <div className="panel-header">
                            <h3>Participants (3)</h3>
                            <button onClick={() => setPeopleOpen(false)}>
                                <X />
                            </button>
                        </div>

                        {participants.map((person, index) => (
                 <div className="participant" key={index}>
                                <div
                                    className="participant-avatar"
                                    style={{ background: person.color }}
                                >             {person.name[0]}
                                </div>

                                <span>{person.name}</span>
                                {index === 0 && <small>You</small>}
                            </div>
                        ))}

                    </aside>
                )}

            </main>

        </div>
    );
}

export default MeetingRoom;