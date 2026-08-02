"use client";

import { Form, Input, App } from "antd";
import { ReactNode } from "react";
import { BurialPlace } from "@/generated/prisma/client";
import Gallery from "./gallery";
import { saveBurialGallery } from "../../c/actions/saveBurialGallery";
import { updateBurial } from "../../c/actions/updateBurial";
import { FormOptions } from "./formOptions";

interface EditFormProps {
  burial: BurialPlace;
}

export default function EditForm({ burial }: EditFormProps) {
  const [form] = Form.useForm();
  const { message } = App.useApp();

  const onFinish = async (values: Record<string, unknown>) => {
    const formData = new FormData();
    for (const [key, value] of Object.entries(values)) {
      formData.append(key, String(value ?? ""));
    }

    const result = await updateBurial(burial.id, formData);

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
            initialPhotosUrls={JSON.parse(burial.gallery ?? "[]")}
            savePath={`/burials/${burial.id}`}
            onSave={(photos) => saveBurialGallery(burial.id, photos)}
          />
        </FormGroup>
      </div>
      {/* Edit Form */}
      <Form
        form={form}
        layout="vertical"
        initialValues={burial}
        onFinish={onFinish}
        style={{ width: "100%" }}
        scrollToFirstError={{ behavior: "smooth", block: "end", focus: true }}
      >
        {/* Название */}
        <FormGroup title="Название">
          <Form.Item name="title" className="w-full">
            <Input placeholder="Название захоронения" />
          </Form.Item>
        </FormGroup>

        {/* Местоположение */}
        <FormGroup title="Местоположение">
          <Form.Item label="Страна" name="country" className="w-full">
            <Input placeholder="Страна" />
          </Form.Item>
          <Form.Item
            label="Город / населённый пункт"
            name="city"
            className="w-full"
          >
            <Input placeholder="Город / населённый пункт" />
          </Form.Item>
        </FormGroup>

        {/* Описание */}
        <Form.Item label="Описание" name="description">
          <Input.TextArea rows={10} />
        </Form.Item>
      </Form>
      {/* Actions */}
      <div className="w-60 sticky flex flex-col gap-4 mt-10">
        <FormOptions formRef={form} burial={burial} />
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
