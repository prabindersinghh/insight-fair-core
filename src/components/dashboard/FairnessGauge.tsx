import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PieChart, Pie, Cell, ResponsiveContainer, Tooltip } from "recharts";
import { Shield } from "lucide-react";
import { cn } from "@/lib/utils";

interface FairnessGaugeProps {
  score: number;
  label: string;
  description?: string;
}

export function FairnessGauge({ score, label, description }: FairnessGaugeProps) {
  const getStatus = () => {
    if (score >= 85) return { label: "Excellent", color: "text-fair", variant: "fair" as const };
    if (score >= 70) return { label: "Good", color: "text-primary", variant: "default" as const };
    if (score >= 50) return { label: "Moderate", color: "text-caution", variant: "caution" as const };
    return { label: "Poor", color: "text-bias", variant: "bias" as const };
  };

  const status = getStatus();

  const data = [
    { name: "Score", value: score },
    { name: "Remaining", value: 100 - score },
  ];

  const colors = {
    fair: ["hsl(152, 70%, 40%)", "hsl(152, 40%, 90%)"],
    default: ["hsl(175, 60%, 35%)", "hsl(175, 40%, 90%)"],
    caution: ["hsl(38, 95%, 55%)", "hsl(38, 60%, 90%)"],
    bias: ["hsl(0, 72%, 51%)", "hsl(0, 50%, 90%)"],
  };

  const currentColors = colors[status.variant];

  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardHeader className="pb-0">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{label}</CardTitle>
          <Badge variant={status.variant}>{status.label}</Badge>
        </div>
        {description && (
          <CardDescription className="text-xs">{description}</CardDescription>
        )}
      </CardHeader>
      <CardContent className="pt-4">
        <div className="relative h-40">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={data}
                cx="50%"
                cy="50%"
                innerRadius={50}
                outerRadius={70}
                startAngle={180}
                endAngle={0}
                paddingAngle={0}
                dataKey="value"
              >
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={currentColors[index]} />
                ))}
              </Pie>
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                }}
              />
            </PieChart>
          </ResponsiveContainer>
          
          {/* Center Content */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pt-8">
            <Shield className={cn("h-5 w-5 mb-1", status.color)} />
            <span className={cn("text-3xl font-bold font-display", status.color)}>
              {score}
            </span>
            <span className="text-xs text-muted-foreground">/ 100</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
