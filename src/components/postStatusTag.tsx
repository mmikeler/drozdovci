// Post status tag component

import { PostStatus } from "@/generated/prisma/enums";
import { statusLabels } from "@/lib/status";
import { Tag } from "antd";

export default function PostStatusTag({ status }: { status: PostStatus }) {
  switch (status) {
    case "DRAFT":
      return <Tag color="default">{statusLabels["DRAFT"]}</Tag>;
    case "PUBLISHED":
      return <Tag color="success">{statusLabels["PUBLISHED"]}</Tag>;
    default:
      return <Tag color="default">Неизвестно</Tag>;
  }
}
