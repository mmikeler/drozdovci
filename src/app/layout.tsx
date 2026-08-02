import type { Metadata } from "next";
import { Geist_Mono, Montserrat } from "next/font/google";
import { App, ConfigProvider, Layout } from "antd";
import "./globals.css";
import SessionProvider from "@/components/sessionProvider";
import { MYHeader } from "@/components/header";
import { Content } from "antd/es/layout/layout";
import MYFooter from "@/components/footer";

const geistSans = Montserrat({
  variable: "--font-montserrat",
  subsets: ["latin", "cyrillic"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin", "cyrillic"],
});

export const metadata: Metadata = {
  title: "История Дроздовцев",
  description: "Тем, кому не было места на Родине",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="ru"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-gray-200">
        <App>
          <SessionProvider>
            <ConfigProvider
              theme={{
                token: {
                  colorPrimary: "#a50036",
                  borderRadius: 8,
                  fontFamily: "Geist Mono",
                },
                components: {
                  Upload: {
                    pictureCardSize: 150,
                  },
                },
              }}
            >
              <Layout style={{ backgroundColor: "transparent" }}>
                <MYHeader />
                <div className="mx-auto container p-5">
                  <Layout
                    style={{
                      padding: "24px",
                      background: "#fff",
                      borderRadius: "20px",
                    }}
                  >
                    <Content>{children}</Content>
                  </Layout>
                </div>
                <MYFooter />
              </Layout>
            </ConfigProvider>
          </SessionProvider>
        </App>
      </body>
    </html>
  );
}
