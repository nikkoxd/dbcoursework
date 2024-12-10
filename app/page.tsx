import { pool } from "@/lib/pg";
import TableSelector from "./TableSelector";

export default async function Home() {
  async function getTables(): Promise<{ table_name: string }[]> {
    const schema = process.env.SCHEMA_NAME as string;

    const result = await pool.query("select table_name from information_schema.tables where table_schema = $1", [schema]);

    return result.rows;
  }

  return (
    <>
      <header className="container mx-auto py-4 flex gap-2">
        Таблица:
        <TableSelector tables={await getTables()} />
      </header>
    </>
  );
}
