// в PDF решил отказаться от кириллицы

import React from "react";
import { Button } from "antd";
import jsPDF from "jspdf";
import { ActivityItem, PieItem } from "../types/stats";

interface ExportButtonsProps {
  summary: Record<"today" | "week" | "month", { totalReviewed: number }>;
  activityData: ActivityItem[];
  decisionsData: PieItem[];
  categoriesData: PieItem[];
}

export const ExportButtons: React.FC<ExportButtonsProps> = ({
  summary,
  activityData,
  decisionsData,
  categoriesData,
}) => {
  const exportToCSV = () => {
    let csv = "Section,Metric,Value\n";

    Object.entries(summary).forEach(([period, stats]) => {
      csv += `Total Reviewed,${period},${stats.totalReviewed}\n`;
    });

    decisionsData.forEach(d => {
      csv += `Decisions,${d.type},${d.value}\n`;
    });

    categoriesData.forEach(c => {
      csv += `Categories,${c.type},${c.value}\n`;
    });

    activityData.forEach(item => {
      csv += `Activity,${item.date}-Approved,${item.Одобрено}\n`;
      csv += `Activity,${item.date}-Rejected,${item.Отклонено}\n`;
      csv += `Activity,${item.date}-Needs Revision,${item["На доработку"]}\n`;
    });

    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `stats_export_${new Date().toISOString()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportToPDF = () => {
    const doc = new jsPDF();

    let y = 20;
    doc.setFontSize(16);
    doc.text("Moderator Statistics", 10, y);

    y += 10;
    doc.setFontSize(12);
    doc.text("Total Reviewed:", 10, y);
    y += 8;
    Object.entries(summary).forEach(([period, stats]) => {
      doc.text(`${period}: ${stats.totalReviewed}`, 20, y);
      y += 8;
    });

    const decisionMap: Record<string, string> = {
      "Одобрено": "Approved",
      "Отклонено": "Rejected",
      "На доработку": "Needs Revision",
    };

    y += 5;
    doc.text("Decisions:", 10, y);
    y += 8;
    decisionsData.forEach(d => {
      const enType = decisionMap[d.type] || d.type;
      doc.text(`${enType}: ${d.value}`, 20, y);
      y += 8;
    });

    const categoriesMap: Record<string, string> = {
      "Детское": "Kids",
      "Животные": "Animals",
      "Мода": "Fashion",
      "Недвижимость": "Real Estate",
      "Работа": "Jobs",
      "Транспорт": "Transport",
      "Услуги": "Services",
      "Электроника": "Electronics",
    };

    y += 5;
    doc.text("Categories:", 10, y);
    y += 8;
    categoriesData.forEach(c => {
      const enType = categoriesMap[c.type] || c.type;
      doc.text(`${enType}: ${c.value}`, 20, y);
      y += 8;
    });

    y += 5;
    doc.text("Daily Activity:", 10, y);
    y += 8;
    activityData.forEach(item => {
      doc.text(`${item.date} - Approved: ${item.Одобрено}`, 20, y);
      y += 6;
      doc.text(`${item.date} - Rejected: ${item.Отклонено}`, 20, y);
      y += 6;
      doc.text(`${item.date} - Needs Revision: ${item["На доработку"]}`, 20, y);
      y += 6;
    });

    doc.save(`stats_export_${new Date().toISOString()}.pdf`);
  };

  return (
    <div style={{ marginBottom: 20, textAlign: "center" }}>
      <Button type="primary" onClick={exportToCSV}>
        Экспорт в CSV
      </Button>
      <Button type="default" onClick={exportToPDF} style={{ marginLeft: 10 }}>
        Генерация PDF
      </Button>
    </div>
  );
};
