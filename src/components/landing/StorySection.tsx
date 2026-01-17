import { Card, CardContent } from "@/components/ui/card";
import { Quote, MapPin, Briefcase, CheckCircle2 } from "lucide-react";

export function StorySection() {
  return (
    <section className="py-20 lg:py-28 bg-secondary/30">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-12">
          <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl mb-4 animate-slide-up">
            A Real Story.{" "}
            <span className="text-gradient-hero">A Fair Outcome.</span>
          </h2>
        </div>

        <Card className="max-w-4xl mx-auto border-0 shadow-elevated bg-card overflow-hidden animate-scale-in">
          <CardContent className="p-0">
            <div className="grid md:grid-cols-5">
              {/* Left visual column */}
              <div className="md:col-span-2 bg-gradient-hero p-8 flex flex-col justify-center items-center text-primary-foreground">
                <div className="w-20 h-20 rounded-full bg-primary-foreground/20 flex items-center justify-center mb-4">
                  <Quote className="h-10 w-10" />
                </div>
                <div className="flex items-center gap-2 mb-2">
                  <MapPin className="h-4 w-4" />
                  <span className="text-sm opacity-90">Bihar, India</span>
                </div>
                <div className="flex items-center gap-2">
                  <Briefcase className="h-4 w-4" />
                  <span className="text-sm opacity-90">Junior Data Analyst</span>
                </div>
              </div>

              {/* Story content */}
              <div className="md:col-span-3 p-8">
                <div className="space-y-4 text-muted-foreground">
                  <p className="text-lg leading-relaxed">
                    <strong className="text-foreground">Ramesh</strong> is a final-year student from a small village in Bihar. 
                    He speaks slowly, struggles with English interviews, and avoids eye contact due to social anxiety.
                  </p>

                  <div className="flex items-start gap-3 p-4 bg-bias-muted rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-bias mt-2" />
                    <p className="text-sm">
                      <strong className="text-bias">Traditional ATS systems rejected him repeatedly.</strong>
                    </p>
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-fair mt-0.5 flex-shrink-0" />
                      <p className="text-sm">FairHire360 evaluated his resume and interview objectively.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-fair mt-0.5 flex-shrink-0" />
                      <p className="text-sm">His skills matched the job.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-fair mt-0.5 flex-shrink-0" />
                      <p className="text-sm">Communication bias was neutralized.</p>
                    </div>
                    <div className="flex items-start gap-3">
                      <CheckCircle2 className="h-5 w-5 text-fair mt-0.5 flex-shrink-0" />
                      <p className="text-sm">Confidence penalties were removed.</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3 p-4 bg-fair-muted rounded-lg">
                    <div className="w-2 h-2 rounded-full bg-fair mt-2" />
                    <p className="text-sm font-medium text-fair">
                      Today, he works as a Junior Data Analyst in Bangalore.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <div className="text-center mt-12">
          <p className="text-lg font-medium text-foreground italic">
            "Inclusion is not a feature. It is infrastructure."
          </p>
        </div>
      </div>
    </section>
  );
}
