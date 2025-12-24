import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MessageSquare, Download, AlertTriangle, CheckCircle, Info, ArrowRight } from "lucide-react";

interface Explanation {
  type: "correction" | "detection" | "info" | "warning";
  title: string;
  description: string;
  impact: number;
}

interface ExplainabilityPanelProps {
  candidateName: string;
  explanations: Explanation[];
  onDownloadReport: () => void;
}

export function ExplainabilityPanel({ 
  candidateName, 
  explanations,
  onDownloadReport 
}: ExplainabilityPanelProps) {
  const getIcon = (type: string) => {
    switch (type) {
      case "correction":
        return CheckCircle;
      case "detection":
      case "warning":
        return AlertTriangle;
      default:
        return Info;
    }
  };

  const getColor = (type: string) => {
    switch (type) {
      case "correction":
        return "text-fair bg-fair/10 border-fair/20";
      case "detection":
        return "text-caution bg-caution/10 border-caution/20";
      case "warning":
        return "text-bias bg-bias/10 border-bias/20";
      default:
        return "text-primary bg-primary/10 border-primary/20";
    }
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/10">
              <MessageSquare className="h-5 w-5 text-primary" />
            </div>
            <div>
              <CardTitle>Explainability Report</CardTitle>
              <CardDescription>
                Human-readable explanations for {candidateName}
              </CardDescription>
            </div>
          </div>
          <Button variant="outline" size="sm" onClick={onDownloadReport}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {explanations.map((exp, index) => {
          const Icon = getIcon(exp.type);
          const colorClass = getColor(exp.type);
          
          return (
            <div 
              key={index}
              className={`p-4 rounded-lg border ${colorClass} animate-slide-up`}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className="flex items-start gap-3">
                <Icon className="h-5 w-5 mt-0.5 shrink-0" />
                <div className="flex-1">
                  <div className="flex items-center justify-between mb-1">
                    <h4 className="font-medium">{exp.title}</h4>
                    <Badge variant="muted" className="text-xs">
                      {exp.impact > 0 ? "+" : ""}{exp.impact}% impact
                    </Badge>
                  </div>
                  <p className="text-sm opacity-90">{exp.description}</p>
                </div>
              </div>
            </div>
          );
        })}

        <div className="pt-4 border-t border-border">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {explanations.length} factors analyzed
            </span>
            <Button variant="link" size="sm" className="gap-1 p-0 h-auto">
              View full audit log
              <ArrowRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
