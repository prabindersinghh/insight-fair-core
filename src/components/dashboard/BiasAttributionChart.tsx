import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, ReferenceLine } from "recharts";

interface BiasAttributionChartProps {
  data: {
    factor: string;
    contribution: number;
    category: "positive" | "negative" | "neutral";
  }[];
}

export function BiasAttributionChart({ data }: BiasAttributionChartProps) {
  const getColor = (category: string) => {
    switch (category) {
      case "positive":
        return "hsl(152, 70%, 40%)";
      case "negative":
        return "hsl(0, 72%, 51%)";
      default:
        return "hsl(210, 15%, 60%)";
    }
  };

  return (
    <Card variant="elevated">
      <CardHeader>
        <CardTitle>Bias Attribution Analysis</CardTitle>
        <CardDescription>
          Impact of detected bias factors on candidate score (% contribution)
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="h-80">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart
              data={data}
              layout="vertical"
              margin={{ top: 5, right: 30, left: 100, bottom: 5 }}
            >
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
              <XAxis 
                type="number" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                tickFormatter={(value) => `${value}%`}
              />
              <YAxis 
                type="category" 
                dataKey="factor" 
                stroke="hsl(var(--muted-foreground))"
                fontSize={12}
                width={90}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: "hsl(var(--card))",
                  border: "1px solid hsl(var(--border))",
                  borderRadius: "8px",
                  boxShadow: "var(--shadow-lg)",
                }}
                labelStyle={{ color: "hsl(var(--foreground))", fontWeight: 600 }}
                formatter={(value: number) => [`${value.toFixed(1)}%`, "Contribution"]}
              />
              <ReferenceLine x={0} stroke="hsl(var(--muted-foreground))" />
              <Bar dataKey="contribution" radius={[0, 4, 4, 0]}>
                {data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={getColor(entry.category)} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
