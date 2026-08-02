// Pagination for participant page

"use client";

import { Pagination as AntPagination } from "antd";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

export default function Pagination({
  currentPage,
  totalCount,
  pageSize,
}: {
  currentPage: number;
  totalCount: number;
  pageSize: number;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const onChange = useCallback(
    (page: number) => {
      const params = new URLSearchParams(searchParams.toString());
      params.set("page", String(page));
      router.push(`?${params.toString()}`);
    },
    [router, searchParams],
  );

  if (totalCount <= pageSize) return null;

  return (
    <div className="flex justify-center my-6">
      <AntPagination
        current={currentPage}
        total={totalCount}
        pageSize={pageSize}
        onChange={onChange}
        showSizeChanger={false}
      />
    </div>
  );
}
