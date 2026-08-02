"use client";

import { Form, Input, Select, Checkbox, Space, App } from "antd";
import { rankLabels } from "@/lib/ranks";
import { updateParticipant } from "../../actions/updateParticipant";
import { ReactNode } from "react";
import { Participant } from "@/generated/prisma/client";
import Gallery from "./gallery";
import { saveGalleryPhotos } from "../../actions/saveGalleryPhotos";
import { FormOptions } from "./formOptions";

interface EditFormProps {
  participant: Participant;
  burialsOptions: { id: number; title: string }[];
}

const rankOptions = Object.entries(rankLabels).map(([value, label]) => ({
  value,
  label,
}));

export default function EditForm({
  participant,
  burialsOptions,
}: EditFormProps) {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  // Save form data
  const onFinish = async (values: Record<string, unknown>) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) {
      if (key === "isDrozdovec" || key === "is198") {
        formData.append(key, value ? "on" : "off");
      } else {
        formData.append(key, String(value ?? ""));
      }
    }

    const result = await updateParticipant(participant.id, formData);

    if (result.success) {
      message.success("Данные сохранены");
    } else {
      message.error(result.error ?? "Ошибка при сохранении");
    }
  };

  return (
    <div className="flex flex-wrap gap-4 lg:flex-nowrap pt-5 relative">
      {/* Фото */}
      <div className="w-60 flex flex-col gap-10">
        <FormGroup title="Фото">
          <Gallery
            initialPhotosUrls={JSON.parse(participant.photos ?? [])}
            savePath={`/participants/${participant.id}`}
            onSave={(photos) => saveGalleryPhotos(participant.id, photos)}
          />
        </FormGroup>
        <FormGroup title="Фото могилы">
          <Gallery
            initialPhotosUrls={JSON.parse(participant.grave_photo ?? [])}
            savePath={`/participants/${participant.id}`}
            onSave={(photos) =>
              saveGalleryPhotos(participant.id, photos, "grave_photo")
            }
          />
        </FormGroup>
      </div>
      {/* Edit Form */}
      <Form
        form={form}
        layout="vertical"
        initialValues={participant}
        onFinish={onFinish}
        style={{ width: "100%" }}
        scrollToFirstError={{ behavior: "smooth", block: "end", focus: true }}
      >
        {/* ФИО */}
        <FormGroup title="ФИО">
          <Form.Item name="surname" className="w-full">
            <Input placeholder="Фамилия" />
          </Form.Item>
          <div className="flex gap-4 w-full">
            <Form.Item name="name" className="w-1/2">
              <Input placeholder="Имя" />
            </Form.Item>
            <Form.Item name="patronymic" className="w-1/2">
              <Input placeholder="Отчество" />
            </Form.Item>
          </div>
        </FormGroup>

        {/* Voenka */}
        <FormGroup title="Служба">
          <Form.Item label="Чин" name="rank">
            <Select
              showSearch={{ optionFilterProp: "label" }}
              options={rankOptions}
            />
          </Form.Item>
          <Form.Item label="Воинская часть" name="division">
            <Input />
          </Form.Item>
          <Space>
            <Form.Item name="isDrozdovec" valuePropName="checked">
              <Checkbox>Дроздовская часть</Checkbox>
            </Form.Item>
            <Form.Item name="is198" valuePropName="checked">
              <Checkbox>198</Checkbox>
            </Form.Item>
          </Space>
          {/* Награды */}
          <Form.Item label="Награды" name="rewards">
            <Input.TextArea rows={3} />
          </Form.Item>
        </FormGroup>

        {/* Dates */}
        <FormGroup title="Даты">
          <Form.Item label="Дата рождения" name="born_at">
            <Input placeholder="например: 1885" />
          </Form.Item>
          <Form.Item label="Дата смерти" name="died_at">
            <Input placeholder="например: 1920" />
          </Form.Item>
        </FormGroup>

        {/* Address */}
        <FormGroup title="Место рождения">
          <Form.Item label="Губерния" name="guberniya">
            <Input />
          </Form.Item>
          <Form.Item label="Уезд" name="uezd">
            <Input />
          </Form.Item>
          <Form.Item label="Волость" name="volost">
            <Input />
          </Form.Item>
          <Form.Item label="Населённый пункт" name="locality">
            <Input />
          </Form.Item>
        </FormGroup>

        {/* Биография */}
        <Form.Item label="Биография" name="bio">
          <Input.TextArea rows={10} />
        </Form.Item>

        {/* Источники */}
        <Form.Item
          label="Источник"
          name="source"
          rules={[{ required: true, message: "Заполните источник" }]}
        >
          <Input.TextArea rows={3} />
        </Form.Item>

        {/* Связи */}
        <FormGroup title="Связи">
          <Form.Item label="Место захоронения" name="burialPlaceId">
            <Select
              showSearch={{ optionFilterProp: "label" }}
              options={burialsOptions.map((burial) => ({
                label: burial.title,
                value: burial.id,
              }))}
            />
          </Form.Item>
        </FormGroup>
      </Form>
      {/* Actions */}
      <div className="w-60 sticky flex flex-col gap-4 mt-10">
        <FormOptions formRef={form} participant={participant} />
      </div>
    </div>
  );
}

function FormGroup({
  title,
  children,
}: {
  children: ReactNode;
  title: string;
}) {
  return (
    <legend className="flex relative flex-wrap mt-10 bg-gray-50 p-5! rounded border! border-solid! border-gray-200!">
      <span className="absolute -top-4 bg-white px-2 text-gray-500 let-2 font-bold">
        {title}
      </span>
      {children}
    </legend>
  );
}
