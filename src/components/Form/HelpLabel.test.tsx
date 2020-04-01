import React from 'react'
import { render } from '@testing-library/react'
import HelpLabel from './HelpLabel'
import { help } from './FormHelpButton'

describe('HelpLabel', () => {
  it('displays the label', () => {
    const { getByText } = render(<HelpLabel identifier="abc" label="def" help={help('hij')} />)

    expect(getByText('def')).not.toBeNull()
  })

  it('displays a help button', () => {
    const { getByLabelText } = render(<HelpLabel identifier="abc" label="def" help={help('hij')} />)

    expect(getByLabelText('help')).not.toBeNull()
  })
})
