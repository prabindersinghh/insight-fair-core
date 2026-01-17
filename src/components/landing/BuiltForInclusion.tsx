import { Card, CardContent } from "@/components/ui/card";
import { Brain, Mic, Users, Languages, Eye } from "lucide-react";

const inclusionFeatures = [
  {
    icon: Brain,
    title: "Mental Health Bias Protection",
    description: "Anxiety, ADHD, low confidence and neurodivergent behavior are not penalized.",
    gradient: "from-purple-500/10 to-pink-500/10",
    iconBg: "bg-purple-100 dark:bg-purple-900/30",
    iconColor: "text-purple-600 dark:text-purple-400",
  },
  {
    icon: Mic,
    title: "Speech & Accent Fairness",
    description: "Accent, stammering, rural dialects and English fluency never reduce scores.",
    gradient: "from-blue-500/10 to-cyan-500/10",
    iconBg: "bg-blue-100 dark:bg-blue-900/30",
    iconColor: "text-blue-600 dark:text-blue-400",
  },
  {
    icon: Users,
    title: "Caste, Creed & Gender Neutrality",
    description: "No demographic signals influence ranking.",
    gradient: "from-fair/10 to-primary/10",
    iconBg: "bg-fair-muted",
    iconColor: "text-fair",
  },
  {
    icon: Languages,
    title: "Language Inclusion",
    description: "Supports Hindi and regional language resumes & interviews.",
    gradient: "from-amber-500/10 to-orange-500/10",
    iconBg: "bg-amber-100 dark:bg-amber-900/30",
    iconColor: "text-amber-600 dark:text-amber-400",
  },
  {
    icon: Eye,
    title: "Disability-Aware Scoring",
    description: "Eye-contact avoidance and speech delay are corrected, not punished.",
    gradient: "from-primary/10 to-fair/10",
    iconBg: "bg-primary/10",
    iconColor: "text-primary",
  },
];

export function BuiltForInclusion() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl mb-4 animate-slide-up">
            Built for Inclusion.{" "}
            <span className="text-gradient-hero">Designed for Fair Opportunity.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
          {inclusionFeatures.map((feature, index) => (
            <Card
              key={feature.title}
              className={`group border-0 shadow-soft hover:shadow-elevated transition-all duration-300 bg-gradient-to-br ${feature.gradient} backdrop-blur-sm animate-slide-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className={`w-12 h-12 rounded-xl ${feature.iconBg} flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                  <feature.icon className={`h-6 w-6 ${feature.iconColor}`} />
                </div>
                <h3 className="font-display text-lg font-semibold mb-2 text-foreground">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="text-center mt-12">
          <p className="text-lg font-medium text-foreground italic">
            "Inclusion is not charity. It is correct engineering."
          </p>
        </div>
      </div>
    </section>
  );
}
