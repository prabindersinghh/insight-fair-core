import { Target, Eye } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";

export function MissionVision() {
  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto">
          <div className="grid md:grid-cols-2 gap-8">
            {/* Mission */}
            <Card className="border-0 shadow-elevated bg-card overflow-hidden animate-slide-up">
              <CardContent className="p-0">
                <div className="h-2 bg-gradient-hero" />
                <div className="p-8">
                  <div className="w-14 h-14 rounded-2xl bg-primary/10 flex items-center justify-center mb-6">
                    <Target className="h-7 w-7 text-primary" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-4 text-foreground">
                    Our Mission
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Ensure no candidate is rejected because of how they speak, 
                    where they come from, or who they are.
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Vision */}
            <Card className="border-0 shadow-elevated bg-card overflow-hidden animate-slide-up" style={{ animationDelay: "0.1s" }}>
              <CardContent className="p-0">
                <div className="h-2 bg-gradient-fair" />
                <div className="p-8">
                  <div className="w-14 h-14 rounded-2xl bg-fair/10 flex items-center justify-center mb-6">
                    <Eye className="h-7 w-7 text-fair" />
                  </div>
                  <h3 className="font-display text-2xl font-bold mb-4 text-foreground">
                    Our Vision
                  </h3>
                  <p className="text-lg text-muted-foreground leading-relaxed">
                    Become India's national fairness infrastructure for AI-driven hiring.
                  </p>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </section>
  );
}
