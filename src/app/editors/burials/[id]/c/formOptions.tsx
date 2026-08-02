"use client";

import { Button, Divider, FormInstance, Popconfirm } from "antd";
import { BurialPlace } from "@/generated/prisma/client";
import { deleteBurialAction } from "../../c/actions/deleteBurialAction";
import { changeBurialStatus } from "../../c/actions/changeBurialStatus";

export function FormOptions({
  formRef,
  burial,
}: {
  formRef: FormInstance;
  burial: BurialPlace;
}) {
  const { id, status } = burial;

  const handleChangeStatus = async () => {
    await changeBurialStatus(
      burial.id,
      status === "DRAFT" ? "PUBLISHED" : "DRAFT",
    );
  };

  return (
    <>
      <Button onClick={() => formRef.submit()} type="default" htmlType="submit">
        Сохранить
      </Button>
      {status === "PUBLISHED" ? (
        <Button onClick={handleChangeStatus} variant="solid" color="gold">
          Снять с публикации
        </Button>
      ) : (
        <Button onClick={handleChangeStatus} variant="solid" color="green">
          Опубликовать
        </Button>
      )}
      <Divider />
      <Popconfirm
        title="Удалить карточку?"
        onConfirm={() => deleteBurialAction(id)}
      >
        <Button variant="solid" color="danger">
          Удалить карточку
        </Button>
      </Popconfirm>
    </>
  );
}
