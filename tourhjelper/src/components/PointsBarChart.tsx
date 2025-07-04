import { BarChart } from "@mantine/charts";
import { useEffect, useState } from "react";
import styles from "@/styles/BarChart/PointsBarChart.module.css";

const PointsBarChart = () => {
  const [data, setData] = useState<any[]>([]);
  const [deviceWidth, setDeviceWidth] = useState(0);

  const getBarColor = (value: number) => {
    if (value >= 300) return "cyan.5";
    if (value >= 250) return "green.5";
    if (value >= 180) return "yellow.6";
    if (value >= 150) return "orange.7";
    return "red.7";
  };

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

  useEffect(() => {
    setDeviceWidth(window.innerWidth);

    const handleResize = () => {
      setDeviceWidth(window.innerWidth);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <div className={styles.barChartContainer}>
      <div className={styles.header}>
        <h4>Basis poeng per etappe</h4>
      </div>
      <BarChart
        data={data}
        dataKey="etappe"
        getBarColor={(value) => getBarColor(value)}
        series={[{ name: "Poeng", color: "red.7" }]}
        h={deviceWidth < 600 ? 800 : 400}
        barProps={{ radius: 20 }}
        gridAxis="none"
        withYAxis={deviceWidth < 600 ? true : false}
        unit={deviceWidth < 600 ? "" : "p."}
        maxBarWidth={deviceWidth < 800 ? 12 : 22}
        className={styles.barChart}
        orientation={deviceWidth < 600 ? "vertical" : "horizontal"}
      />
    </div>
  );
};

export default PointsBarChart;
