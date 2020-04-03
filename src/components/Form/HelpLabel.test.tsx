import React from 'react'
import { render } from '@testing-library/react'
import HelpLabel from './HelpLabel'

describe('HelpLabel', () => {
  it('displays the label', () => {
    const { getByText } = render(<HelpLabel identifier="abc" label="def" />)

    expect(getByText('def')).not.toBeNull()
  })

  it('displays a help button', () => {
    const { getByLabelText } = render(<HelpLabel identifier="abc" label="def" help="ghi" />)

    expect(getByLabelText('help')).not.toBeNull()
  })
})
