"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DateSelector() {
  const router = useRouter();

  const [selectedDate, setSelectedDate] = useState("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;

    setSelectedDate(value);

    router.push(`?${new URLSearchParams({
      date: value,
    }).toString()}`);
    router.refresh();
  }

  return (
    <div className="flex gap-2 items-center">
      Дата:
      <input type="date" className="p-2 bg-gray-800 border rounded-lg border-gray-700 focus:outline-none focus:border-gray-500" onChange={handleChange} value={selectedDate} />
    </div>
  )
}
