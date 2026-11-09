import{ Video,Monitor,MessageCircle,ShieldCheck } from "lucide-react";

const features = [
    {
        icon: Video,
        title:"HD Video Calls",
        description:"Experience crystal clear video quality for your virtual meetings."

    },
    {
        icon: Monitor,
        title:"Screen Sharing",
        description:"Share your screen and collaborate with your team effortlessly."
    },
    {
        icon:MessageCircle,
        title:"Live Chat",
        description:"Stay connected with instant messaging during meetings."
    },
    {
        icon:ShieldCheck,
        title:"Secure Meetings",
        description:"Your conversations deserve privacy and secure communication"
    }
];

function Features() {
    return (
        <section id="features" className="px-8 py-24">
            <div className="text-center mb-16">
                <p className="text-sky-400 font-semibold mb-3">
                    POWERFUL FEATURES
                </p>

                <h2 className="text-4xl md:text-5xl font-bold">
                    everything you need to
                    <span className="text-purple-400">Connect</span>
                </h2>
                        <p className="text-gray-400 mt-5"> 
                           powerful tools to make every virtual meeting productive.
                        </p>
                    
                    
                    
                
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 max-w-7xl mx-auto">

                {features.map((feature, index) =>{
                    const Icon = feature.icon;

                    return (
                        <div
                            key={index}
                            className="bg-white/5 border border-white/10 p-8 rounded-2xl hover:border-purple-500/50 hover:bg-purple-500/5 transition duration-300"
                        >
                         <div className="bg-purple-500/15 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
                         
                         <Icon className="text-purple-400" size={28} />
                         </div>

                         <h3 className="text-xl font-bold mb-3">
                            {feature.title}
                         </h3>
                         <p className="text-gray-400 leading-relaxed">
                            {feature.description}
                         </p>
                         </div>
                    );
                })}
            </div>
        </section>
    );
}

export default Features;