import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  FileText, 
  Download, 
  Calendar, 
  BarChart3, 
  PieChart, 
  TrendingUp,
  Filter,
  Plus
} from "lucide-react";
import { toast } from "sonner";

const reports = [
  {
    id: "1",
    title: "Weekly Fairness Audit",
    description: "Comprehensive bias analysis across all recruitment activities",
    date: "Dec 20, 2025",
    type: "Audit",
    status: "Ready",
  },
  {
    id: "2",
    title: "Quarterly DEI Report",
    description: "Diversity, equity, and inclusion metrics for Q4 2025",
    date: "Dec 15, 2025",
    type: "DEI",
    status: "Ready",
  },
  {
    id: "3",
    title: "Bias Correction Summary",
    description: "Overview of all bias corrections applied this month",
    date: "Dec 10, 2025",
    type: "Summary",
    status: "Ready",
  },
  {
    id: "4",
    title: "Causal Analysis Deep Dive",
    description: "Detailed counterfactual analysis for high-bias candidates",
    date: "Dec 5, 2025",
    type: "Analysis",
    status: "Processing",
  },
];

const Reports = () => {
  const handleDownload = (reportTitle: string) => {
    toast.success("Download started", {
      description: `${reportTitle} is being downloaded.`,
    });
  };

  return (
    <Layout>
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
          <div>
            <h1 className="font-display text-3xl font-bold">Reports</h1>
            <p className="text-muted-foreground mt-1">
              Access and download fairness audit reports
            </p>
          </div>
          
          <div className="flex items-center gap-3">
            <Button variant="outline" size="sm">
              <Filter className="h-4 w-4 mr-2" />
              Filters
            </Button>
            <Button variant="hero" size="sm">
              <Plus className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
          </div>
        </div>

        {/* Quick Stats */}
        <div className="grid gap-4 md:grid-cols-4 mb-8">
          {[
            { icon: FileText, label: "Total Reports", value: "47", color: "text-primary bg-primary/10" },
            { icon: BarChart3, label: "This Month", value: "12", color: "text-fair bg-fair/10" },
            { icon: PieChart, label: "DEI Reports", value: "8", color: "text-accent bg-accent/10" },
            { icon: TrendingUp, label: "Avg. Score", value: "87%", color: "text-chart-4 bg-chart-4/10" },
          ].map((stat, index) => (
            <Card 
              key={stat.label} 
              variant="elevated"
              className="animate-slide-up"
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <CardContent className="p-6">
                <div className="flex items-center gap-4">
                  <div className={`p-3 rounded-xl ${stat.color}`}>
                    <stat.icon className="h-5 w-5" />
                  </div>
                  <div>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                    <p className="text-2xl font-bold font-display">{stat.value}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Reports List */}
        <Card variant="elevated">
          <CardHeader>
            <CardTitle>Recent Reports</CardTitle>
            <CardDescription>
              Download or view detailed fairness and bias analysis reports
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {reports.map((report, index) => (
                <div 
                  key={report.id}
                  className="flex items-center justify-between p-4 rounded-lg border border-border hover:bg-muted/50 transition-colors animate-slide-up"
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <div className="flex items-center gap-4">
                    <div className="p-3 rounded-xl bg-primary/10">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-medium">{report.title}</h3>
                      <p className="text-sm text-muted-foreground">{report.description}</p>
                      <div className="flex items-center gap-3 mt-2">
                        <div className="flex items-center gap-1 text-xs text-muted-foreground">
                          <Calendar className="h-3 w-3" />
                          {report.date}
                        </div>
                        <Badge variant="muted">{report.type}</Badge>
                      </div>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <Badge variant={report.status === "Ready" ? "fair" : "caution"}>
                      {report.status}
                    </Badge>
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => handleDownload(report.title)}
                      disabled={report.status !== "Ready"}
                    >
                      <Download className="h-4 w-4 mr-2" />
                      Download
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Reports;
