// Form options for the form

import { Button, Divider, FormInstance, Popconfirm } from "antd";
import { deleteParticipantCard } from "../../actions/deleteParticipantCard";
import { Participant } from "@/generated/prisma/client";
import { changeStatus } from "../../actions/changeStatus";

export function FormOptions({
  formRef,
  participant,
}: {
  formRef: FormInstance;
  participant: Participant;
}) {
  const { id, status } = participant;

  const handleChangeStatus = async () => {
    if (status === "DRAFT" && formRef.getFieldValue("source").length < 1) {
      formRef.submit();
      return;
    }
    await changeStatus(
      participant.id,
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
        onConfirm={() => deleteParticipantCard(id)}
      >
        <Button variant="solid" color="danger">
          Удалить карточку
        </Button>
      </Popconfirm>
    </>
  );
}
