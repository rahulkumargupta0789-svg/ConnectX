import { BrowserRouter, Routes, Route, Link } from "react-router-dom";

import LandingPage from "./pages/LandingPage";
import Dashboard from "./pages/Dashboard";
import MeetingRoom from "./pages/MeetingRoom";
import Settings from "./pages/Settings";

function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center gap-4 text-center px-6">
      <h1 className="text-6xl font-bold text-sky-400">404</h1>
      <p className="text-slate-400">This page doesn't exist.</p>
      <Link
        to="/"
        className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-lg transition"
      >
        Back to home
      </Link>
    </div>
  );
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/meeting/:meetingId" element={<MeetingRoom />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;