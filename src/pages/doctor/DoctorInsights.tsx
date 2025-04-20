
import React from "react";
import { useNavigate } from "react-router-dom";
import { PageContainer, PageHeader, PageSection } from "@/components/layout/page-container";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart as BarChartIcon,
  Download,
  ArrowLeft,
} from "lucide-react";
import { 
  CartesianGrid, 
  XAxis, 
  YAxis, 
  Tooltip, 
  Legend, 
  BarChart, 
  Bar, 
  PieChart, 
  Pie, 
  Cell,
  ResponsiveContainer
} from "recharts";

import { mockPatientsList } from "@/data/mockData";

// Risk level distribution 
const riskDistributionData = [
  { name: "Low Risk", value: 15 },
  { name: "Moderate Risk", value: 8 },
  { name: "High Risk", value: 5 },
];

// Risk colors
const RISK_COLORS = ["#4ade80", "#fbbf24", "#f87171"];

// Risk by age group
const riskByAgeData = [
  { ageGroup: "18-30", lowRisk: 5, moderateRisk: 2, highRisk: 1 },
  { ageGroup: "31-45", lowRisk: 6, moderateRisk: 3, highRisk: 2 },
  { ageGroup: "46-60", lowRisk: 3, moderateRisk: 2, highRisk: 1 },
  { ageGroup: "60+", lowRisk: 1, moderateRisk: 1, highRisk: 1 },
];

// Risk by condition
const riskByConditionData = [
  { name: "Diabetes", value: 8 },
  { name: "Heart Disease", value: 5 },
  { name: "Hypertension", value: 12 },
  { name: "Obesity", value: 7 },
  { name: "Stroke", value: 3 },
];

export default function DoctorInsights() {
  const navigate = useNavigate();
  
  // Count patients with new results
  const patientsWithNewResults = mockPatientsList.filter(patient => patient.hasNewResults).length;
  
  return (
    <PageContainer>
      <PageHeader 
        title="Patient Insights"
        description="Analyze health trends and risk patterns among your patients"
        actions={
          <Button variant="outline" onClick={() => navigate("/doctor-dashboard")}>
            <ArrowLeft className="mr-2 h-4 w-4" /> Back to Dashboard
          </Button>
        }
      />
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Total Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{mockPatientsList.length}</span>
              <Badge className="text-xs bg-blue-100 text-blue-700 hover:bg-blue-100">
                {patientsWithNewResults} with new results
              </Badge>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Risk Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div className="space-y-1">
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-risk-low mr-2"></div>
                  <span className="text-sm">Low: {riskDistributionData[0].value}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-risk-moderate mr-2"></div>
                  <span className="text-sm">Moderate: {riskDistributionData[1].value}</span>
                </div>
                <div className="flex items-center">
                  <div className="w-3 h-3 rounded-full bg-risk-high mr-2"></div>
                  <span className="text-sm">High: {riskDistributionData[2].value}</span>
                </div>
              </div>
              <div className="text-3xl font-bold">
                {riskDistributionData.reduce((acc, item) => acc + item.value, 0)}
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">High Risk Patients</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{riskDistributionData[2].value}</span>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Export List
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <Card>
          <CardHeader>
            <CardTitle>Risk Distribution</CardTitle>
            <CardDescription>Overall risk level distribution among patients</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={riskDistributionData}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {riskDistributionData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={RISK_COLORS[index % RISK_COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Risk by Condition</CardTitle>
            <CardDescription>Number of patients affected by each condition</CardDescription>
          </CardHeader>
          <CardContent className="flex justify-center">
            <div className="w-full h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={riskByConditionData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="value" name="Patients" fill="#9b87f5" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Risk Levels by Age Group</CardTitle>
          <CardDescription>Distribution of risk levels across different age groups</CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <div className="w-full h-[300px]">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={riskByAgeData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="ageGroup" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="lowRisk" name="Low Risk" stackId="a" fill="#4ade80" />
                <Bar dataKey="moderateRisk" name="Moderate Risk" stackId="a" fill="#fbbf24" />
                <Bar dataKey="highRisk" name="High Risk" stackId="a" fill="#f87171" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="flex justify-end mt-6 space-x-2">
        <Button variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export PDF Report
        </Button>
        <Button>
          <BarChartIcon className="h-4 w-4 mr-2" />
          Generate Detailed Analysis
        </Button>
      </div>
    </PageContainer>
  );
}
