import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, User, Bell, Shield, Palette } from "lucide-react";
import "./Settings.css";

function Settings() {
    const navigate = useNavigate();

    const [name, setName] = useState("Pyara Batman");
    const [email, setEmail] = useState("PyaraBatman@gmail.com");
    const [notifications, setNotifications] = useState(true);
    const [darkMode, setDarkMode] = useState(true);

    return (
        <div className="settings-page">
            <header className="settings-header">
                <button onClick={() => navigate("/dashboard")}>
                    <ArrowLeft size={18} /> Dashboard
                </button>
                <h2>Settings</h2>
            </header>

            <div className="settings-container">
                <section className="settings-card">
                    <User />
                    <h3>Profile</h3>

                    <label>Display Name</label>
                    <input
                        value={name}
                        onChange={e => setName(e.target.value)}
                        placeholder=" Pyara Batman"
                    />

                    <label>Email</label>
                    <input
                        value={email}
                        onChange={e => setEmail(e.target.value)}
                        placeholder="pyaraBatman@gmail.com"

                    />
                    

                </section>

                <section className="settings-card">
                    <Bell />
                    <h3>Notifications</h3>
                    <label className="setting-toggle">
                        Enable notifications
                        <input
                            type="checkbox"
                            checked={notifications}
                            onChange={e => setNotifications(e.target.checked)}
                        />
                    </label>
                </section>

                <section className="settings-card">
                    <Palette />
                    <h3>Appearance</h3>
                    <label className="setting-toggle">
                        Dark mode
                        <input
                            type="checkbox"
                            checked={darkMode}
                            onChange={e => setDarkMode(e.target.checked)}
                        />
                    </label>
                </section>

                <section className="settings-card">
                    <Shield />
                    <h3>Privacy</h3>
                    <p>Camera and microphone permissions are controlled by your browser.</p>
                </section>
            </div>
        </div>
    );
}

export default Settings;