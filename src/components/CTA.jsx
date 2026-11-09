import { ArrowRight, Video } from "lucide-react";
import { useNavigate } from "react-router-dom";

function CTA(){
    const navigate = useNavigate();

    return (
        <section className="w-full px-6 md:px-10 py-20">
            <div className="max-w-7xl mx-auto bg-purple-600 rounded-3xl p-10 md:p-16 text-center">

                <Video size={40} className="mx-auto mb-6" />

                <h2 className="text-3xl md:text-5xl font-bold">
                    Ready to Connect?
                </h2>

                <p className="text-purple-100 mt-5 max-w-xl mx-auto">
                    Bring people together and make every conversation count
                    start your next meeting today.
                </p>
                <button
    onClick={() => navigate("/dashboard")}
    className="mt-8 bg-white text-purple-700 font-semibold px-7 py-3 rounded-xl flex items-center gap-3 mx-auto hover:bg-gray-100 transition"
>
    Get Started
    <ArrowRight size={18} />
</button>
            </div>
        </section>
    );

}
export default CTA;