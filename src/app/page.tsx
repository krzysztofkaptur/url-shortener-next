import { linksTable } from "@/lib/db/schemas";
import { Form } from "./_components/form";
import db from '@/lib/db'

export default async function Home() {
  const linksData = await db.select().from(linksTable)

  console.log({ linksData })

  return (
    <div>
      <main>
        <Form />
      </main>
    </div>
  );
}
