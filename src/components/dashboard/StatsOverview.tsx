import { Card, CardContent } from "@/components/ui/card";
import { Users, Shield, AlertTriangle, TrendingUp } from "lucide-react";
import { cn } from "@/lib/utils";

interface StatCardProps {
  icon: React.ElementType;
  label: string;
  value: string | number;
  change?: { value: number; positive: boolean };
  color: string;
  bgColor: string;
}

function StatCard({ icon: Icon, label, value, change, color, bgColor }: StatCardProps) {
  return (
    <Card variant="elevated" className="overflow-hidden">
      <CardContent className="p-6">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground mb-1">{label}</p>
            <p className="text-3xl font-bold font-display">{value}</p>
            {change && (
              <div className="flex items-center gap-1 mt-2">
                <TrendingUp className={cn("h-3 w-3", change.positive ? "text-fair" : "text-bias rotate-180")} />
                <span className={cn("text-xs font-medium", change.positive ? "text-fair" : "text-bias")}>
                  {change.positive ? "+" : ""}{change.value}% this week
                </span>
              </div>
            )}
          </div>
          <div className={cn("p-3 rounded-xl", bgColor)}>
            <Icon className={cn("h-6 w-6", color)} />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

export function StatsOverview() {
  const stats = [
    {
      icon: Users,
      label: "Candidates Analyzed",
      value: "1,284",
      change: { value: 12, positive: true },
      color: "text-primary",
      bgColor: "bg-primary/10",
    },
    {
      icon: Shield,
      label: "Fairness Score",
      value: "87.3",
      change: { value: 3.2, positive: true },
      color: "text-fair",
      bgColor: "bg-fair/10",
    },
    {
      icon: AlertTriangle,
      label: "Bias Corrections",
      value: "342",
      change: { value: 8, positive: false },
      color: "text-caution",
      bgColor: "bg-caution/10",
    },
    {
      icon: TrendingUp,
      label: "Avg. Score Change",
      value: "+4.7",
      color: "text-chart-4",
      bgColor: "bg-chart-4/10",
    },
  ];

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      {stats.map((stat, index) => (
        <div 
          key={stat.label}
          className="animate-slide-up"
          style={{ animationDelay: `${index * 0.1}s` }}
        >
          <StatCard {...stat} />
        </div>
      ))}
    </div>
  );
}
