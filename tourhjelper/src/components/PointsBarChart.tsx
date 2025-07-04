import { BarChart } from "@mantine/charts";
import { useEffect, useState } from "react";
import styles from "@/styles/BarChart/PointsBarChart.module.css";

const PointsBarChart = () => {
  const [data, setData] = useState<any[]>([]);

  const fetchData = async () => {
    try {
      const response = await fetch("/data/stage_points_data.json");
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      console.error("Error fetching data:", error);
      return [];
    }
  };

  useEffect(() => {
    fetchData().then(setData);
  }, []);

  return (
    <div className={styles.barChartContainer}>
      <div className={styles.header}>
        <h4>Basis poeng per etappe</h4>
      </div>
      <BarChart
        data={data}
        dataKey="etappe"
        series={[{ name: "Poeng", color: "red.7" }]}
        h={400}
        barProps={{ radius: 20 }}
        gridAxis="none"
        unit="p."
        maxBarWidth={22}
        className={styles.barChart}
      />
    </div>
  );
};

export default PointsBarChart;
