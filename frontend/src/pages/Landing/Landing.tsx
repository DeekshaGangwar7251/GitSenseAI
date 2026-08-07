import Navbar from "../../components/landing/Navbar/Navbar";
import Hero from "../../components/landing/Hero";
import FeatureGrid from "../../components/landing/FeatureGrid";
import Workflow from "../../components/landing/Workflow";
import CTA from "../../components/landing/CTA";
import Footer from "../../components/landing/Footer";

function Landing() {
  return (
    <div className="min-h-screen bg-[#F7F8FC]">
      <Navbar />

      <Hero />

      <section id="features">
        <FeatureGrid />
      </section>

      <section id="workflow">
        <Workflow />
      </section>

      <CTA />

      <section id="about">
        <Footer />
      </section>
    </div>
  );
}

export default Landing;