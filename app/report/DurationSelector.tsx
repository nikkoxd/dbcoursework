"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function DurationSelector() {
  const router = useRouter();

  const [selectedFrom, setSelectedFrom] = useState("");
  const [selectedTo, setSelectedTo] = useState("");

  function handleChange(event: React.ChangeEvent<HTMLInputElement>) {
    const value = event.target.value;
    let newFrom = selectedFrom;
    let newTo = selectedTo;

    if (event.target.name === "from") {
      newFrom = value;
      setSelectedFrom(value);
      if (selectedTo == "") {
        setSelectedTo(value);
        newTo = value;
      }
    } else if (event.target.name === "to") {
      newTo = value;
      setSelectedTo(value);
      if (selectedFrom == "") {
        setSelectedFrom(value);
        newFrom = value;
      }
    }

    router.push(`?${new URLSearchParams({
      from: newFrom,
      to: newTo,
    }).toString()}`);
    router.refresh();
  }

  return (
    <div className="flex gap-2 items-center">
      Промежуток времени:
      <input type="date" name="from" className="p-2 bg-gray-800 border rounded-lg border-gray-700 focus:outline-none focus:border-gray-500" onChange={handleChange} value={selectedFrom} />
      <input type="date" name="to" className="p-2 bg-gray-800 border rounded-lg border-gray-700 focus:outline-none focus:border-gray-500" onChange={handleChange} value={selectedTo} />
    </div>
  )
}
