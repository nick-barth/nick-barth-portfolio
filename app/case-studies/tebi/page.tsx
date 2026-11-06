import { BusinessTypes } from "./_components/business-types";
import { Connection } from "./_components/connection";
import { CustomerLogos } from "./_components/customer-logos";
import { Everything } from "./_components/everything";
import { Faq } from "./_components/faq";
import { Features } from "./_components/features";
import { Cta, Footer } from "./_components/footer";
import { Hero } from "./_components/hero";
import { Nav } from "./_components/nav";
import { Pricing } from "./_components/pricing";
import { Testimonials } from "./_components/testimonials";

export default function Home() {
  return (
    <>
      <Nav />
      <main>
        <Hero />
        <CustomerLogos />
        <Connection />
        <Features />
        <Testimonials />
        <BusinessTypes />
        <Everything />
        <Pricing />
        <Faq />
        <Cta />
      </main>
      <Footer />
    </>
  );
}
