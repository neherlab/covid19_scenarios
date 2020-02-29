import React from 'react'

import { fireEvent, render } from '@testing-library/react'
import { createBrowserHistory } from 'history'
import { BrowserRouter, Router } from 'react-router-dom'

import NavigationLink from '../NavigationLink'

test('renders with child text', () => {
  const text = 'Hello!'
  const url = '/hello'

  const { getByText, container } = render(
    <BrowserRouter>
      <NavigationLink content={text} url={url} />
    </BrowserRouter>,
  )

  expect(getByText(text)).toBeTruthy()

  expect(container.querySelector('a'))
    .toBeTruthy()
    .toHaveAttribute('href', url)
    .toHaveTextContent(text)
})

test('renders with child component', () => {
  const text = 'Hello!'
  const url = '/hello'
  const Component = () => <div>{text}</div>

  const { getByText, container } = render(
    <BrowserRouter>
      <NavigationLink content={<Component />} url={url} />
    </BrowserRouter>,
  )
  expect(getByText(text)).toBeTruthy()

  expect(container.querySelector('a'))
    .toBeTruthy()
    .toHaveAttribute('href', url)

  expect(container.querySelector('a > div'))
    .toBeTruthy()
    .toHaveTextContent(text)
})

test('navigates on click', () => {
  const text = 'Hello!'
  const url = '/hello'
  const history = createBrowserHistory()

  const { getByText } = render(
    <Router history={history}>
      <NavigationLink content={text} url={url} />
    </Router>,
  )

  fireEvent.click(getByText(text))

  expect(history.location.pathname).toBe(url)
})
