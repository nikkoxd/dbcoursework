"use client"; 

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function ReportSelector() {
  const [selectedReport, setSelectedReport] = useState("");

  const router = useRouter();

  const handleChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const newSelectedReport = event.target.value;

    setSelectedReport(newSelectedReport);

    router.push(`/report/${newSelectedReport}`);
    router.refresh();
  };

  return (
    <div className="flex gap-2 items-center">
      <select className="p-2 bg-gray-100 dark:bg-gray-800 border rounded-lg border-gray-700 focus:outline-none focus:border-gray-500" name="report" value={selectedReport} onChange={handleChange}>
        <option value="">Выберите отчет</option>
        <option value="free_rooms">Перечень свободных номеров на заданную дату</option>
        <option value="free_occupied_rooms">Кол-во свободных/занятых номеров на заданную дату</option>
        <option value="visitors_during">Количество посетителей в срок с ... по ...</option>
      </select>
    </div>
  );
}
