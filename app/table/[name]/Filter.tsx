"use client";

import { useRouter, useSearchParams } from "next/navigation";

export default function Filter({ columns }: {
  columns: { column_name: string; }[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();

  function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
    event.preventDefault();

    const formData = new FormData(event.currentTarget);

    const filters: { [key: string]: string } = {};

    for (const [key, value] of formData.entries()) {
      if (value === "") {
        continue;
      }

      filters[key] = value as string;
    }

    const currentParams = new URLSearchParams(searchParams.toString());
    for (const [key, value] of Object.entries(filters)) {
      currentParams.set(key, value);
    }

    router.push(`?${currentParams.toString()}`);
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="flex gap-2 items-center">
      Фильтр:
      {columns.map((column) => (
        <input type="text" className="py-1 px-2 border rounded-lg bg-gray-800 border-gray-700 focus:outline-none focus:border-gray-500" key={column.column_name} name={column.column_name} placeholder={column.column_name} />
      ))}
      <button type="submit" className="px-2 py-1 bg-gray-700 text-white rounded-md">Искать</button>
    </form>
  );
}
