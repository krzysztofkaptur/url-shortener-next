import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { expect, test } from 'vitest'
import { Input } from './input'

test('shows its placeholder', () => {
  render(<Input aria-label="Link" placeholder="https://...." />)

  expect(screen.getByRole('textbox', { name: 'Link' })).toHaveAttribute(
    'placeholder',
    'https://....',
  )
})

test('accepts typed text', async () => {
  const user = userEvent.setup()
  render(<Input aria-label="Link" />)

  const input = screen.getByRole('textbox', { name: 'Link' })
  await user.type(input, 'https://example.com')

  expect(input).toHaveValue('https://example.com')
})
