// addNew.tsx

"use client";

import { App, Button } from "antd";
import { useState } from "react";
import { Plus } from "lucide-react";
import { createBurial } from "./actions/actions";

export function AddNewBtn() {
  const { message } = App.useApp();
  const [waiting, setWaiting] = useState(false);

  const handleClick = async () => {
    setWaiting(true);
    try {
      const response = await createBurial();
      if (!response) {
        message.error("Не удалось добавить захоронение. Попробуйте ещё раз.");
      }
    } finally {
      setWaiting(false);
    }
  };

  return (
    <div className="">
      <Button loading={waiting} onClick={handleClick}>
        <Plus size={16} /> Добавить захоронение
      </Button>
    </div>
  );
}
