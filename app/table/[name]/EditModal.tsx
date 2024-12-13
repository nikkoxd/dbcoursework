import Modal from "./Modal";

export default function EditModal({ columns, row, onClose, editAction }: {
  columns: { column_name: string; }[];
  row: { [key: string]: string | number | Date | null };
  onClose: () => void;
  editAction: (formData: FormData) => void;
}) {
  return (
    <Modal title="Изменение записи" onClose={onClose}>
      <form className="flex flex-col gap-2" action={editAction}>
        {columns.map((column) => (
          <input
            type="text"
            className="py-1 px-2 border rounded-lg bg-gray-100 dark:bg-gray-800 border-gray-700 focus:outline-none focus:border-gray-500"
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
        <button type="submit" className="my-2 py-2 px-4 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-lg">Сохранить</button>
      </form>
    </Modal>
  );
}
