import Navbar from "../../components/landing/Navbar/Navbar";
import Hero from "../../components/landing/Hero";
import FeatureGrid from "../../components/landing/FeatureGrid";
import Workflow from "../../components/landing/Workflow";
import CTA from "../../components/landing/CTA";
import Footer from "../../components/landing/Footer";

function Landing() {
  return (
    <div className="min-h-screen w-full overflow-x-hidden bg-white">
      <Navbar />

      <main>
        <Hero />

        <section
          id="features"
          className="scroll-mt-20"
        >
          <FeatureGrid />
        </section>

        <section
          id="workflow"
          className="scroll-mt-20"
        >
          <Workflow />
        </section>

        <CTA />

        <section
          id="about"
          className="scroll-mt-20"
        >
          <Footer />
        </section>
      </main>
    </div>
  );
}

export default Landing;