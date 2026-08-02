"use client";

import { useState } from "react";
import {
  Card,
  Table,
  Button,
  Modal,
  Form,
  Input,
  Select,
  Typography,
  Space,
  Popconfirm,
  App,
} from "antd";
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  ArrowLeftOutlined,
} from "@ant-design/icons";
import { useRouter } from "next/navigation";
import { createUser, updateUser, deleteUser } from "@/app/admin/actions";
import { roleLabels } from "@/lib/roles";

const { Title } = Typography;

type User = {
  id: number;
  login: string;
  role: string;
};

const roleColors: Record<string, string> = {
  SUPERADMIN: "red",
  ADMIN: "blue",
  EDITOR: "green",
};

export default function UsersClient({ users }: { users: User[] }) {
  const router = useRouter();
  const [modalOpen, setModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(false);
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const openCreateModal = () => {
    setEditingUser(null);
    form.resetFields();
    setModalOpen(true);
  };

  const openEditModal = (user: User) => {
    setEditingUser(user);
    form.setFieldsValue({
      login: user.login,
      role: user.role,
      password: "",
    });
    setModalOpen(true);
  };

  const handleSubmit = async () => {
    try {
      const values = await form.validateFields();
      setLoading(true);

      const formData = new FormData();
      formData.append("login", values.login);
      formData.append("role", values.role);

      if (editingUser) {
        formData.append("id", editingUser.id.toString());
        if (values.password) {
          formData.append("password", values.password);
        }
        await updateUser(formData);
        message.success("Пользователь обновлён");
      } else {
        formData.append("password", values.password);
        await createUser(formData);
        message.success("Пользователь создан");
      }

      setModalOpen(false);
      form.resetFields();
      router.refresh();
    } catch (e: unknown) {
      if (e instanceof Error) {
        message.error(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (user: User) => {
    try {
      setLoading(true);
      const formData = new FormData();
      formData.append("id", user.id.toString());
      await deleteUser(formData);
      message.success("Пользователь удалён");
      router.refresh();
    } catch (e: unknown) {
      if (e instanceof Error) {
        message.error(e.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 80,
    },
    {
      title: "Логин",
      dataIndex: "login",
      key: "login",
    },
    {
      title: "Роль",
      dataIndex: "role",
      key: "role",
      render: (role: string) => (
        <span
          style={{
            color: roleColors[role] || "default",
            fontWeight: 500,
          }}
        >
          {roleLabels[role] || role}
        </span>
      ),
    },
    {
      title: "Действия",
      key: "actions",
      width: 160,
      render: (_: unknown, record: User) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => openEditModal(record)}
          >
            Редактировать
          </Button>
          {record.role !== "SUPERADMIN" && (
            <Popconfirm
              title="Удалить пользователя?"
              description="Это действие нельзя отменить"
              onConfirm={() => handleDelete(record)}
              okText="Удалить"
              cancelText="Отмена"
              okButtonProps={{ danger: true }}
            >
              <Button type="link" danger icon={<DeleteOutlined />}>
                Удалить
              </Button>
            </Popconfirm>
          )}
        </Space>
      ),
    },
  ];

  return (
    <>
      <div className="mb-4 flex items-center justify-between">
        <Space>
          <Button
            type="text"
            icon={<ArrowLeftOutlined />}
            onClick={() => router.push("/admin")}
          />
          <Title level={3} style={{ margin: 0 }}>
            Управление пользователями
          </Title>
        </Space>
        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={openCreateModal}
        >
          Добавить пользователя
        </Button>
      </div>

      <Card>
        <Table
          dataSource={users}
          columns={columns}
          rowKey="id"
          pagination={false}
        />
      </Card>

      <Modal
        title={
          editingUser ? "Редактировать пользователя" : "Добавить пользователя"
        }
        open={modalOpen}
        onOk={handleSubmit}
        onCancel={() => {
          setModalOpen(false);
          form.resetFields();
        }}
        confirmLoading={loading}
        okText={editingUser ? "Сохранить" : "Создать"}
        cancelText="Отмена"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            label="Логин"
            name="login"
            rules={[
              { required: true, message: "Введите логин" },
              { min: 3, message: "Минимум 3 символа" },
            ]}
          >
            <Input />
          </Form.Item>

          <Form.Item
            label="Пароль"
            name="password"
            rules={
              editingUser
                ? []
                : [
                    { required: true, message: "Введите пароль" },
                    { min: 4, message: "Минимум 4 символа" },
                  ]
            }
          >
            <Input.Password
              placeholder={
                editingUser
                  ? "Оставьте пустым, чтобы не менять"
                  : "Введите пароль"
              }
            />
          </Form.Item>

          <Form.Item
            label="Роль"
            name="role"
            initialValue="EDITOR"
            rules={[{ required: true, message: "Выберите роль" }]}
          >
            <Select
              options={[
                { value: "EDITOR", label: "Редактор" },
                { value: "ADMIN", label: "Администратор" },
                //{ value: "SUPERADMIN", label: "Главный администратор" },
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
