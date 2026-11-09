import { Video, ArrowRight, Play } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Home() {
    const navigate = useNavigate();

    function scrollToFeatures() {
        document
            .getElementById("features")
            ?.scrollIntoView({ behavior: "smooth" });
    }

    return (
        <section id="home" className="min-h-[85vh] flex flex-col items-center justify-center text-center px-6">
            <div className="border border-sky-500/20 bg-sky-500/5 text-sky-400 px-4 py-2 rounded-full mb-8 text-sm">
                The Future of Virtual Meetings
            </div>

            <h1 className="text-5xl md:text-7xl font-bold max-w-4xl leading-tight tracking-tight">
                Connect with Anyone,{" "}
                <span className="text-purple-400">Anywhere</span>
            </h1>

            <p className="text-gray-400 text-lg max-w-2xl mt-6">
                Experience seamless video meetings with crystal-clear
                communication and a modern collaboration experience.
            </p>

            <div className="flex gap-4 mt-10 flex-wrap justify-center">
                <button
                    onClick={() => navigate("/dashboard")}
                    className="flex items-center gap-2 bg-purple-600 px-7 py-4 rounded-xl hover:bg-purple-700 transition"
                >
          <Video size={20} />
                    Start Meeting
                    <ArrowRight size={18} />
                </button>

                <button
          onClick={scrollToFeatures}
                    className="flex items-center gap-2 border border-white/20 px-7 py-4 rounded-xl hover:bg-white/10 transition"
                >
                    <Play size={18} />
                    Explore Features
                </button>
            </div>

            <div className="mt-16 text-gray-500 text-sm">
         HD Video • Screen Sharing • Real-time Collaboration
            </div>
        </section>
    );
}

export default Home;