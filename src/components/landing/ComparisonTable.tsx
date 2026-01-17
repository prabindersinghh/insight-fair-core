import { Check, X, Minus } from "lucide-react";

const comparisons = [
  {
    feature: "Resume parsing",
    traditional: "Keyword matching",
    fairhire: "Contextual understanding",
    traditionalType: "limited",
    fairhireType: "good",
  },
  {
    feature: "Interview analysis",
    traditional: "Ignored",
    fairhire: "Multimodal AI",
    traditionalType: "bad",
    fairhireType: "good",
  },
  {
    feature: "Bias detection",
    traditional: "None",
    fairhire: "Causal detection",
    traditionalType: "bad",
    fairhireType: "good",
  },
  {
    feature: "Accent fairness",
    traditional: "Penalized",
    fairhire: "Corrected",
    traditionalType: "bad",
    fairhireType: "good",
  },
  {
    feature: "Mental health",
    traditional: "Ignored",
    fairhire: "Protected",
    traditionalType: "bad",
    fairhireType: "good",
  },
  {
    feature: "JD matching",
    traditional: "Static",
    fairhire: "Context-aware",
    traditionalType: "limited",
    fairhireType: "good",
  },
  {
    feature: "Transparency",
    traditional: "Black box",
    fairhire: "Explainable",
    traditionalType: "bad",
    fairhireType: "good",
  },
  {
    feature: "Human review",
    traditional: "After rejection",
    fairhire: "Before rejection",
    traditionalType: "limited",
    fairhireType: "good",
  },
];

const getIcon = (type: string) => {
  switch (type) {
    case "good":
      return <Check className="h-4 w-4 text-fair" />;
    case "bad":
      return <X className="h-4 w-4 text-bias" />;
    case "limited":
      return <Minus className="h-4 w-4 text-caution" />;
    default:
      return null;
  }
};

const getRowStyle = (type: string) => {
  switch (type) {
    case "good":
      return "text-fair";
    case "bad":
      return "text-bias";
    case "limited":
      return "text-caution";
    default:
      return "text-muted-foreground";
  }
};

export function ComparisonTable() {
  return (
    <section className="py-20 lg:py-28 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-3xl mx-auto text-center mb-16">
          <h2 className="font-display text-3xl font-bold sm:text-4xl lg:text-5xl mb-4 animate-slide-up">
            What Makes Us{" "}
            <span className="text-gradient-hero">Different</span>
          </h2>
          <p className="text-muted-foreground text-lg">
            See how FairHire360 compares to traditional ATS systems
          </p>
        </div>

        <div className="max-w-4xl mx-auto animate-scale-in">
          <div className="overflow-hidden rounded-xl border border-border shadow-soft">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-secondary">
                    <th className="text-left p-4 font-display font-semibold text-foreground">
                      Feature
                    </th>
                    <th className="text-left p-4 font-display font-semibold text-muted-foreground">
                      Traditional ATS
                    </th>
                    <th className="text-left p-4 font-display font-semibold text-primary">
                      FairHire360
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {comparisons.map((row, index) => (
                    <tr
                      key={row.feature}
                      className={`border-t border-border transition-colors hover:bg-muted/50 ${
                        index % 2 === 0 ? "bg-card" : "bg-background"
                      }`}
                    >
                      <td className="p-4 font-medium text-foreground">
                        {row.feature}
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getIcon(row.traditionalType)}
                          <span className={getRowStyle(row.traditionalType)}>
                            {row.traditional}
                          </span>
                        </div>
                      </td>
                      <td className="p-4">
                        <div className="flex items-center gap-2">
                          {getIcon(row.fairhireType)}
                          <span className={`font-medium ${getRowStyle(row.fairhireType)}`}>
                            {row.fairhire}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
