import { Badge } from "@/components/ui/badge";
import { Upload, Cpu, BarChart3, FileCheck } from "lucide-react";

const steps = [
  {
    number: "01",
    icon: Upload,
    title: "Upload Candidate Data",
    description: "Import resumes, video interviews, audio recordings, or assessment logs through our secure pipeline.",
  },
  {
    number: "02",
    icon: Cpu,
    title: "Multimodal AI Processing",
    description: "Our specialized models analyze each modality for hidden bias patterns and demographic proxies.",
  },
  {
    number: "03",
    icon: BarChart3,
    title: "Causal Fairness Analysis",
    description: "Counterfactual interventions reveal how identity attributes affect scores versus actual skills.",
  },
  {
    number: "04",
    icon: FileCheck,
    title: "Fairness-Adjusted Results",
    description: "Receive corrected scores with full explainability, bias attribution, and audit-ready reports.",
  },
];

export function HowItWorks() {
  return (
    <section className="py-20 lg:py-32">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <Badge variant="secondary" className="mb-4">
            Workflow
          </Badge>
          <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl">
            How FairHire360 Works
          </h2>
          <p className="mt-4 text-lg text-muted-foreground">
            A seamless pipeline from raw recruitment data to bias-free, 
            explainable candidate evaluations.
          </p>
        </div>

        <div className="relative">
          {/* Connection Line */}
          <div className="absolute top-1/2 left-0 right-0 h-0.5 bg-gradient-to-r from-primary via-fair to-accent hidden lg:block -translate-y-1/2 opacity-30" />

          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-4">
            {steps.map((step, index) => (
              <div 
                key={step.number} 
                className="relative text-center animate-slide-up"
                style={{ animationDelay: `${index * 0.15}s` }}
              >
                {/* Step Number */}
                <div className="relative inline-flex">
                  <div className="absolute inset-0 bg-primary/20 rounded-2xl blur-xl" />
                  <div className="relative w-20 h-20 rounded-2xl bg-gradient-hero flex items-center justify-center mb-6 mx-auto">
                    <step.icon className="h-8 w-8 text-primary-foreground" />
                  </div>
                  <div className="absolute -top-2 -right-2 w-8 h-8 rounded-full bg-background border-2 border-primary flex items-center justify-center">
                    <span className="text-xs font-bold text-primary">{step.number}</span>
                  </div>
                </div>

                <h3 className="font-display text-xl font-semibold mb-3">
                  {step.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {step.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
