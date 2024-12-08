import { useState, useEffect, useMemo } from "react";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

import { Bar } from "react-chartjs-2";
import { Box, Grid, TextField, Button } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import dayjs, { Dayjs } from "dayjs";
import instance from "../../../../api"; // Cấu hình Axios instance của bạn

// Đăng ký các thành phần của Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend
);

const options = {
  responsive: true,
  plugins: {
    legend: { position: "top" as const },
    title: { display: true, text: "Doanh thu theo tháng" },
  },
};

interface RevenueByMonthData {
  month: string;
  totalRevenue: number;
}

const RevenueByMonth = () => {
  const [data, setData] = useState<RevenueByMonthData[]>([]);
  const [startDate, setStartDate] = useState<Dayjs | null>(
    dayjs().startOf("year")
  );
  const [endDate, setEndDate] = useState<Dayjs | null>(dayjs().endOf("year"));
  const [error, setError] = useState<string | null>(null);

  // Gọi API để lấy dữ liệu doanh thu
  const fetchRevenueData = async () => {
    setError(null); // Reset lỗi trước khi gọi API
    try {
      if (!startDate || !endDate) {
        throw new Error("Ngày bắt đầu hoặc kết thúc không hợp lệ!");
      }

      const response = await instance.get("/statistics/revenue-by-month", {
        params: {
          start: startDate.toISOString(),
          end: endDate.toISOString(),
        },
      });

      if (response.data && Array.isArray(response.data)) {
        setData(response.data);
      } else {
        throw new Error("Dữ liệu trả về không đúng định dạng!");
      }
    } catch (error: any) {
      console.error("Lỗi khi tải dữ liệu doanh thu:", error.message);
      setError(error.message || "Lỗi không xác định.");
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [startDate, endDate]);

  // Dữ liệu biểu đồ
  const chartData = useMemo(() => {
    if (!data || data.length === 0) {
      return {
        labels: [],
        datasets: [],
      };
    }

    const labels = data.map((item) => item.month); // Tháng
    const revenues = data.map((item) => item.totalRevenue); // Doanh thu

    return {
      labels,
      datasets: [
        {
          label: "Doanh thu (VND)",
          data: revenues,
          backgroundColor: "rgba(53, 162, 235, 0.5)",
        },
      ],
    };
  }, [data]);

  return (
    <Box sx={{ p: 4 }}>
      <h2 style={{ marginLeft: "-30px" }}>Doanh thu theo ngày tháng năm</h2>
      <br />
      <Grid container spacing={2} alignItems="center" justifyContent="center">
        {/* Từ ngày */}
        <Grid item xs={2}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Từ ngày"
              value={startDate}
              onChange={(newValue) => setStartDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>

        {/* Đến ngày */}
        <Grid item xs={3}>
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <DatePicker
              label="Đến ngày"
              value={endDate}
              onChange={(newValue) => setEndDate(newValue)}
              renderInput={(params) => <TextField {...params} fullWidth />}
            />
          </LocalizationProvider>
        </Grid>

        {/* Nút Lọc */}
        <Grid item xs={2} sx={{ display: "none" }}>
          <Button
            variant="contained"
            color="primary"
            fullWidth
            onClick={fetchRevenueData}
          >
            Lọc
          </Button>
        </Grid>
      </Grid>

      {/* Hiển thị lỗi */}
      {error && (
        <Box sx={{ mt: 2, color: "red" }}>
          <p>{error}</p>
        </Box>
      )}

      {/* Hiển thị dữ liệu hoặc thông báo */}
      <Box sx={{ mt: 4 }}>
        {data.length > 0 ? (
          <div className="chart-container">
            <Bar options={options} data={chartData} />
          </div>
        ) : (
          <p>Không có dữ liệu để hiển thị.</p>
        )}
      </Box>
    </Box>
  );
};

export default RevenueByMonth;
