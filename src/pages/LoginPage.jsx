import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Card } from "antd";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/abbe-sublett-nxZDMUQhN4o-unsplash.jpg";

const { Title } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const credentials = {
    admin: { username: "admin@hone.com", password: "admin123", role: "ADMIN" },
    employee: { username: "employee@hone.com", password: "emp123", role: "EMPLOYEE" },
  };

  const onFinish = ({ username, password }) => {
    setLoading(true);
    setTimeout(() => {
      if (
        username === credentials.admin.username &&
        password === credentials.admin.password
      ) {
        localStorage.setItem("user", JSON.stringify(credentials.admin));
        message.success("Welcome Admin!");
        navigate("/manager");
      } else if (
        username === credentials.employee.username &&
        password === credentials.employee.password
      ) {
        localStorage.setItem("user", JSON.stringify(credentials.employee));
        message.success("Welcome Employee!");
        navigate("/leave-request");
      } else {
        message.error("Invalid username or password");
      }
      setLoading(false);
    }, 700);
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Card
        style={{
          width: 400,
          padding: "30px",
          textAlign: "center",
          backgroundColor: "rgba(255,255,255,0.2)",
          backdropFilter: "blur(8px)",
          borderRadius: "12px",
          color: "#fff",
        }}
      >
        <Title level={3} style={{ color: "#fff" }}>
          H One Leave Tracker Login
        </Title>

        <Form layout="vertical" onFinish={onFinish}>
          <Form.Item
            label={<span style={{ color: "white" }}>Email</span>}
            name="username"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input placeholder="Email" />
          </Form.Item>

          <Form.Item
            label={<span style={{ color: "white" }}>Password</span>}
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password placeholder="Password" />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{ width: "100%", fontWeight: "bold" }}
          >
            Login
          </Button>

          <div style={{ marginTop: "20px", color: "#fff", fontSize: "0.9rem" }}>
            <p>Admin → <b>admin@hone.com / admin123</b></p>
            <p>Employee → <b>employee@hone.com / emp123</b></p>
          </div>
        </Form>
      </Card>
    </div>
  );
};

export default LoginPage;
