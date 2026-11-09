'use server'

import { z } from 'zod'
import db from '@/lib/db'
import { linksTable } from '@/lib/db/schemas'

const schema = z.object({
    originalUrl: z.string(),
})

export async function createLink(values: z.infer<typeof schema>) {
    // TODO: check session
    const valid = schema.safeParse(values)

    if (!valid.success) {
        return { success: false, message: 'Invalid input' }
    }

    const shortUrl = `https://shor.ty/${crypto.randomUUID()}`

    await db.insert(linksTable).values({
        originalUrl: values.originalUrl,
        shortUrl
    })

    return { success: true }
}