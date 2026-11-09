import { Video , ArrowUpRight } from "lucide-react";

function Footer() {
    return (
        <footer className="border-t border-white/10 bg-[#0f162a] px-8 py-12">
            <div className="max-w-7xl mx-auto">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="max-w-sm">
                        <div className="flex items-center gap-2">
                          <Video className="text-purple-400" size={28} />

                          <h2 className="text-2xl font-bold">
                            connect<span className="text-purple-400">X</span>
                        </h2> 
                        </div>
                        <p className="text-gray-400 mt-5 leading-relaxed">
                            Making virtual communication simpler,
                            smarter and more meaningful.
                        </p>
                         <div className="flex gap-5 mt-6 text-gray-400">
                            <a href="https://github.com/" target="_blank" rel="noreferrer"
               className="hover:text-purple-400 transition">
                                GitHub
                            </a>

                            <a href="https://twitter.com/" target="_blank" rel="noreferrer"
                                className="hover:text-purple-400 transition">
                                Twitter
                            </a>

                            <a href="https://instagram.com/" target="_blank" rel="noreferrer"
                                className="hover:text-purple-400 transition">
                                Instagram
                            </a>
                        </div>

                    </div>
                    
                    <div>
            <h3 className="font-semibold mb-5">Quick Links</h3>

            <div className="flex flex-col gap-3 text-gray-400">
         <a href="#home" className="hover:text-purple-400">Home</a>
              <a href="#features" className="hover:text-purple-400">Features</a>
              <a href="#about" className="hover:text-purple-400">About</a>
            </div>
                </div>
       <div className="flex flex-col gap-4 text-gray-400">
                            <a href="#features" className="hover:text-purple-400 transition">Video Meetings</a>
                            <a href="#features" className="hover:text-purple-400 transition">Screen Sharing</a>
                            <a href="#features" className="hover:text-purple-400 transition">Live Chat</a>
                        </div>

            </div>
            </div>
            <div className="border-t border-white/10 mt-14 pt-7 flex flex-col md:flex-row justify-between items-center gap-4 text-gray-500 text-sm">
            <p>© 2026 ConnectX. All rights reserved.</p>
            <a href="#home" className="flex items-center gap-2 hover:text-purple-400 transition">
                        Back to top
                        <ArrowUpRight size={16} />
                    </a>
            </div>
            

        </footer>
    );
}
export default Footer;