// Burial place public page

import { getBurials } from "@/app/editors/burials/c/actions/actions";
import { PageContent } from "./c/content";

export default async function Page() {
  const burials = await getBurials({ status: "PUBLISHED" });

  if ("error" in burials) return <>Ошибка при получении данных</>;

  return <PageContent burials={burials} />;
}
