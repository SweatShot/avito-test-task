import { Card, Row, Col, Spin, Button } from "antd";
import { Column, Pie } from "@ant-design/charts";
import {
  useGetSummaryStatsQuery,
  useGetActivityChartQuery,
  useGetDecisionsChartQuery,
  useGetCategoriesChartQuery,
} from "../../app/shared/api/statsApi";
import { useMemo } from "react";
import { Link } from "react-router-dom";

export default function StatsPage() {
  const { data: summary, isLoading: loadingSummary } = useGetSummaryStatsQuery();
  const { data: activity, isLoading: loadingActivity } = useGetActivityChartQuery();
  const { data: decisions, isLoading: loadingDecisions } = useGetDecisionsChartQuery();
  const { data: categories, isLoading: loadingCategories } = useGetCategoriesChartQuery();

  const activityData = useMemo(() => {
    if (!activity) return [];
    return activity.flatMap(day => [
      { date: day.date, type: "Одобрено", value: day.approved },
      { date: day.date, type: "Отклонено", value: day.rejected },
      { date: day.date, type: "На доработку", value: day.requestChanges },
    ]);
  }, [activity]);

  const decisionsData = useMemo(() => {
    if (!decisions) return [];
    return [
      { type: "Одобрено", value: decisions.approved },
      { type: "Отклонено", value: decisions.rejected },
      { type: "На доработку", value: decisions.requestChanges },
    ];
  }, [decisions]);

  const categoriesData = useMemo(() => {
    if (!categories) return [];
    return Object.entries(categories).map(([name, value]) => ({ type: name, value }));
  }, [categories]);

  if (loadingSummary || loadingActivity || loadingDecisions || loadingCategories) {
    return <Spin size="large" style={{ margin: 50 }} />;
  }

  if (!summary) {
    return <p>Ошибка при загрузке данных</p>;
  }

  return (
    <div style={{ padding: 20 }}>
      <div style={{ marginBottom: 20 }}>
        <Link to="/">
          <Button type="primary">← Назад к списку объявлений</Button>
        </Link>
      </div>

      <h1>Статистика модератора</h1>

      <Row gutter={[20, 20]} style={{ marginTop: 20 }}>
        <Col span={6}>
          <Card title="Всего проверено">
            <p>Сегодня: {summary.totalReviewedToday}</p>
            <p>Неделя: {summary.totalReviewedThisWeek}</p>
            <p>Месяц: {summary.totalReviewedThisMonth}</p>
          </Card>
        </Col>
        <Col span={6}>
          <Card title="Процент одобренных">{summary.approvedPercentage.toFixed(2)}%</Card>
        </Col>
        <Col span={6}>
          <Card title="Процент отклоненных">{summary.rejectedPercentage.toFixed(2)}%</Card>
        </Col>
        <Col span={6}>
          <Card title="Среднее время проверки">{summary.averageReviewTime.toFixed(2)} мин</Card>
        </Col>
      </Row>

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
              label={{ type: "spider", labelHeight: 28 }}
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
              label={{ type: "spider", labelHeight: 28 }}
            />
          </Card>
        </Col>
      </Row>
    </div>
  );
}
