"use client";

import { AvailableRoom, Hotel, HotelOccupancy, Personel, Room, TableSchema } from "@/types/schema";
import EditModal from "./EditModal";
import { useState } from "react";
import CreateModal from "./CreateModal";

export default function Table({ name, columns, data, deleteAction, editAction, createAction }: {
  name: string;
  columns: { column_name: string; }[];
  data: TableSchema[];
  deleteAction: (row: TableSchema) => void;
  editAction: (formData: FormData) => void;
  createAction: (formData: FormData) => void;
}) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedRow, setSelectedRow] = useState<TableSchema | null>(null);

  function getPrimaryKey(row: TableSchema) {
    switch (name) {
      case "personel":
        return (row as Personel).inn;
      case "rooms":
        return (row as Room).number;
      case "available_rooms":
        return (row as AvailableRoom).number;
      case "hotel_occupancy":
        return (row as HotelOccupancy).hotel_name;
      default:
        return (row as Hotel).id;
    }
  }

  function showEditModal(row: TableSchema) {
    setSelectedRow(row);
    setIsEditModalOpen(true);
  }

  function closeEditModal() {
    setSelectedRow(null);
    setIsEditModalOpen(false);
  }

  function showCreateModal() {
    setIsCreateModalOpen(true);
  }

  function closeCreateModal() {
    setIsCreateModalOpen(false);
  }

  return (
    <>
      {isEditModalOpen && (
        <EditModal columns={columns} row={selectedRow as {[key: string]: string | number | Date | null}} onClose={closeEditModal} editAction={editAction}/>
      )}
      {isCreateModalOpen && (
        <CreateModal columns={columns} onClose={closeCreateModal} createAction={createAction}/>
      )}
      <div className="pb-4 flex justify-between items-center">
        <button className="px-2 py-1 bg-gray-200 dark:bg-gray-700 dark:text-white rounded-md" onClick={() => showCreateModal()}>Добавить запись</button>
      </div>
      <table className="w-full text-left">
        <thead>
          <tr>
            {columns.map((column) => (
              <th className="p-2 bg-gray-200 dark:bg-gray-900 border-b border-gray-600" key={column.column_name}>{column.column_name}</th>
            ))}
            <th className="p-2 bg-gray-200 dark:bg-gray-900 border-b border-gray-600">Действия</th>
          </tr>
        </thead>
        <tbody>
          {data.map((row) => (
            <tr key={getPrimaryKey(row)}>
              {Object.entries(row).map(([key, value]) => (
                <td className="p-2 border-b border-gray-600" key={key}>
                  {value instanceof Date ?
                    value.toDateString()
                    : value
                  }
                </td>
              ))}
              <td className="p-2 border-b border-gray-600 flex gap-2">
                <button className="underline" onClick={() => deleteAction(row)}>Удалить</button>
                <button className="underline" onClick={() => showEditModal(row)}>Изменить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
