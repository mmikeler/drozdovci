"use client";

import {
  App,
  Button,
  Modal,
  Table,
  TableProps,
  Upload,
  Typography,
} from "antd";
import * as XLSX from "xlsx";
import { useState } from "react";
import { Upload as UploadIcon } from "lucide-react";
import { importParticipants } from "../actions/importParticipants";
import { rankLabels } from "@/lib/ranks";

interface PreviewRow {
  key: number;
  surname: string;
  name: string;
  patronymic: string;
  rank: string;
  division: string;
}

const { Text } = Typography;

export function ImportDialog() {
  const { message } = App.useApp();
  const [open, setOpen] = useState(false);
  const [file, setFile] = useState<File | null>(null);
  const [preview, setPreview] = useState<PreviewRow[]>([]);
  const [importing, setImporting] = useState(false);

  const handleFileSelect = (f: File) => {
    setFile(f);
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer);
        const workbook = XLSX.read(data, { type: "array" });
        const sheet = workbook.Sheets[workbook.SheetNames[0]];
        const rows: Record<string, string>[] = XLSX.utils.sheet_to_json(sheet, {
          defval: "",
        });

        const previewRows: PreviewRow[] = rows.slice(0, 3).map((row, i) => ({
          key: i,
          surname: row["Фамилия"] ?? "",
          name: row["Имя"] ?? "",
          patronymic: row["Отчество"] ?? "",
          rank: rankLabels[row["Чин"]] ?? row["Чин"] ?? "",
          division: row["Воинская часть"] ?? "",
          bio: row["Биография"] ?? "",
          source: row["Источник"] ?? "",
        }));

        setPreview(previewRows);
      } catch {
        message.error("Не удалось прочитать файл");
      }
    };
    reader.readAsArrayBuffer(f);
    return false;
  };

  const handleImport = async () => {
    if (!file) return;
    setImporting(true);
    try {
      // Read file as base64 on client and send to server action
      const reader = new FileReader();
      reader.readAsDataURL(file);
      const result = await new Promise<
        Awaited<ReturnType<typeof importParticipants>>
      >((resolve, reject) => {
        reader.onload = async () => {
          try {
            const base64 = reader.result as string;
            const res = await importParticipants(base64);
            resolve(res);
          } catch (e) {
            reject(e);
          }
        };
        reader.onerror = () => reject(reader.error);
      });

      if (result.imported > 0) {
        message.success(`Импортировано: ${result.imported}`);
      }
      if (result.duplicates > 0) {
        message.warning(`Пропущено дубликатов: ${result.duplicates}`);
      }
      if (result.errors.length > 0) {
        message.error(`Ошибок: ${result.errors.length}`);
        console.error("Import errors:", result.errors);
      }

      setOpen(false);
      setFile(null);
      setPreview([]);
      // Trigger a page refresh to show new data
      window.location.reload();
    } catch {
      message.error("Ошибка при импорте");
    } finally {
      setImporting(false);
    }
  };

  const handleClose = () => {
    setOpen(false);
    setFile(null);
    setPreview([]);
  };

  const columns: TableProps["columns"] = [
    {
      title: "Фамилия",
      dataIndex: "surname",
      key: "surname",
      render: (_, record) => (
        <div className="flex flex-col">
          <span>{record.surname}</span>
          <span>{record.name}</span>
          <span>{record.patronymic}</span>
        </div>
      ),
    },
    { title: "Чин", dataIndex: "rank", key: "rank" },
    { title: "Воинская часть", dataIndex: "division", key: "division" },
    {
      title: "Биография",
      dataIndex: "bio",
      key: "bio",
      render: (_, record) => (
        <Text style={{ width: 150 }} ellipsis>
          {record.bio}
        </Text>
      ),
    },
    {
      title: "Источник",
      dataIndex: "source",
      key: "source",
      render: (_, record) => (
        <Text style={{ width: 150 }} ellipsis>
          {record.source}
        </Text>
      ),
    },
  ];

  return (
    <>
      <Button variant="solid" color="green" onClick={() => setOpen(true)}>
        <UploadIcon size={16} /> Импорт из Excel
      </Button>

      <Modal
        title="Импорт участников из Excel"
        open={open}
        onCancel={handleClose}
        footer={[
          <Button key="cancel" onClick={handleClose}>
            Отмена
          </Button>,
          <Button
            key="import"
            type="primary"
            loading={importing}
            disabled={!file}
            onClick={handleImport}
          >
            Импортировать
          </Button>,
        ]}
        width={800}
      >
        <div className="mb-4">
          <Upload.Dragger
            accept=".xlsx,.xls"
            showUploadList={false}
            beforeUpload={handleFileSelect}
          >
            <p className="ant-upload-drag-icon">
              <UploadIcon size={48} />
            </p>
            <p className="ant-upload-text">
              Нажмите или перетащите Excel файл сюда
            </p>
            <p className="ant-upload-hint">
              Поддерживаются форматы .xlsx и .xls
            </p>
          </Upload.Dragger>
        </div>

        {file && (
          <div className="mb-2 text-sm text-gray-500">
            Выбран файл: {file.name}
          </div>
        )}

        {preview.length > 0 && (
          <div>
            <div className="mb-2 font-medium">
              Предпросмотр (первые {preview.length} строк):
            </div>
            <Table
              dataSource={preview}
              columns={columns}
              rowKey="key"
              pagination={false}
              size="small"
              bordered
            />
          </div>
        )}
      </Modal>
    </>
  );
}
