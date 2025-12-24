import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  FileText, 
  Video, 
  Mic, 
  Brain, 
  Scale, 
  Eye,
  Layers,
  ShieldCheck
} from "lucide-react";

const features = [
  {
    icon: FileText,
    title: "Resume Analysis",
    description: "Detect gender-coded language, regional proxies, and socio-economic indicators with fairness-invariant embeddings.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Video,
    title: "Video Interview Analysis",
    description: "Neurodivergence-safe evaluation with appearance bias detection and background invariance checks.",
    color: "text-fair",
    bgColor: "bg-fair/10",
  },
  {
    icon: Mic,
    title: "Speech & Audio Analysis",
    description: "Accent-aware ASR with noise normalization for rural environments and speech-disorder tolerance.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: Brain,
    title: "Causal Fairness Engine",
    description: "Structural Causal Models with counterfactual interventions to isolate skill from identity.",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
  {
    icon: Scale,
    title: "Agentic Bias Governance",
    description: "Three cooperating AI agents for detection, explanation, and correction with auditable logs.",
    color: "text-primary",
    bgColor: "bg-primary/10",
  },
  {
    icon: Eye,
    title: "Explainable Outputs",
    description: "Human-readable explanations with bias attribution heatmaps and before/after comparisons.",
    color: "text-fair",
    bgColor: "bg-fair/10",
  },
  {
    icon: Layers,
    title: "Cross-Modal Consistency",
    description: "Compare resume vs interview scores and detect modality-level bias inconsistencies.",
    color: "text-accent",
    bgColor: "bg-accent/10",
  },
  {
    icon: ShieldCheck,
    title: "Privacy-First Design",
    description: "Sensitive metadata stripping with human-in-the-loop override for uncertain cases.",
    color: "text-chart-4",
    bgColor: "bg-chart-4/10",
  },
];

export function Features() {
  return (
    <section className="py-20 lg:py-32 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
            Multimodal Fairness Analysis
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            Comprehensive bias detection across all recruitment touchpoints with 
            causal AI for true fairness correction.
          </p>
        </div>

        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
          {features.map((feature, index) => (
            <Card 
              key={feature.title} 
              variant="elevated"
              className="group hover:-translate-y-1 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardHeader>
                <div className={`${feature.bgColor} w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-transform group-hover:scale-110`}>
                  <feature.icon className={`h-6 w-6 ${feature.color}`} />
                </div>
                <CardTitle className="text-lg">{feature.title}</CardTitle>
              </CardHeader>
              <CardContent>
                <CardDescription className="text-sm leading-relaxed">
                  {feature.description}
                </CardDescription>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
