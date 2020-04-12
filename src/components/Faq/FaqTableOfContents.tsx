import React, { useState, useEffect } from 'react'

// FIXME: this has t be refactored. Remove DOM manipulation,
//  reliance on HTML content, forEach() should be a map
const FaqTableOfContents = () => {
  const [content, setContent] = useState<string[]>([])
  useEffect(() => {
    const links: string[] = []
    setTimeout(() => {
      // eslint-disable-next-line unicorn/prefer-spread
      Array.from(document.querySelectorAll('strong')).forEach((node) => {
        if (node.innerHTML === 'Q:') {
          // eslint-disable-next-line no-param-reassign
          node.id = `q${links.length}`
          links.push(node.parentNode.lastChild.textContent)
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
