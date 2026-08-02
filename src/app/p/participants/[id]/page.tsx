// Participant single page

import { authOptions } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Participant } from "@/models/participant";
import { Row, Col, Empty, Descriptions, Image, Divider, Alert } from "antd";
import { getServerSession } from "next-auth";
import Link from "next/link";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;

  const result = await prisma.participant.findUnique({
    where: {
      id: Number(id),
    },
  });

  if (!result) {
    return <Empty />;
  }

  const P = new Participant(result);

  const session = await getServerSession(authOptions);
  const role = session?.user.role;
  const isAdmin = role?.match(/ADMIN/);

  const isPublished = P.status === "PUBLISHED";

  if (!isPublished) {
    return (
      <div className="min-h-[70dvh] w-100 mx-auto">
        <Alert
          variant="outlined"
          type="warning"
          title={`Это карточка ${P.fullName}. Сейчас она снята с публикации`}
          className="text-center"
        />
        {isAdmin && (
          <Link
            className="block text-center p-3"
            href={`/editors/participants/${id}`}
          >
            Редактировать
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="max-w-250 mx-auto">
      {isAdmin && (
        <Link
          className="block text-center p-3"
          href={`/editors/participants/${id}`}
        >
          Редактировать
        </Link>
      )}
      <div className="bg-rose-800 text-center p-3 mb-5 rounded">
        <h1 className="text-yellow-500 text-3xl">{P.fullName}</h1>
      </div>
      <Row>
        <Col span={4}>
          <div className="flex flex-col gap-4">
            {P.gallery.length > 0 ? (
              P.gallery.map((photo) => (
                <Image
                  key={photo}
                  styles={{
                    image: { objectFit: "cover", height: "100%" },
                    root: { height: "100%", border: "1px solid #ddd" },
                  }}
                  src={photo}
                  alt={P.fullName}
                  sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                />
              ))
            ) : (
              <Image
                preview={false}
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                styles={{
                  image: { objectFit: "cover", height: "100%" },
                  root: { height: "100%" },
                }}
                loading="eager"
                src="/mock2.jpg"
                alt={P.fullName}
              />
            )}
          </div>
          <Divider>Захоронение</Divider>
          <div className="flex flex-col gap-4">
            {P.graveGallery.length > 0
              ? P.graveGallery.map((photo, index) => (
                  <Image
                    key={index}
                    styles={{
                      image: { objectFit: "cover", height: "100%" },
                      root: { height: "100%", border: "1px solid #ddd" },
                    }}
                    src={photo}
                    alt={P.fullName}
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                  />
                ))
              : "Нет фото"}
          </div>
        </Col>
        <Col span={20} className="ps-8">
          <Descriptions size="large" bordered items={P.descriptionItems.fio} />
          <Descriptions
            title="Служба"
            size="large"
            bordered
            className="mt-10!"
            items={P.descriptionItems.voenka}
          />
          <Descriptions
            title="Даты"
            size="large"
            bordered
            className="mt-10!"
            items={P.descriptionItems.dates}
          />
          <Descriptions
            title="Принадлежность"
            size="large"
            bordered
            className="mt-10!"
            items={P.descriptionItems.checkboxes}
          />
          <Descriptions
            title="Место рождения"
            size="large"
            bordered
            className="mt-10!"
            items={P.descriptionItems.bornPlace}
          />

          <div className="mt-10">
            <Divider>Награды</Divider>
            {P.rewards || (
              <span className="text-gray-400 italic">Нет информации</span>
            )}
          </div>

          <div className="mt-10 text-lg">
            <Divider>Биография</Divider>
            {P.bio || "Нет информации"}
          </div>

          <div className="mt-10 text-lg">
            <Divider>Источник</Divider>
            {P.source || "Нет информации"}
          </div>

          <div className="mt-10 text-lg">
            <Divider>Связи</Divider>
            {P.burialPlaceId ? (
              <Link href={`/p/nekropol?#b` + P.burialPlaceId}>Кладбище</Link>
            ) : (
              <span className="text-gray-400 italic">Нет</span>
            )}
          </div>
        </Col>
      </Row>
    </div>
  );
}
