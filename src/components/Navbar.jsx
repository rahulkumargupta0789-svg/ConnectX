import { useNavigate } from "react-router-dom";
import { Video } from "lucide-react";

function Navbar() {
    const navigate = useNavigate();
    return (
        <nav className="flex justify-between items-center px-8 py-5 border-b border-slate-800 bg-[#0F172A]">

            <div className="flex items-center gap-2">
                <Video className="text-sky-400" size={28} />
                <h1 className="text-2xl font-bold tracking-tight">
                    connect<span className="text-sky-400">X</span>
                    
                </h1> 
            </div>
            <div className="hidden md:flex gap-8 text-slate-400">
                <a href="#home" className="hover:text-sky-400 transition">Home</a>
                <a href="#features" className="hover:text-sky-400 transition">Features</a>
                <a href="#about" className="hover:text-sky-400 transition">About</a>

            </div>
            <div className="flex items-center gap-5">
                <button className="text-slate-300 hover:text-white">
                    Login
                </button>
               <button
    onClick={() => navigate("/dashboard")}
    className="bg-sky-500 hover:bg-sky-600 text-white px-5 py-2 rounded-lg transition"
>
    Get Started
</button>
            </div>

        </nav>
    );
}
export default Navbar;