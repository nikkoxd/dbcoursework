"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function TableSelector({ tables }: {
  tables: { table_name: string; }[];
}) {
  const [selectedTable, setSelectedTable] = useState("");

  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelectedTable = event.target.value;

    setSelectedTable(newSelectedTable);

    router.push(`/table/${newSelectedTable}`);
    router.refresh();
  };

  return (
    <>
      <select className="p-2 bg-gray-800 border rounded-lg border-gray-700 focus:outline-none focus:border-gray-500" value={selectedTable} onChange={handleChange}>
        <option value="">Выберите таблицу</option>
        {tables.map((table) => (
          <option key={table.table_name}>{table.table_name}</option>
        ))}
      </select>
    </>
  );
}
