import { Card, Row, Col, Spin, Button } from "antd"
import { Column, Pie } from "@ant-design/charts"
import { useStats } from "../../hooks/useStats" 
import { useNavigate } from "react-router-dom"

export default function StatsPage() {
  const navigate = useNavigate()
  const {
    summary,
    activityData,
    decisionsData,
    categoriesData,
    formattedAverageTime,
    loading,
  } = useStats()

  if (loading) {
    return <Spin size="large" style={{ margin: 50 }} />
  }

  return (
    <div style={{ padding: 20 }}>
      {/* Кнопка Назад */}
      <Button type="default" onClick={() => navigate("/list")}>
        ← Назад к списку
      </Button>

      <h1 style={{ marginTop: 20 }}>Статистика модератора</h1>

      {/* Карточки с метриками */}
      <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
        <Col span={6}>
          <Card title="Всего проверено">
            <p>Сегодня: {summary.today?.totalReviewed ?? 0}</p>
            <p>Неделя: {summary.week?.totalReviewed ?? 0}</p>
            <p>Месяц: {summary.month?.totalReviewed ?? 0}</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Процент одобренных">
            {summary.today?.approvedPercentage?.toFixed(2) ?? 0}%
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Процент отклоненных">
            {summary.today?.rejectedPercentage?.toFixed(2) ?? 0}%
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Среднее время проверки">{formattedAverageTime}</Card>
        </Col>
      </Row>

      {/* Графики */}
      <Row gutter={[20, 20]} style={{ marginTop: 40 }}>
        <Col span={12}>
          <Card title="Активность по дням">
            <Column
              data={activityData}
              isStack
              xField="date"
              yField="value"
              seriesField="type"
              columnWidthRatio={0.6}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Распределение решений">
            <Pie
              data={decisionsData}
              angleField="value"
              colorField="type"
              radius={0.8}
              label={{
                type: "spider",
                labelHeight: 28,
                content: (item: { type: string; value: number }) =>
                  `${item.type}: ${item.value}`,
              }}
            />
          </Card>
        </Col>

        <Col span={6}>
          <Card title="Распределение по категориям">
            <Pie
              data={categoriesData}
              angleField="value"
              colorField="type"
              radius={0.8}
              label={{
                type: "spider",
                labelHeight: 28,
                content: (item: { type: string; value: number }) =>
                  `${item.type}: ${item.value}`,
              }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  )
}
