"use client";

import { AvailableRoom, Hotel, HotelOccupancy, Personel, Room, TableSchema } from "@/types/schema";
import Modal from "./Modal";
import { useState } from "react";

export default function Table({ name, columns, data, deleteAction, editAction }: {
  name: string;
  columns: { column_name: string; }[];
  data: TableSchema[];
  deleteAction: (row: TableSchema) => void;
  editAction: (formData: FormData) => void;
}) {
  const [isModalOpen, setIsModalOpen] = useState(false);
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

  function showModal(row: TableSchema) {
    setSelectedRow(row);
    setIsModalOpen(true);
  }

  function closeModal() {
    setSelectedRow(null);
    setIsModalOpen(false);
  }

  return (
    <>
      {isModalOpen && (
        <Modal columns={columns} row={selectedRow as {[key: string]: string | number | Date | null}} onClose={closeModal} editAction={editAction}/>
      )}
      <table className="w-full text-left">
        <thead>
          <tr>
            {columns.map((column) => (
              <th className="p-2 bg-gray-900 border-b border-gray-600" key={column.column_name}>{column.column_name}</th>
            ))}
            <th className="p-2 bg-gray-900 border-b border-gray-600">Действия</th>
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
                <button className="underline" onClick={() => showModal(row)}>Изменить</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </>
  );
}
