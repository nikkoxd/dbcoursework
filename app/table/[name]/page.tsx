import { pool } from "@/lib/pg";
import Table from "./Table";
import Filter from "./Filter";
import { AvailableRoom, Hotel, HotelOccupancy, Personel, Room, TableSchema } from "@/types/schema";
import { redirect } from "next/navigation";
import Sort from "./Sort";

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
    let orderByClause = "";

    const filters = await searchParams;

    if (Object.keys(filters).length > 0) {
      const filterConditions = Object.keys(filters).map((key) => {
        if (key === "sortBy" || key === "sortOrder") {
          return null;
        }

        values.push(filters[key] as string);
        return `${key} = $${values.length}`;
      }).filter(condition => condition !== null);

      if (filterConditions.length > 0) {
        whereClause = " where " + filterConditions.join(" and ");
      }
    }

    if (filters.sortBy && filters.sortOrder) {
      orderByClause = ` order by ${filters.sortBy} ${filters.sortOrder}`
    }

    query += whereClause + orderByClause;

    console.log(query);

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

  async function createAction(formData: FormData) {
    "use server";

    const values: string[] = [];
    const keys: string[] = [];
    const placeholders: string[] = [];

    for (const [key, value] of formData.entries()) {
      if (value === "") {
        continue;
      }

      keys.push(key);
      values.push(value as string);
      placeholders.push(`$${values.length}`);
    }

    const query = `INSERT INTO ${name} (${keys.join(', ')}) VALUES (${placeholders.join(', ')})`;

    console.log(query);

    await pool.query(query, values);

    redirect(`/table/${name}`);
  }

  const columns = await getColumns();

  return (
    <main className="container mx-auto">
      <section className="flex flex-col gap-4">
        <Filter columns={columns} />
        <Sort columns={columns} />
      </section>
      <section className="pt-4">
        <Table name={name} columns={columns} data={await getData()} deleteAction={deleteAction} editAction={editAction} createAction={createAction} />
      </section>
    </main>
  );
}
