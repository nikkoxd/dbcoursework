import Modal from "./Modal";

export default function CreateModal({ columns, onClose, createAction }: {
  columns: { column_name: string; }[];
  onClose: () => void;
  createAction: (formData: FormData) => void;
}) {
  return (
    <Modal title="Создание записи" onClose={onClose}>
      <form className="flex flex-col gap-2" action={createAction}>
        {columns.map((column) => (
          <input
            type="text"
            className="py-1 px-2 border rounded-lg bg-gray-100 dark:bg-gray-800 border-gray-700 focus:outline-none focus:border-gray-500"
            key={column.column_name}
            name={column.column_name}
            placeholder={column.column_name}
          />
        ))}
        <button type="submit" className="my-2 px-4 py-2 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-md">Создать</button>
      </form>
    </Modal>
  )
}
