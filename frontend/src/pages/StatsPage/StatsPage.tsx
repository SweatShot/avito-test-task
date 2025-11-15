import { useNavigate } from "react-router-dom"
import { useMemo, useState } from "react"
import { Button, Row, Col, Radio } from "antd"
import { useStats } from "../../hooks/useStats"
import { StatsCards } from "./components/StatsCards"
import { ActivityChart } from "./components/ActivityChart"
import { PieChartComponent } from "./components/PieChartComponent"
import { ExportButtons } from "./components/ExportButtons"
import { ActivityItem } from "./types/stats"

export default function StatsPage() {
  const navigate = useNavigate()
  const { summary, activityData, decisionsData, categoriesData, formattedAverageTime } = useStats()

  const [period, setPeriod] = useState<"today" | "week" | "month">("today")

  // Преобразуем activityData в формат для ExportButtons
  const activityDataForExport: ActivityItem[] = useMemo(() => {
    const map: Record<string, ActivityItem> = {}

    activityData.forEach(item => {
      if (!map[item.date]) {
        map[item.date] = { date: item.date, Одобрено: 0, Отклонено: 0, "На доработку": 0 }
      }
      if (item.type === "Одобрено") map[item.date].Одобрено += item.value
      if (item.type === "Отклонено") map[item.date].Отклонено += item.value
      if (item.type === "На доработку") map[item.date]["На доработку"] += item.value
    })

    return Object.values(map)
  }, [activityData])

  // Фильтруем данные по выбранному периоду
  const activityDataFiltered = useMemo(() => {
    const now = new Date()
    let startDate: Date

    if (period === "today") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate()) // начало сегодняшнего дня
    } else if (period === "week") {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 6)
    } else {
      startDate = new Date(now.getFullYear(), now.getMonth(), now.getDate() - 29)
    }

    return activityDataForExport.filter(item => {
      const itemDate = new Date(item.date)
      return itemDate >= startDate
    })
  }, [activityDataForExport, period])

  return (
    <div style={{ padding: 20 }}>
      <Button type="default" onClick={() => navigate("/list")}>
        ← Назад к списку
      </Button>

      <h1 style={{ marginTop: 20, textAlign: "center" }}>Статистика модератора</h1>

      {/* Переключатель периода */}
      <div style={{ textAlign: "center", margin: "20px 0" }}>
        <Radio.Group value={period} onChange={e => setPeriod(e.target.value)}>
          <Radio.Button value="today">Сегодня</Radio.Button>
          <Radio.Button value="week">Последние 7 дней</Radio.Button>
          <Radio.Button value="month">Последние 30 дней</Radio.Button>
        </Radio.Group>
      </div>

      {/* Кнопки экспорта */}
      <div style={{ display: "flex", justifyContent: "center", marginBottom: 20 }}>
        <ExportButtons
          summary={{
            today: { totalReviewed: summary.today?.totalReviewed ?? 0 },
            week: { totalReviewed: summary.week?.totalReviewed ?? 0 },
            month: { totalReviewed: summary.month?.totalReviewed ?? 0 },
          }}
          activityData={activityDataFiltered}
          decisionsData={decisionsData}
          categoriesData={categoriesData}
        />
      </div>

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
          <ActivityChart data={activityDataFiltered} />
        </Col>
      </Row>

      <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
        <Col xs={24} md={12}>
          <PieChartComponent title="Распределение решений, %" data={decisionsData} />
        </Col>
        <Col xs={24} md={12}>
          <PieChartComponent title="Распределение по категориям" data={categoriesData} showPercentage={false} />
        </Col>
      </Row>
    </div>
  )
}
