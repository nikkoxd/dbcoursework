"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function Sort({ columns }: {
  columns: { column_name: string; }[];
}) {
  const [selectedColumn, setSelectedColumn] = useState("");
  const [selectedOrder, setSelectedOrder] = useState<"asc" | "desc">("asc");

  const router = useRouter();

  function handleChange(event: React.ChangeEvent<HTMLSelectElement>) {
    const value = event.target.value;
    let newColumn = selectedColumn;
    let newOrder = selectedOrder;

    if (event.target.name === "column") {
      newColumn = value;
      setSelectedColumn(value);
    } else if (event.target.name === "order") {
      newOrder = value as "asc" | "desc";
      setSelectedOrder(value as "asc" | "desc");
    }

    router.push(`?${new URLSearchParams({
      sortBy: newColumn,
      sortOrder: newOrder,
    }).toString()}`);
    router.refresh();
  }

  return (
    <div className="flex gap-2 items-center">
      Сортировка:
      <select className="p-2 bg-gray-800 border rounded-lg border-gray-700 focus:outline-none focus:border-gray-500" name="column" value={selectedColumn} onChange={handleChange}>
        <option value="">Без сортировки</option>
        {columns.map((column) => (
          <option key={column.column_name}>{column.column_name}</option>
        ))}
      </select>

      <select className="p-2 bg-gray-800 border rounded-lg border-gray-700 focus:outline-none focus:border-gray-500" name="order" value={selectedOrder} onChange={handleChange}>
        <option value="asc">По возрастанию</option>
        <option value="desc">По убыванию</option>
      </select>
    </div>
  );
}
