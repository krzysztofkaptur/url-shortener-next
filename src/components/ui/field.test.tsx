import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { FieldError, FieldLabel } from './field'

test('links the label to its input', () => {
  render(<FieldLabel htmlFor="link">Link</FieldLabel>)

  expect(screen.getByText('Link')).toHaveAttribute('for', 'link')
})

test('shows a single error message', () => {
  render(<FieldError errors={[{ message: 'Required' }]} />)

  expect(screen.getByRole('alert')).toHaveTextContent('Required')
})

test('lists each distinct error', () => {
  render(
    <FieldError errors={[{ message: 'Too short' }, { message: 'Invalid link' }]} />,
  )

  expect(screen.getByRole('list')).toHaveTextContent('Too short')
  expect(screen.getByRole('list')).toHaveTextContent('Invalid link')
})

test('renders nothing when there is no error', () => {
  const { container } = render(<FieldError errors={[]} />)

  expect(container).toBeEmptyDOMElement()
})
