import React, { useState, useEffect } from 'react'

const FaqTableOfContents = () => {
  const [content, setContent] = useState<string[]>([])
  useEffect(() => {
    const links: string[] = []
    setTimeout(() => {
      Array.from(document.querySelectorAll('strong')).forEach((node) => {
        if (node.innerHTML === 'Q:') {
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
        <li key={idx}>
          <a href={`#q${idx}`}>{question}</a>
        </li>
      ))}
    </ol>
  )
}

export default FaqTableOfContents
