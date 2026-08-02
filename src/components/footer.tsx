// MAIN FOOTER

import { Footer } from "antd/es/layout/layout";

export default function MYFooter() {
  const currentYear = new Date().getFullYear();

  return (
    <Footer>
      <div className="text-center">История Дроздовцев © {currentYear}</div>
    </Footer>
  );
}
