import React from 'react'
import { connect } from 'react-redux'

export interface MainProps {}

function Main({}: MainProps) {
  const canRun = false

  return (
    <div>
      <div>
        <p>{`Hello`}</p>
      </div>

      <div>
        <button type="submit" disabled={!canRun} onClick={() => {}}>
          Run
        </button>
      </div>
    </div>
  )
}

export default Main
