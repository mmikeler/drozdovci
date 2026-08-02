// Status codes

import { PostStatus } from "@/generated/prisma/enums";

export const statusLabels: Record<PostStatus, string> = {
  DRAFT: "Черновик",
  PUBLISHED: "Опубликовано",
};
