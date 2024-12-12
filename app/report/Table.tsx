import { TableSchema } from "@/types/schema";

export default function Table({ columns, data, pkey }: {
  columns: { column_name: string; }[];
  data: TableSchema[];
  pkey: string;
}) {
  return (
    <table className="w-full text-left">
      <thead>
        <tr>
          {columns.map((column) => (
            <th className="p-2 bg-gray-900 border-b border-gray-600" key={column.column_name}>{column.column_name}</th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data.map((row) => (
          <tr key={(row as {
            [key: string]: string | number | null;
          })[pkey]}>
            {Object.entries(row).map(([key, value]) => (
              <td className="p-2 border-b border-gray-600" key={key}>{value as string}</td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
