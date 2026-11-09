import { render, screen } from '@testing-library/react'
import { expect, test } from 'vitest'
import { Button } from './button'

test('renders its label', () => {
  render(<Button>Save</Button>)

  expect(screen.getByRole('button', { name: 'Save' })).toBeInTheDocument()
})

test('can be disabled', () => {
  render(<Button disabled>Save</Button>)

  expect(screen.getByRole('button', { name: 'Save' })).toBeDisabled()
})

test('forwards the button type', () => {
  render(<Button type="button">Cancel</Button>)

  expect(screen.getByRole('button', { name: 'Cancel' })).toHaveAttribute('type', 'button')
})
