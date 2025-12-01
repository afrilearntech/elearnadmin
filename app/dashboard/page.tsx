"use client";

import DashboardLayout from "@/components/layout/DashboardLayout";
import MetricCard from "@/components/dashboard/MetricCard";
import LessonsChart from "@/components/dashboard/LessonsChart";
import HighLearners from "@/components/dashboard/HighLearners";
import RecentActivity from "@/components/dashboard/RecentActivity";

const metrics = [
  { title: "Total Schools", value: 84, change: 12, changeType: "increase" as const },
  { title: "Total Districts", value: 122, change: 5, changeType: "increase" as const },
  { title: "Total Teachers", value: 18, change: 3, changeType: "decrease" as const },
  { title: "Total Parents", value: 473, change: 15, changeType: "increase" as const },
  {
    title: "Total Content Creators",
    value: 84,
    change: 12,
    changeType: "increase" as const,
  },
  {
    title: "Total Content Validators",
    value: 122,
    change: 5,
    changeType: "increase" as const,
  },
  {
    title: "Approved Subjects",
    value: 18,
    change: 3,
    changeType: "decrease" as const,
  },
  {
    title: "Lessons Pending Approval",
    value: 473,
    change: 3,
    changeType: "decrease" as const,
  },
];

export default function DashboardPage() {
  return (
    <DashboardLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            Welcome back, Admin
          </h1>
          <p className="text-gray-600">
            Here is a summary of your platform activity.
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {metrics.map((metric, index) => (
            <MetricCard
              key={index}
              title={metric.title}
              value={metric.value}
              change={metric.change}
              changeType={metric.changeType}
            />
          ))}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <LessonsChart />
          <HighLearners />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <RecentActivity />
        </div>
      </div>
    </DashboardLayout>
  );
}

