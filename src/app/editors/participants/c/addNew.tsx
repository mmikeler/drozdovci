// addNew.tsx

"use client";

import { App, Button } from "antd";
import { createParticipant } from "../actions/createParticipant";
import { useState } from "react";
import { Plus } from "lucide-react";

export function AddNewBtn() {
  const { message } = App.useApp();
  const [waiting, setWaiting] = useState(false);

  const handleClick = async () => {
    setWaiting(true);
    try {
      const response = await createParticipant();

      if (!response) {
        message.error("Не удалось добавить участника. Попробуйте ещё раз.");
      }
    } finally {
      setWaiting(false);
    }
  };

  return (
    <div className="">
      <Button loading={waiting} onClick={handleClick}>
        <Plus size={16} /> Добавить участника
      </Button>
    </div>
  );
}
