import React, { useState } from "react";
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
import { createLeaveRequest } from "../services/leaveService";
import { useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import backgroundImage from "../assets/abbe-sublett-nxZDMUQhN4o-unsplash.jpg";

const { Title } = Typography;
const { RangePicker } = DatePicker;
const { Option } = Select;

const LeaveRequestPage = () => {
    const [form] = Form.useForm();
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const checkHolidays = async (startDate, endDate) => {
        try {
            setLoading(true);
            const year = startDate.year();
            const res = await fetch(`https://date.nager.at/api/v3/PublicHolidays/${year}/US`);
            if (!res.ok) throw new Error("Failed to fetch holiday data");

            const holidays = await res.json();
            const globalHolidays = holidays.filter(h => h.global);
            const holidayDates = globalHolidays.map(h => h.date);
            const holidayNames = {};
            globalHolidays.forEach(h => (holidayNames[h.date] = h.localName || h.name));

            let conflicts = [];
            let current = dayjs(startDate);
            const end = dayjs(endDate);

            while (current.isBefore(end) || current.isSame(end, "day")) {
                const dateStr = current.format("YYYY-MM-DD");
                if (holidayDates.includes(dateStr)) {
                    conflicts.push(`${dateStr} (${holidayNames[dateStr]})`);
                }
                current = current.add(1, "day");
            }

            setLoading(false);
            return conflicts;
        } catch (error) {
            console.error("Error checking holidays:", error);
            setLoading(false);
            toast.error("⚠️ Failed to validate holidays. Please try again.");
            return [];
        }
    };

    const onFinish = async (values) => {
        const [start, end] = values.dateRange;

        const holidayConflicts = await checkHolidays(start, end);
        if (holidayConflicts.length > 0) {
            toast.warning(
                `Your leave overlaps with the following holiday(s):\n- ${holidayConflicts.join(
                    "\n- "
                )}`,
                { autoClose: 5000, position: "top-center" }
            );
            return; 
        }

        const leaveData = {
            employeeName: values.employeeName,
            leaveType: values.leaveType,
            startDate: start.format("YYYY-MM-DD"),
            endDate: end.format("YYYY-MM-DD"),
            reason: values.reason,
            status: "PENDING",
        };

        try {
            setLoading(true);
            const res = await createLeaveRequest(leaveData);
            console.log("Response from backend:", res);
            toast.success("Leave request submitted successfully!", {
                position: "top-center",
                autoClose: 2000,
            });
            form.resetFields();
            setTimeout(() => navigate("/"), 2500);
        } catch (error) {
            console.error("Submission failed:", error);
            toast.error("Failed to submit leave request", {
                position: "top-center",
            });
        } finally {
            setLoading(false);
        }
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
            }}
        >
            <ToastContainer />
            <div
                style={{
                    backgroundColor: "rgba(255, 255, 255, 0.2)",
                    backdropFilter: "blur(6px)",
                    padding: "40px",
                    borderRadius: "12px",
                    width: "100%",
                    maxWidth: "500px",
                    boxShadow: "0 4px 15px rgba(0,0,0,0.2)",
                }}
            >
                <Title level={3} style={{ textAlign: "center", color: "#fff" }}>
                    Submit Leave Request
                </Title>

                <Form form={form} layout="vertical" onFinish={onFinish} requiredMark={true}>
                    <Form.Item
                        label="Employee Name"
                        name="employeeName"
                        rules={[{ required: true, message: "Please enter your name" }]}
                    >
                        <Input placeholder="Employee Name" />
                    </Form.Item>

                    <Form.Item
                        label="Leave Type"
                        name="leaveType"
                        rules={[{ required: true, message: "Please select leave type" }]}
                    >
                        <Select placeholder="Select leave type">
                            <Option value="annual">Annual Leave</Option>
                            <Option value="sick">Sick Leave</Option>
                            <Option value="casual">Casual Leave</Option>
                        </Select>
                    </Form.Item>

                    <Form.Item
                        label="Leave Dates"
                        name="dateRange"
                        rules={[{ required: true, message: "Please select date range" }]}
                    >
                        <RangePicker />
                    </Form.Item>

                    <Form.Item
                        label="Reason"
                        name="reason"
                        rules={[{ required: true, message: "Please enter reason for leave" }]}
                    >
                        <Input.TextArea rows={3} placeholder="Reason for leave..." />
                    </Form.Item>

                    <Form.Item>
                        <div style={{ display: "flex", gap: "10px" }}>
                            <Button
                                type="default"
                                onClick={() => navigate("/")}
                                style={{
                                    flex: 1,
                                    fontWeight: "bold",
                                    backgroundColor: "rgba(255,255,255,0.3)",
                                    border: "1px solid #fff",
                                    color: "#fff",
                                }}
                            >
                                 Back
                            </Button>

                            <Button
                                type="primary"
                                htmlType="submit"
                                disabled={loading}
                                style={{ flex: 1, fontWeight: "bold" }}
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
