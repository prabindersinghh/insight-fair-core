import { Layout } from "@/components/layout/Layout";
import { Hero } from "@/components/landing/Hero";
import { BuiltForInclusion } from "@/components/landing/BuiltForInclusion";
import { StorySection } from "@/components/landing/StorySection";
import { ComparisonTable } from "@/components/landing/ComparisonTable";
import { Features } from "@/components/landing/Features";
import { MissionVision } from "@/components/landing/MissionVision";
import { BusinessModel } from "@/components/landing/BusinessModel";
import { CTA } from "@/components/landing/CTA";
import { Footer } from "@/components/landing/Footer";

const Index = () => {
  return (
    <Layout>
      <Hero />
      <BuiltForInclusion />
      <StorySection />
      <ComparisonTable />
      <Features />
      <MissionVision />
      <BusinessModel />
      <CTA />
      <Footer />
    </Layout>
  );
};

export default Index;
