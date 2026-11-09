import { redirect } from 'next/navigation';
import db from '@/lib/db'
import { linksTable } from '@/lib/db/schemas';
import { eq } from 'drizzle-orm';

type DetailsPageProps = {
    params: Promise<{ id: string }>;
};

export default async function DetailsPage({ params }: DetailsPageProps) {
    // await db.select()
    const { id } = await params;
    const link = `https://shor.ty/${id}`

    const result = await db.select().from(linksTable).where(eq(linksTable.shortUrl, link))

    if (result.length) {
        redirect(result[0]?.originalUrl)
    }
    return <h1>resource with id <strong>{id}</strong> does not exist</h1>
}