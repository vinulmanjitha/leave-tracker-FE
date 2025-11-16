import React, { useState } from "react";
import { Form, Input, Button, Typography, message, Card } from "antd";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/abbe-sublett-nxZDMUQhN4o-unsplash.jpg";

const { Title, Text } = Typography;

const LoginPage = () => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const credentials = {
    admin: { username: "admin@123.com", password: "abc@1234", role: "ADMIN" },
    employee: { username: "employee@123.com", password: "abc@1234", role: "EMPLOYEE" },
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
        padding: "20px",
      }}
    >
      <Card
        style={{
          width: 400,
          padding: "40px 35px",
          textAlign: "center",
          background: "rgba(255, 255, 255, 0.15)",
          backdropFilter: "blur(20px)",
          borderRadius: "16px",
          boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
          border: "1px solid rgba(255, 255, 255, 0.2)",
          color: "#fff",
        }}
      >
        <Title
          level={3}
          style={{
            color: "#fff",
            marginBottom: 10,
            letterSpacing: "0.5px",
            fontWeight: 600,
          }}
        >
          Leave Tracker Login
        </Title>
        <Text style={{ color: "rgba(255,255,255,0.8)" }}>
          Sign in with your credentials
        </Text>

        <Form layout="vertical" onFinish={onFinish} style={{ marginTop: 25 }}>
          <Form.Item
            label={
              <span
                style={{
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: "14px",
                  letterSpacing: "0.3px",
                }}
              >
                User Name
              </span>
            }
            name="username"
            rules={[{ required: true, message: "Please enter your email" }]}
          >
            <Input
              placeholder="Enter your email"
              style={{
                borderRadius: "8px",
                height: "40px",
                backgroundColor: "rgba(255,255,255,0.9)",
              }}
            />
          </Form.Item>

          <Form.Item
            label={
              <span
                style={{
                  color: "#fff",
                  fontWeight: 500,
                  fontSize: "14px",
                  letterSpacing: "0.3px",
                }}
              >
                Password
              </span>
            }
            name="password"
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password
              placeholder="Enter your password"
              style={{
                borderRadius: "8px",
                height: "40px",
                backgroundColor: "rgba(255,255,255,0.9)",
              }}
            />
          </Form.Item>

          <Button
            type="primary"
            htmlType="submit"
            loading={loading}
            style={{
              width: "100%",
              height: "45px",
              borderRadius: "8px",
              marginTop: "10px",
              fontWeight: 600,
              background: "#3498db",
              border: "none",
              transition: "all 0.3s ease",
            }}
            onMouseEnter={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(135deg, #5d80d0 0%, #223061 100%)")
            }
            onMouseLeave={(e) =>
              (e.currentTarget.style.background =
                "linear-gradient(135deg, #4b6cb7 0%, #3498db 100%)")
            }
          >
            {loading ? "Logging in..." : "Login"}
          </Button>
        </Form>

        <div style={{ marginTop: 20 }}>
          <Text style={{ color: "rgba(255,255,255,0.7)", fontSize: "13px" }}>
            © {new Date().getFullYear()} Leave Tracker System
          </Text>
        </div>
      </Card>
    </div>
  );
};

export default LoginPage;
