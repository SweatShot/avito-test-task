import { Card, Row, Col } from "antd"

interface StatsCardsProps {
  totalReviewed: { today: number; week: number; month: number };
  decisionsData: { type: string; value: number }[];
  averageTime: string;
}

export function StatsCards({ totalReviewed, decisionsData, averageTime }: StatsCardsProps) {
  const approved = decisionsData.find(d => d.type === "Одобрено")?.value ?? 0;
  const rejected = decisionsData.find(d => d.type === "Отклонено")?.value ?? 0;
  const changes = decisionsData.find(d => d.type === "На доработку")?.value ?? 0;

  return (
    <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
      <Col span={6}>
        <Card className="statsCard" title={<div className="statsCardTitle">Всего проверено</div>}>
          <div className="statsCardSmall">Сегодня: {totalReviewed.today}</div>
          <div className="statsCardSmall">Неделя: {totalReviewed.week}</div>
          <div className="statsCardSmall">Месяц: {totalReviewed.month}</div>
        </Card>
      </Col>

      <Col span={6}>
        <Card className="statsCard" title={<div className="statsCardTitle">Процент одобренных</div>}>
          <div className="statsCardValue">{approved.toFixed(2)}%</div>
        </Card>
      </Col>

      <Col span={6}>
        <Card className="statsCard" title={<div className="statsCardTitle">Процент отклоненных</div>}>
          <div className="statsCardValue">{rejected.toFixed(2)}%</div>
        </Card>
      </Col>

      <Col span={6}>
        <Card className="statsCard" title={<div className="statsCardTitle">На доработку</div>}>
          <div className="statsCardValue">{changes.toFixed(2)}%</div>
        </Card>
      </Col>

      <Col span={6}>
        <Card className="statsCard" title={<div className="statsCardTitle">Среднее время проверки</div>}>
          <div className="statsCardValue">{averageTime}</div>
        </Card>
      </Col>
    </Row>
  );
}
