import React, { useState, useEffect } from "react";
import {
  Form,
  Input,
  Button,
  DatePicker,
  Select,
  Typography,
  Spin,
} from "antd";
import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import { createLeaveRequest } from "../services/leaveService";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "../assets/abbe-sublett-nxZDMUQhN4o-unsplash.jpg";

dayjs.extend(utc);

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;
const holidayCache = {};

const fetchHolidayData = async (year) => {
  if (holidayCache[year]) {
    return holidayCache[year];
  }
  const res = await fetch(
    `https://date.nager.at/api/v3/PublicHolidays/${year}/US`
  );
  if (!res.ok) throw new Error("Holiday fetch failed");
  const data = await res.json();

  holidayCache[year] = data.map((h) => ({
    date: dayjs(h.date).format("YYYY-MM-DD"),
    name: h.localName || h.name,
    global: h.global,
  }));

  return holidayCache[year];
};

const LeaveRequestPage = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const checkHolidays = async (startDate, endDate) => {
    try {
      setLoading(true);

      const startYear = startDate.year();
      const endYear = endDate.year();

      const yearsToFetch = new Set([startYear, endYear]);

      let allHolidays = [];
      for (const year of yearsToFetch) {
        const yearData = await fetchHolidayData(year);
        allHolidays.push(...yearData.filter((h) => h.global));
      }

      const holidayDates = allHolidays.map((h) => h.date);
      const holidayNames = {};
      allHolidays.forEach((h) => (holidayNames[h.date] = h.name));

      let conflicts = [];
      let current = dayjs(startDate);

      while (current.isBefore(endDate) || current.isSame(endDate, "day")) {
        const dateStr = current.format("YYYY-MM-DD");
        if (holidayDates.includes(dateStr)) {
          conflicts.push(`${dateStr} (${holidayNames[dateStr]})`);
        }
        current = current.add(1, "day");
      }

      setLoading(false);
      return conflicts;
    } catch (err) {
      console.error(err);
      toast.error("Failed to validate holidays. Try again.");
      setLoading(false);
      return [];
    }
  };

  const onFinish = async (values) => {
    const [start, end] = values.dateRange;

    const holidayConflicts = await checkHolidays(start, end);
    if (holidayConflicts.length > 0) {
      toast.warning(
        `Your leave overlaps with:\n- ${holidayConflicts.join("\n- ")}`,
        { autoClose: 5000, position: "top-center" }
      );
      return;
    }

    const leaveData = {
      employeeId: values.employeeId,
      employeeName: values.employeeName,
      leaveType: values.leaveType,
      startDate: start.format("YYYY-MM-DD"),
      endDate: end.format("YYYY-MM-DD"),
      reason: values.reason,
      totalDays: values.totalDays,
      status: "PENDING",
    };

    try {
      setLoading(true);
      await createLeaveRequest(leaveData);

      toast.success("Leave request submitted!", {
        position: "top-center",
        autoClose: 2000,
      });

      form.resetFields();
      setTimeout(() => navigate("/login"), 2500);
    } catch (error) {
      console.error(error);
      toast.error("Submission failed.");
    } finally {
      setLoading(false);
    }
  };

  const LeaveDatePicker = ({ form }) => {
    const [daysCount, setDaysCount] = useState(0);
    const [holidayDots, setHolidayDots] = useState([]);

    useEffect(() => {
      const loadCurrentYear = async () => {
        const data = await fetchHolidayData(dayjs().year());
        setHolidayDots(data.map((h) => h.date));
      };
      loadCurrentYear();
    }, []);

    const countWorkingDays = (start, end) => {
      let count = 0;
      let current = dayjs(start);
      while (current.isBefore(end) || current.isSame(end, "day")) {
        const weekday = current.day();
        if (weekday !== 0 && weekday !== 6) count++;
        current = current.add(1, "day");
      }
      return count;
    };

const handleDateChange = (dates) => {
  if (dates && dates[0] && dates[1]) {
    const total = countWorkingDays(dates[0], dates[1]);
    setDaysCount(total);

    form.setFieldsValue({
      dateRange: dates,
      totalDays: total,
    });
  } else {
    setDaysCount(0);

    form.setFieldsValue({
      dateRange: null,
      totalDays: 0,
    });
  }
};


    const renderDateCell = (current) => {
      const isHoliday = holidayDots.includes(current.format("YYYY-MM-DD"));

      return (
        <div
          style={{
            position: "relative",
            borderRadius: "50%",
            width: "100%",
            height: "100%",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <span>{current.date()}</span>

          {isHoliday && (
            <div
              style={{
                position: "absolute",
                bottom: "2px",
                width: "17px",
                height: "17px",
                borderRadius: "50%",
                backgroundColor: "red",
                opacity: 0.4,
              }}
            />
          )}
        </div>
      );
    };

    return (
      <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
        <RangePicker
          style={{
            flex: 1,
            borderRadius: "6px",
            backgroundColor: "rgba(255,255,255,0.9)",
          }}
          onChange={handleDateChange}
          dateRender={renderDateCell}
        />

        {daysCount > 0 && (
          <span
            style={{
              background: "linear-gradient(135deg, #2353bc 0%, #182848 100%)",
              color: "white",
              padding: "6px 12px",
              borderRadius: "20px",
              fontSize: "0.85rem",
              fontWeight: 500,
              boxShadow: "0 1px 4px rgba(0,0,0,0.3)",
              whiteSpace: "nowrap",
            }}
          >
            {daysCount} {daysCount > 1 ? "days" : "day"}
          </span>
        )}
      </div>
    );
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
      }}
    >
      <ToastContainer />

      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(20px)",
          padding: "40px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "500px",
          boxShadow: "0 4px 20px rgba(0,0,0,0.25)",
        }}
      >
        <Title
          level={3}
          style={{
            textAlign: "center",
            color: "#fff",
            marginBottom: "20px",
          }}
        >
          Submit Leave Request
        </Title>

        <Form form={form} layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={<span style={{ color: "#fff" }}>Employee ID</span>}
            name="employeeId"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#fff" }}>Employee Name</span>}
            name="employeeName"
            rules={[{ required: true }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#fff" }}>Leave Type</span>}
            name="leaveType"
            rules={[{ required: true }]}
          >
            <Select>
              <Option value="annual">Annual Leave</Option>
              <Option value="sick">Sick Leave</Option>
              <Option value="casual">Casual Leave</Option>
            </Select>
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#fff" }}>Leave Dates</span>}
            name="dateRange"
            rules={[{ required: true }]}
          >
            <LeaveDatePicker form={form} />
          </Form.Item>

          <Form.Item name="totalDays" noStyle>
            <Input type="hidden" />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "#fff" }}>Reason</span>}
            name="reason"
            rules={[{ required: true }]}
          >
            <Input.TextArea rows={3} />
          </Form.Item>

          <Form.Item>
            <div style={{ display: "flex", gap: "10px" }}>
              <Button
                type="default"
                onClick={() => navigate("/login")}
                style={{ flex: 1 }}
              >
                Back
              </Button>

              <Button
                type="primary"
                htmlType="submit"
                disabled={loading}
                style={{ flex: 1 }}
              >
                {loading ? <Spin size="small" /> : "Submit Request"}
              </Button>
            </div>
          </Form.Item>
        </Form>
      </div>
    </div>
  );
};

export default LeaveRequestPage;
