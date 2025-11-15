import { useNavigate } from "react-router-dom"
import { useMemo } from "react"
import { Button, Row, Col } from "antd"
import { useStats } from "../../hooks/useStats"
import { StatsCards } from "./components/StatsCards"
import { ActivityChart } from "./components/ActivityChart"
import { PieChartComponent } from "./components/PieChartComponent"

export default function StatsPage() {
  const navigate = useNavigate()
  const { summary, activityData, decisionsData, categoriesData, formattedAverageTime } = useStats()

  const isDark = document.documentElement.getAttribute("data-theme") === "dark"

  const activityDataFormatted = useMemo(() => {
    const map: Record<string, { date: string; Одобрено: number; Отклонено: number; "На доработку": number }> = {}
    activityData.forEach(item => {
      if (!map[item.date]) map[item.date] = { date: item.date, Одобрено: 0, Отклонено: 0, "На доработку": 0 }
      map[item.date][item.type as "Одобрено" | "Отклонено" | "На доработку"] = item.value
    })
    return Object.values(map)
  }, [activityData])

  return (
    <div style={{ padding: 20 }}>
      <Button type="default" onClick={() => navigate("/list")}>← Назад к списку</Button>

      <h1 style={{ marginTop: 20, color: isDark ? "#fff" : "#000" }}>Статистика модератора</h1>

      <StatsCards
        totalReviewed={{
          today: summary.today?.totalReviewed ?? 0,
          week: summary.week?.totalReviewed ?? 0,
          month: summary.month?.totalReviewed ?? 0,
        }}
        decisionsData={decisionsData}
        averageTime={formattedAverageTime}
      />

      <Row gutter={[20, 20]} style={{ marginTop: 40 }}>
        <Col span={24}>
          <ActivityChart data={activityDataFormatted} isDark={isDark} />
        </Col>
      </Row>

      <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
        <Col xs={24} md={12}>
          <PieChartComponent
            title="Распределение решений, %"
            data={decisionsData}
            isDark={isDark}
            showPercentage={true} 
          />
        </Col>
        <Col xs={24} md={12}>
          <PieChartComponent
            title="Распределение по категориям"
            data={categoriesData}
            isDark={isDark}
            showPercentage={false} 
          />
        </Col>
      </Row>
    </div>
  )
}
