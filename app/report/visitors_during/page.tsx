import { pool } from "@/lib/pg";
import Table from "../Table";
import { TableSchema } from "@/types/schema";
import DurationSelector from "../DurationSelector";

export default async function VisitorsDuring({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined; }>;
}) {
  async function getData(): Promise<TableSchema[]> {
    const schema = process.env.SCHEMA_NAME as string;

    const params = await searchParams;

    if (!params.from || !params.to) {
      return [];
    }
    
    console.log(params.from, params.to);

    const result = await pool.query(`
        select count(*) 
        from ${schema}.visitors 
        where check_in_date <= $1 and departure_date >= $2
      `,
      [params.from, params.to]);

    return result.rows;
  }

  const columns = [
    { column_name: "count" }
  ]

  return (
    <>
      <section className="flex flex-col gap-4 mb-4">
        <DurationSelector />
      </section>
      <Table columns={columns} data={await getData()} pkey="count" />
    </>
  )
}
