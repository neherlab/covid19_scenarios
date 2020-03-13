import React from 'react'

import Status from '../components/Router/Status'

import './NotFound.scss'

function NotFound() {
  return (
    <Status code={404}>
      <h1 className="h1-notfound">{'Not found'}</h1>
      <h3 className="text-center h3-notfound">{'Ooops! This page does not exist'}</h3>
    </Status>
  )
}

export default NotFound
