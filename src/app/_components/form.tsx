'use client'

import { useForm } from 'react-hook-form'
import * as z from 'zod'
import {
    Field,
    FieldError,
    FieldGroup,
    FieldLabel,
    FieldSet,
} from "@/components/ui/field"
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { zodResolver } from '@hookform/resolvers/zod';

const FormSchema = z.object({
    link: z.string().min(1).max(100)
})

type FormType = z.infer<typeof FormSchema>

export const Form = () => {
    const { handleSubmit, register, formState: { errors } } = useForm<FormType>({
        defaultValues: {
            link: ''
        },
        resolver: zodResolver(FormSchema)
    })

    const onSubmit = handleSubmit((values) => {
        console.log({ values })
    })

    return <form onSubmit={onSubmit}>
        <FieldSet>
            <FieldGroup>
                <Field>
                    <FieldLabel htmlFor="link">Link</FieldLabel>
                    <Input id="link" autoComplete="off" placeholder="https://...." {...register('link')} />
                    {
                        errors?.link?.message && <FieldError>{errors?.link?.message}</FieldError>
                    }
                </Field>
            </FieldGroup>
            <Button type="submit">Submit</Button>
        </FieldSet>
    </form>
}