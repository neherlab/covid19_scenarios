import React from 'react'

export default function PrintPageSeparatorHack() {
  return (
    <>
      <div className="p-break-after d-none d-print-block">
        <p style={{ color: 'white' }}>white text not to be displayed</p>
      </div>
      <div className="d-none d-print-block">
        <p style={{ marginTop: 20, color: 'white' }}>another white text not to be displayed</p>
      </div>
    </>
  )
}
