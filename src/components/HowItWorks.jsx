import { Video, Users, Link, MessageSquare } from "lucide-react";

const steps = [
    {
       number: "01",
       icon: Link,
       title: "Create a Meeting",
       description: "Start a new meeting with just one click."
    },
    {
       number: "02",
       icon: Users,
       title: "Invite Your Team",
       description: "Share your meeting link with friends and colleagues."

    },
    {
       number: "03",
       icon: Video,
       title: "Connect Instantly",
       description: "Join the conversation and collaborate together."

    }
]; 

function HowItWorks() {
    return (
        <section id="about" className="px-8 py-24">
            <div className="text-center mb-16">
                <p className="text-purple-400 font-semibold mb-3">
                    Simple Process
                </p>

                <h2 className="text-4xl font-bold">
                    How ConnectX works
                </h2>
                <p className="text-gray-400 mt-4">
                Get started with your meetings in three simple steps.
                </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-7xl mx-auto">
                {steps.map((step) =>{
                    const Icon = step.icon;

                    return (
                        <div
                            key={step.number}
                            className="relative bg-white/5 border border-white/10 rounded-2xl p-8 hover:border-purple-500/50 transition"
                        >
                            <span className="text-purple-400 text-sm font-bold">
                                STEP {step.number}
                </span>
                            <div className="my-6 bg-purple-500/15 w-14 h-14 rounded-xl flex items-center justify-center">
           <Icon size={28} className="text-purple-400" />
                            </div>

                            <h3 className="text-xl font-bold mb-3">
                                {step.title}
                            </h3>
                            <p className="text-gray-400 leading-relaxed">
                                {step.description}

                            </p>

                            </div>
                    );
                })}
                </div>
            
        </section>
    );
}

export default HowItWorks;