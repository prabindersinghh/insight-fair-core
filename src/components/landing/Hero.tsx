import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const featureStrip = [
  "Text",
  "Resume",
  "Audio",
  "Video",
  "Language",
  "Behavior",
  "Causal Fairness Graphs",
];

export function Hero() {
  return (
    <section className="relative overflow-hidden py-20 lg:py-32">
      {/* Background Elements */}
      <div className="absolute inset-0 -z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-3xl animate-pulse-soft" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-fair/10 rounded-full blur-3xl animate-pulse-soft" style={{ animationDelay: "1s" }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-primary/5 via-transparent to-fair/5 rounded-full blur-3xl" />
      </div>

      <div className="container mx-auto px-4">
        <div className="mx-auto max-w-4xl text-center">
          {/* Badge */}
          <div className="inline-flex animate-slide-down">
            <Badge variant="secondary" className="gap-2 px-4 py-1.5 text-sm">
              <Sparkles className="h-3.5 w-3.5 text-primary" />
              AI for Inclusion Hackathon 2026 · SabkaAI Track
            </Badge>
          </div>

          {/* Headline */}
          <h1 className="mt-8 font-display text-4xl font-bold tracking-tight sm:text-5xl lg:text-7xl animate-slide-up">
            FairHire{" "}
            <span className="text-gradient-hero">360</span>
          </h1>

          {/* Subheadline */}
          <h2 className="mt-4 font-display text-xl sm:text-2xl lg:text-3xl text-muted-foreground animate-slide-up" style={{ animationDelay: "0.05s" }}>
            Bias-Free Recruitment, Powered by AI
          </h2>

          {/* Description */}
          <p className="mt-6 text-lg text-muted-foreground sm:text-xl max-w-3xl mx-auto animate-slide-up" style={{ animationDelay: "0.1s" }}>
            FairHire360 detects, explains, and corrects hidden bias in recruitment — 
            ensuring candidates are evaluated on skill alone, not identity, accent, background, or mental health conditions.
          </p>

          {/* Feature Strip */}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-2 animate-slide-up" style={{ animationDelay: "0.15s" }}>
            {featureStrip.map((feature, index) => (
              <span
                key={feature}
                className="inline-flex items-center px-3 py-1.5 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20"
              >
                {feature}
              </span>
            ))}
          </div>

          {/* CTA Buttons */}
          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: "0.2s" }}>
            <Link to="/dashboard">
              <Button variant="hero" size="xl" className="group">
                Explore Dashboard
                <ArrowRight className="h-5 w-5 transition-transform group-hover:translate-x-1" />
              </Button>
            </Link>
            <Button variant="glass" size="xl">
              View Documentation
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
