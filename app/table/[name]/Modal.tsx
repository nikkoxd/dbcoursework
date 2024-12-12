export default function Modal({ columns, row, onClose, editAction }: {
  columns: { column_name: string; }[];
  row: { [key: string]: string | number | Date | null };
  onClose: () => void;
  editAction: (formData: FormData) => void;
}) {
  return (
    <div onClick={onClose} className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-50 z-10 flex items-center justify-center">
      <div onClick={(e) => e.stopPropagation()} className="bg-gray-800 px-4 py-5 rounded-lg shadow-lg">
        <div className="flex justify-between gap-16">
          <h1 className="text-lg font-bold">Изменение записи</h1>
          <button onClick={onClose} className="underline">Отменить</button>
        </div>
        <form className="mt-4 flex flex-col gap-2" action={editAction}>
          {columns.map((column) => (
            <input
              type="text"
              className="py-1 px-2 border rounded-lg bg-gray-800 border-gray-700 focus:outline-none focus:border-gray-500"
              key={column.column_name}
              name={column.column_name}
              placeholder={column.column_name}
              defaultValue={row ?
                row[column.column_name] instanceof Date ?
                  (row[column.column_name] as Date).toDateString()
                  : row[column.column_name] as string
                : ""}
            />
          ))}
          <button type="submit" className="my-2 py-2 px-4 bg-gray-700 text-white rounded-lg">Сохранить</button>
        </form>
      </div>
    </div>
  );
}
