import React from "react";
import { Layout, Typography, Button, Space } from "antd";
import { UserAddOutlined, TeamOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import backgroundImage from "../assets/abbe-sublett-nxZDMUQhN4o-unsplash.jpg";

const { Header, Content, Footer } = Layout;
const { Title, Paragraph } = Typography;

const Home = () => {
  const navigate = useNavigate();

  return (
    <Layout
      style={{
        minHeight: "100vh",
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: "cover",
        backgroundPosition: "center",
      }}
    >
      <Header
        style={{
          background: "rgba(0,0,0,0.5)",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Title level={2} style={{ color: "white", margin: 0 }}>
          H One Leave Tracker
        </Title>
      </Header>

      <Content
        style={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
          textAlign: "center",
          flex: 1,
          backdropFilter: "blur(0.3px)",

          backgroundColor: "rgba(255, 255, 255, 0.2)",
          padding: "20px",
        }}
      >
        <Paragraph style={{ fontSize: "1.2rem", color: "#fff", maxWidth: 600 }}>
           Leave management and holiday validation for employees of H One
        </Paragraph>

        <Space size="large" style={{ marginTop: "20px" }}>
          <Button
            type="primary"
            size="large"
            shape="round"
            icon={<UserAddOutlined />}
            onClick={() => navigate("/leave-request")}
          >
            Submit Leave Request
          </Button>

          <Button
            type="default"
            size="large"
            shape="round"
            icon={<TeamOutlined />}
            onClick={() => navigate("/manager")}
          >
            Manager Dashboard
          </Button>
        </Space>
      </Content>

      <Footer style={{ textAlign: "center", background: "rgba(0,0,0,0.5)", color: "white" }}>
        © {new Date().getFullYear()} H One Leave Management Prototype
      </Footer>
    </Layout>
  );
};

export default Home;
