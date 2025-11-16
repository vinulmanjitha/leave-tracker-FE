import React, { useState, useEffect } from "react";
import { Table, Button, Typography, message, Spin, Tag } from "antd";
import { getAllLeaves, updateLeaveStatus } from "../services/managerService";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/abbe-sublett-nxZDMUQhN4o-unsplash.jpg";


const { Title } = Typography;

const ManagerPage = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);

  const navigate = useNavigate();

  const fetchLeaves = async () => {
    try {
      setLoading(true);
      const res = await getAllLeaves();
      setData(res.data || []);
    } catch (error) {
      console.error("Failed to fetch leaves:", error);
      message.error("Failed to fetch leave requests");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLeaves();
  }, []);

  const handleApprove = async (record) => {
    try {
      setLoading(true);
      await updateLeaveStatus(record.id, "APPROVED");
      toast.success(`${record.employeeName}'s leave approved`, {
        position: "top-center",
        autoClose: 2000,
      });
      fetchLeaves();
    } catch (error) {
      console.error("Approval failed:", error);
      toast.error(`Failed to approve ${record.employeeName}'s leave`, {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (record) => {
    try {
      setLoading(true);
      await updateLeaveStatus(record.id, "REJECTED");
      toast.error(`${record.employeeName}'s leave rejected`, {
        position: "top-center",
        autoClose: 2000,
      });
      fetchLeaves();
    } catch (error) {
      console.error("Rejection failed:", error);
      toast.error(`Failed to reject ${record.employeeName}'s leave`, {
        position: "top-center",
        autoClose: 2000,
      });
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { title: "Employee", dataIndex: "employeeName", key: "employeeName" },
    { title: "Employee ID", dataIndex: "employeeId", key: "employeeId" },
    { title: "Type", dataIndex: "leaveType", key: "leaveType" },
    { title: "Start Date", dataIndex: "startDate", key: "startDate" },
    { title: "End Date", dataIndex: "endDate", key: "endDate" },
    { title: "Reason", dataIndex: "reason", key: "reason" },
    { title: "Authorized By", dataIndex: "approvedBy", key: "approvedBy" },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status) => {
        let color =
          status === "APPROVED"
            ? "green"
            : status === "REJECTED"
            ? "red"
            : "gold";
        return <Tag color={color}>{status}</Tag>;
      },
    },
    {
      title: "Action",
      key: "action",
      render: (_, record) => (
        <div style={{ display: "flex", gap: "8px" }}>
          <Button
            type="primary"
            onClick={() => handleApprove(record)}
            disabled={record.status === "APPROVED"}
          >
            Approve
          </Button>
          <Button
            danger
            onClick={() => handleReject(record)}
            disabled={record.status === "REJECTED"}
          >
            Reject
          </Button>
        </div>
      ),
    },
  ];

  return (
    <div
      style={{
        minHeight: "80vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        padding: "20px",
      }}
    >
      <div
        style={{
          backgroundColor: "rgba(255, 255, 255, 0.2)",
          backdropFilter: "blur(5px)",
          padding: "30px",
          borderRadius: "12px",
          width: "100%",
          maxWidth: "1500px",
        }}
      >
        <Title level={3} style={{ textAlign: "center", color: "#fff" }}>
          Employee Leaves
        </Title>

        <div style={{ marginBottom: "20px" }}>
          <Button onClick={() => navigate("/login")} type="default">
            ←
          </Button>
        </div>

        <ToastContainer />

        {loading ? (
          <div style={{ textAlign: "center", marginTop: "40px" }}>
            <Spin size="large" />
          </div>
        ) : (
          <Table
            columns={columns}
            dataSource={data}
            rowKey="id"
            pagination={{
              current: currentPage,
              pageSize: pageSize,
              total: data.length,
              showSizeChanger: true,
              pageSizeOptions: ["5", "10", "20", "50"],
              showTotal: (total, range) =>
                `${range[0]}-${range[1]} of ${total} leaves`,
              onChange: (page, pageSize) => {
                setCurrentPage(page);
                setPageSize(pageSize);
              },
            }}
            style={{ marginTop: "20px" }}
            bordered
          />
        )}
      </div>
    </div>
  );
};

export default ManagerPage;
