import Navbar from "../components/Navbar";
import Features from "../components/Features";
import Stats from "../components/stats";
import HowItWorks from "../components/HowItWorks";
import CTA from "../components/CTA";
import Footer from "../components/Footer";
import Home from "./Home";

function LandingPage() {
    return (
        <div>
            <Navbar />
            <Home />
            <Stats />
            <Features />
            <HowItWorks />
            <CTA />
            <Footer />
            

        </div>
    );
}
export default LandingPage;