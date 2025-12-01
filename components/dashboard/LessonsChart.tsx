"use client";

import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";

const data = [
  { month: "Jan", submitted: 450000, approved: 380000, rejected: 70000 },
  { month: "Feb", submitted: 420000, approved: 350000, rejected: 70000 },
  { month: "Mar", submitted: 480000, approved: 400000, rejected: 80000 },
  { month: "Apr", submitted: 460000, approved: 390000, rejected: 70000 },
  { month: "May", submitted: 440000, approved: 370000, rejected: 70000 },
  { month: "Jun", submitted: 500000, approved: 420000, rejected: 80000 },
  { month: "Jul", submitted: 470000, approved: 400000, rejected: 70000 },
  { month: "Aug", submitted: 490000, approved: 410000, rejected: 80000 },
  { month: "Sep", submitted: 450000, approved: 380000, rejected: 70000 },
  { month: "Oct", submitted: 480000, approved: 400000, rejected: 80000 },
  { month: "Nov", submitted: 460000, approved: 390000, rejected: 70000 },
  { month: "Dec", submitted: 500000, approved: 420000, rejected: 80000 },
];

type TimeFilter = "Day" | "Month" | "Year";

export default function LessonsChart() {
  const [timeFilter, setTimeFilter] = useState<TimeFilter>("Month");

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border border-gray-100">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-lg font-semibold text-gray-900">Lessons</h2>
        <div className="flex gap-2">
          {(["Day", "Month", "Year"] as TimeFilter[]).map((filter) => (
            <button
              key={filter}
              onClick={() => setTimeFilter(filter)}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                timeFilter === filter
                  ? "bg-[#059669] text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {filter}
            </button>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#047857]"></div>
          <span className="text-sm text-gray-600">Submitted</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-[#10B981]"></div>
          <span className="text-sm text-gray-600">Approved</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-3 h-3 rounded-full bg-gray-300"></div>
          <span className="text-sm text-gray-600">Rejected</span>
        </div>
      </div>

      <ResponsiveContainer width="100%" height={400}>
        <BarChart data={data}>
          <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
          <XAxis
            dataKey="month"
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
          />
          <YAxis
            stroke="#6B7280"
            fontSize={12}
            tickLine={false}
            axisLine={false}
            tickFormatter={(value) => `${value / 1000}k`}
          />
          <Tooltip
            contentStyle={{
              backgroundColor: "#fff",
              border: "1px solid #E5E7EB",
              borderRadius: "8px",
            }}
            formatter={(value: number) => value.toLocaleString()}
          />
          <Legend
            wrapperStyle={{ paddingTop: "20px" }}
            iconType="circle"
          />
          <Bar
            dataKey="submitted"
            fill="#047857"
            radius={[4, 4, 0, 0]}
            name="Submitted"
          />
          <Bar
            dataKey="approved"
            fill="#10B981"
            radius={[4, 4, 0, 0]}
            name="Approved"
          />
          <Bar
            dataKey="rejected"
            fill="#D1D5DB"
            radius={[4, 4, 0, 0]}
            name="Rejected"
          />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}

