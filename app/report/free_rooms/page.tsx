import { pool } from "@/lib/pg";
import Table from "../Table";
import { TableSchema } from "@/types/schema";
import DateSelector from "../DateSelector";
import Filter from "@/app/table/[name]/Filter";
import Sort from "@/app/table/[name]/Sort";

export default async function FreeRooms({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined; }>;
}) {
  async function getData(): Promise<TableSchema[]> {
    const schema = process.env.SCHEMA_NAME as string;

    const params = await searchParams;

    if (!params.date) {
      return [];
    }

    let query = `
      select r.number, r.description, r.spaces, r.price_per_day
      from ${schema}.rooms r
      left join ${schema}.visitors v
      on r.number = v.room_number and $1 between v.check_in_date and v.departure_date
      where v.room_number is null and r.status = 'working'
    `;

    const values: string[] = [params.date as string];
    let whereClause = "";
    let orderByClause = "";

    if (Object.keys(params).length > 0) {
      const filterConditions = Object.keys(params).map((key) => {
        if (key === "sortBy" || key === "sortOrder" || key === "date") {
          return null;
        }

        values.push(params[key] as string);
        return `${key} = $${values.length}`;
      }).filter(condition => condition !== null);

      if (filterConditions.length > 0) {
        whereClause = " and " + filterConditions.join(" and ");
      }
    }

    if (params.sortBy && params.sortOrder) {
      orderByClause = ` order by ${params.sortBy} ${params.sortOrder}`;
    }

    query += whereClause + orderByClause;

    const result = await pool.query(query, values);

    return result.rows;
  }

  const columns = [
    { column_name: "number" },
    { column_name: "description" },
    { column_name: "spaces" },
    { column_name: "price_per_day" }
  ]

  return (
    <>
      <section className="flex flex-col gap-4 mb-4">
        <DateSelector />
        <Filter columns={columns} />
        <Sort columns={columns} />
      </section>
      <Table columns={columns} data={await getData()} pkey="number" />
    </>
  )
}
