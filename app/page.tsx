import HeroSection from '@/components/HeroSection';
import TrustSection from '@/components/TrustSection';
import FeatureCards from '@/components/FeatureCards';
import HowItWorks from '@/components/HowItWorks';
import InteractiveDemo from '@/components/InteractiveDemo';
import CtaSection from '@/components/CtaSection';

export default function Home() {
  return (
    <>
      <HeroSection />
      <TrustSection />
      <FeatureCards />
      <HowItWorks />
      <InteractiveDemo />
      <CtaSection />
    </>
  );
}
