"use client";

import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { Button, Form, Input, Card, Typography, message } from "antd";

const { Title } = Typography;

export default function LoginPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [messageApi, contextHolder] = message.useMessage();

  const onFinish = async (values: { login: string; password: string }) => {
    setLoading(true);
    try {
      const result = await signIn("credentials", {
        login: values.login,
        password: values.password,
        redirect: false,
      });

      if (result?.error) {
        messageApi.error("Неверный email или пароль");
      } else {
        router.push("/");
        router.refresh();
      }
    } catch {
      messageApi.error("Произошла ошибка при входе");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-[60vh]">
      {contextHolder}
      <Card style={{ width: 400 }}>
        <Title level={3} style={{ textAlign: "center", marginBottom: 24 }}>
          Вход в систему
        </Title>
        <Form
          name="login"
          layout="vertical"
          onFinish={onFinish}
          autoComplete="off"
        >
          <Form.Item
            label="Логин"
            name="login"
            rules={[{ required: true, message: "Введите логин" }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={[{ required: true, message: "Введите пароль" }]}
          >
            <Input.Password />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Войти
            </Button>
          </Form.Item>
        </Form>
      </Card>
    </div>
  );
}
