import { pool } from "@/lib/pg";
import Table from "../Table";
import { TableSchema } from "@/types/schema";
import DateSelector from "../DateSelector";

export default async function FreeOccupiedRooms({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined; }>;
}) {
  async function getData(): Promise<TableSchema[]> {
    const schema = process.env.SCHEMA_NAME as string;

    const params = await searchParams;

    const result = await pool.query(`select
     (select count(*) from ${schema}.rooms where status = 'working') as total_rooms,
       (select count(*)
        from ${schema}.rooms r
        left join ${schema}.visitors v on r.number = v.room_number and $1 between v.check_in_date and v.departure_date
        where v.room_number is null and r.status = 'working') as free_rooms,
          (select count(*)
           from ${schema}.rooms r
           join ${schema}.visitors v on r.number = v.room_number and $1 between v.check_in_date and v.departure_date
           where r.status = 'working') as occupied_rooms;
     `,
     [params.date]);

    return result.rows;
  }

  const columns = [
    { column_name: "total_rooms" },
    { column_name: "free_rooms" },
    { column_name: "occupied_rooms" },
  ]

  return (
    <>
      <section className="flex flex-col gap-4 mb-4">
        <DateSelector />
      </section>
      <Table columns={columns} data={await getData()} pkey="total_rooms" />
    </>
  )
}
