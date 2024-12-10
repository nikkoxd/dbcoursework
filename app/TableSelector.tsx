"use client";

export default function TableSelector({ tables }: { tables: { table_name: string; }[]; }) {
  return (
    <>
      <select className="text-black p-1">
        {tables.map((table) => (
          <option key={table.table_name}>{table.table_name}</option>
        ))}
      </select>
    </>
  );
}
