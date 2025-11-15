import { ResponsiveContainer, PieChart, Pie, Cell, Legend, Tooltip, PieLabelRenderProps } from "recharts"

export interface PieChartComponentProps {
  title: string
  data: { type: string; value: number }[]
  colors?: string[]
  isDark?: boolean
  showPercentage?: boolean // новый флаг
}

export function PieChartComponent({
  title,
  data,
  colors,
  isDark,
  showPercentage = true,
}: PieChartComponentProps) {
  const defaultColors = colors || ["#82ca9d", "#ff7f7f", "#ffc658"]

  return (
    <div className="chartContainer">
      <h3 style={{ color: isDark ? "#e0e0e0" : "#000" }}>{title}</h3>
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={data}
            dataKey="value"
            nameKey="type"
            cx="50%"
            cy="50%"
            outerRadius={80}
            label={(entry: PieLabelRenderProps) => {
              const value = Number(entry.value)
              return showPercentage
                ? `${entry.name}: ${value.toFixed(2)}%`
                : `${entry.name}: ${Math.round(value)}`
            }}
          >
            {data.map((_, index) => (
              <Cell key={index} fill={defaultColors[index % defaultColors.length]} />
            ))}
          </Pie>
          <Legend wrapperStyle={{ color: isDark ? "#e0e0e0" : "#000" }} />
          <Tooltip
            formatter={(value: number) =>
              showPercentage ? value.toFixed(2) + "%" : Math.round(value)
            }
            contentStyle={{
              backgroundColor: isDark ? "#2a2a2a" : "#fff",
              borderColor: isDark ? "#555" : "#ccc",
              color: isDark ? "#fff" : "#000",
            }}
          />
        </PieChart>
      </ResponsiveContainer>
    </div>
  )
}
