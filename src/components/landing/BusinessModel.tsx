import { Card, CardContent } from "@/components/ui/card";
import { CreditCard, Plug, FileCheck, GraduationCap, Building2 } from "lucide-react";

const businessFeatures = [
  {
    icon: CreditCard,
    title: "SaaS Subscription",
    description: "Per recruiter pricing",
  },
  {
    icon: Plug,
    title: "ATS Integration API",
    description: "Seamless integration",
  },
  {
    icon: FileCheck,
    title: "Compliance Reports",
    description: "Fairness audit reports",
  },
  {
    icon: GraduationCap,
    title: "Campus Edition",
    description: "Campus hiring ready",
  },
  {
    icon: Building2,
    title: "Government & PSU",
    description: "Licensing available",
  },
];

export function BusinessModel() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl mb-4 animate-slide-up">
            Enterprise-Ready{" "}
            <span className="text-gradient-hero">Fairness Layer</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            Built for scale. Designed for compliance.
          </p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 max-w-5xl mx-auto">
          {businessFeatures.map((feature, index) => (
            <Card
              key={feature.title}
              className="border border-border shadow-soft hover:shadow-elevated transition-all duration-300 bg-card text-center animate-slide-up group"
              style={{ animationDelay: `${index * 0.05}s` }}
            >
              <CardContent className="p-6">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/20 transition-colors">
                  <feature.icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-display text-sm font-semibold mb-1 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-xs text-muted-foreground">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
