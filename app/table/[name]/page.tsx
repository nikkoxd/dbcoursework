import { pool } from "@/lib/pg";
import Table from "./Table";
import Filter from "./Filter";
import { AvailableRoom, Hotel, HotelOccupancy, Personel, Room, TableSchema } from "@/types/schema";
import { redirect } from "next/navigation";

export default async function Page({
  params,
  searchParams,
}: {
  params: Promise<{ name: string; }>;
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const name = (await params).name;

  async function getColumns(): Promise<{ column_name: string; }[]> {
    const schema = process.env.SCHEMA_NAME as string;

    const result = await pool.query("select column_name from information_schema.columns where table_name = $1 and table_schema = $2", [name, schema]);

    return result.rows;
  }

  async function getData(): Promise<TableSchema[]> {
    const schema = process.env.SCHEMA_NAME as string;

    let query = `select * from ${schema}.${name}`;
    const values: string[] = [];
    let whereClause = "";

    const filters = await searchParams;

    if (Object.keys(filters).length > 0) {
      whereClause = " where ";
      const filterConditions = Object.keys(filters).map((key, index) => {
        values.push(filters[key] as string);
        return `${key} = $${index + 1}`;
      });
      whereClause += filterConditions.join(" and ");
    }

    query += whereClause;

    const result = await pool.query(query, values);

    return result.rows;
  }

  async function deleteAction(row: TableSchema) {
    "use server";

    let primaryKeyName = "";
    let primaryKeyValue = null;

    switch (name) {
      case "personel":
        primaryKeyName = "inn";
        primaryKeyValue = (row as Personel).inn;
        break;
      case "rooms":
        primaryKeyName = "number";
        primaryKeyValue = (row as Room).number;
        break;
      case "available_rooms":
        primaryKeyName = "number";
        primaryKeyValue = (row as AvailableRoom).number;
        break;
      case "hotel_occupancy":
        primaryKeyName = "hotel_name";
        primaryKeyValue = (row as HotelOccupancy).hotel_name;
        break;
      default:
        primaryKeyName = "id";
        primaryKeyValue = (row as Hotel).id;
    }

    console.log(name, primaryKeyName);

    const query = `delete from ${name} where ${primaryKeyName} = ${primaryKeyValue}`;

    await pool.query(query);

    redirect(`/table/${name}`);
  }

  async function editAction(formData: FormData) {
    "use server";

    const schema = process.env.SCHEMA_NAME as string;

    let primaryKeyName = "";
    let primaryKeyValue = null;

    switch (name) {
      case "personel":
        primaryKeyName = "inn";
        primaryKeyValue = formData.get("inn");
        break;
      case "rooms":
        primaryKeyName = "number";
        primaryKeyValue = formData.get("number");
        break;
      case "available_rooms":
        primaryKeyName = "number";
        primaryKeyValue = formData.get("number");
        break;
      case "hotel_occupancy":
        primaryKeyName = "hotel_name";
        primaryKeyValue = formData.get("hotel_name");
        break;
      default:
        primaryKeyName = "id";
        primaryKeyValue = formData.get("id");
    }

    let query = `update ${schema}.${name} set `;
    const values: (string | number)[] = [];

    for (const [key, value] of formData.entries()) {
      if (value === "") {
        continue;
      }

      query += `${key} = $${values.length + 1}, `;
      values.push(value as string);
    }

    query = query.slice(0, -2);

    query += ` where ${primaryKeyName} = $${values.length + 1}`;
    values.push(primaryKeyValue as string);

    await pool.query(query, values);

    redirect(`/table/${name}`);
  }

  const columns = await getColumns();

  return (
    <main className="container mx-auto">
      <Filter columns={columns} />
      <Table name={name} columns={columns} data={await getData()} deleteAction={deleteAction} editAction={editAction}/>
    </main>
  );
}
