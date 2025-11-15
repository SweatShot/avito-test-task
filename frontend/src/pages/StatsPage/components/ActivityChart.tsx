import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend } from "recharts"

interface ActivityChartProps {
  data: { date: string; Одобрено: number; Отклонено: number; "На доработку": number }[];
  isDark?: boolean;
}

export function ActivityChart({ data, isDark }: ActivityChartProps) {
  return (
    <ResponsiveContainer width="100%" height={400}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis 
          dataKey="date" 
          interval={0} 
          tick={{ fill: isDark ? "#e0e0e0" : "#000", fontSize: 12 }} 
        />
        <YAxis tick={{ fill: isDark ? "#e0e0e0" : "#000" }} />
        <Tooltip 
          contentStyle={{ backgroundColor: isDark ? "#2a2a2a" : "#fff", color: isDark ? "#fff" : "#000" }}
        />
        <Legend wrapperStyle={{ color: isDark ? "#e0e0e0" : "#000" }} />
        <Bar dataKey="Одобрено" fill="#82ca9d" />
        <Bar dataKey="Отклонено" fill="#ff7f7f" />
        <Bar dataKey="На доработку" fill="#ffc658" />
      </BarChart>
    </ResponsiveContainer>
  );
}
