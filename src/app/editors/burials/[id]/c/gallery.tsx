"use client";

import { useEffect, useRef, useState } from "react";
import { App, Image, Popconfirm, Upload } from "antd";
import type { UploadFile, UploadProps } from "antd";
import { deleteImage } from "@/app/actions/images/delete";
import { uploadImage } from "@/app/actions/images/upload";
import { PlusOutlined } from "@ant-design/icons";
import { useSortable, isSortable } from "@dnd-kit/react/sortable";
import { DragDropProvider } from "@dnd-kit/react";
import { GripVertical, Trash2 } from "lucide-react";

interface GalleryProps {
  initialPhotosUrls: string[];
  savePath: string;
  onSave: (photos: string[]) => void;
}

export default function Gallery({
  initialPhotosUrls,
  savePath,
  onSave,
}: GalleryProps) {
  const { message } = App.useApp();
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");

  const [photos, setPhotos] = useState<string[]>(initialPhotosUrls);

  const handleUpload: UploadProps["customRequest"] = async (options) => {
    const { file, onSuccess, onError, onProgress } = options;

    try {
      onProgress?.({ percent: 30 });

      const formData = new FormData();
      formData.append("file", file as File);

      const result = await uploadImage(savePath, formData);

      if ("url" in result) {
        onProgress?.({ percent: 100 });
        onSuccess?.(result);

        setPhotos((prev) => [...prev, result.url]);
      } else {
        message.error(result.error ?? "Ошибка загрузки");
        onError?.(new Error(result.error ?? "Unknown error"));
      }
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Upload failed";
      message.error(msg);
      onError?.(new Error(msg));
    }
  };

  const handleRemove = async (url: string) => {
    try {
      const image = await deleteImage(url);
      if (image) {
        setPhotos((prev) => prev.filter((p) => p !== url));
      }
    } catch {
      message.error("Ошибка при удалении файла");
    }
  };

  const fileList: UploadFile[] = photos.map((url, index) => ({
    uid: `${index}-${url}`,
    name: url.split("/").pop() ?? `photo-${index}.webp`,
    status: "done",
    url,
  }));

  useEffect(() => {
    onSave(photos);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [photos]);

  return (
    <div>
      <DragDropProvider
        onDragEnd={(event) => {
          const { operation } = event;
          const source = operation.source;

          if (source && isSortable(source)) {
            const { index, initialIndex } = source;

            if (index !== initialIndex) {
              const reordered = [...photos];
              const [moved] = reordered.splice(initialIndex, 1);
              reordered.splice(index, 0, moved);
              onSave(reordered);
            }
          }
        }}
      >
        <div className="flex flex-col gap-2 mb-3">
          {photos.map((url, index) => (
            <Sortable
              key={url}
              id={url}
              index={index}
              onRemove={handleRemove}
              originNode={
                <Image
                  src={url}
                  width={150}
                  height={150}
                  style={{ objectFit: "cover" }}
                  alt=""
                />
              }
            />
          ))}
        </div>
        <Upload
          name="file"
          multiple
          accept="image/*"
          customRequest={handleUpload}
          fileList={fileList}
          showUploadList={false}
          onPreview={(file) => {
            setPreviewImage(file.url || "");
            setPreviewOpen(true);
          }}
          listType="picture-card"
          maxCount={30}
        >
          {photos.length < 30 && (
            <button
              style={{
                border: 0,
                background: "none",
              }}
              type="button"
            >
              <PlusOutlined />
              <div style={{ marginTop: 8 }}>Загрузить фото</div>
            </button>
          )}
        </Upload>
      </DragDropProvider>

      {previewImage && (
        <Image
          alt="Предпросмотр"
          styles={{ root: { display: "none" } }}
          preview={{
            open: previewOpen,
            onOpenChange: (visible) => setPreviewOpen(visible),
            afterOpenChange: (visible) => !visible && setPreviewImage(""),
          }}
          src={previewImage}
        />
      )}
    </div>
  );
}

function Sortable({
  id,
  index,
  originNode,
  onRemove,
}: {
  id: string;
  index: number;
  originNode: React.ReactNode;
  onRemove: (id: string) => void;
}) {
  const [element, setElement] = useState<Element | null>(null);
  const handleRef = useRef<HTMLButtonElement | null>(null);
  const { isDragging } = useSortable({
    id,
    index,
    element,
    handle: handleRef,
  });

  return (
    <div
      ref={setElement}
      className={`aspect-square relative rounded overflow-hidden ${isDragging && "shadow-lg shadow-stone-900"}`}
    >
      {originNode}
      <button ref={handleRef} className="absolute top-1 right-0 cursor-move">
        <GripVertical size={20} color="white" />
      </button>
      <Popconfirm title="Удалить фото?" onConfirm={() => onRemove(id)}>
        <button className="absolute bottom-1 right-1 cursor-pointer hover:scale-110">
          <Trash2 size={20} color="red" />
        </button>
      </Popconfirm>
    </div>
  );
}
