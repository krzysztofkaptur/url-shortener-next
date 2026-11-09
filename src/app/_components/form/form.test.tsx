import { render, screen, waitFor } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { beforeEach, expect, test, vi } from 'vitest'
import { Form } from './form'

const createLink = vi.hoisted(() => vi.fn())

// Server action writes to the database. These tests only cover the form.
vi.mock('./createLink.action', () => ({
  createLink,
}))

beforeEach(() => {
  createLink.mockReset()
  createLink.mockResolvedValue({ success: true })
})

test('renders the link field and submit button', () => {
  render(<Form />)

  expect(screen.getByLabelText('Link')).toBeInTheDocument()
  expect(screen.getByRole('button', { name: 'Submit finally' })).toBeInTheDocument()
})

test('shows a validation error and does not save an empty link', async () => {
  const user = userEvent.setup()
  render(<Form />)

  await user.click(screen.getByRole('button', { name: 'Submit finally' }))

  expect(await screen.findByRole('alert')).toHaveTextContent(
    'Too small: expected string to have >=1 characters',
  )
  expect(createLink).not.toHaveBeenCalled()
})

test('saves the link that was entered', async () => {
  const user = userEvent.setup()
  render(<Form />)

  await user.type(screen.getByLabelText('Link'), 'https://example.com')
  await user.click(screen.getByRole('button', { name: 'Submit finally' }))

  await waitFor(() => {
    expect(createLink).toHaveBeenCalledWith({
      originalUrl: 'https://example.com',
    })
  })
})
