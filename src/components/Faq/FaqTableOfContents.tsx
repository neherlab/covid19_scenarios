/* eslint-disable @typescript-eslint/no-unsafe-assignment */
import React, { useState, useEffect } from 'react'

import { get } from 'lodash'

// FIXME: this has t be refactored. Remove DOM manipulation,
//  reliance on HTML content, forEach() should be a map
const FaqTableOfContents = () => {
  const [content, setContent] = useState<string[]>([])
  useEffect(() => {
    const links: string[] = []
    setTimeout(() => {
      Array.from(document.querySelectorAll('strong')).forEach((node) => {
        if (node.innerHTML === 'Q:') {
          node.id = `q${links.length}`
          const textContent = get(node, 'parentNode.lastChild.textContent')
          if (textContent) {
            links.push(textContent)
          }
        }
      })
      setContent(links)
    }, 0)
  }, [])
  return (
    <ol>
      {content.map((question, idx) => (
        <li key={question}>
          <a href={`#q${idx}`}>{question}</a>
        </li>
      ))}
    </ol>
  )
}

export default FaqTableOfContents
