const stats =[
    { number:"4K",label:"Video Quality" },
    { number:"99.9%",label:"Uptime Target" },
    { number:"24/7",label:"Accessibility" },
    { number:"1-Click",label:"Easy Meetings"}
];

function Stats() {
    return (
        <section className="px-8 py-16 border-y border-white/10 bg-white/[0.02]">

            <div className="max-w-7xl mx-auto grid grid-cols-2 md:grid-cols-4 gap-8 text-center">

                {stats.map((stat, index) => (
                    <div key ={index}
                         className="text-center p-6 rounded-2xl hover:bg-white/5 transition duration-300 group"
                    >
                        <h2 className="text-3xl md:text-4xl font-bold text-purple-400">
                            {stat.number}
                        </h2>

                        <p className="text-gray-400 mt-3">
                            {stat.label}
                        </p>
                    </div>
                ))}
            </div>
        </section>
    );
}
export default Stats;