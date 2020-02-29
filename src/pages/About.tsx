import React from 'react'

import './About.scss'

import LinkExternal from '../components/Router/LinkExternal'

const About: React.FC = () => {
  return (
    <>
      <h1 className="h1-about">{'About COVID-19 Scenarios'}</h1>

      <p>
        {`In publishing and graphic design, Lorem ipsum is a placeholder text commonly used to demonstrate the visual form of a document without relying on meaningful content (also called greeking). Replacing the actual content with placeholder text allows designers to design the form of the content before the content itself has been produced.`}
      </p>

      <p>
        {`Lorem ipsum, or lipsum as it is sometimes known, is dummy text used
        in laying out print, graphic or web designs. The passage is attributed
        to an unknown typesetter in the 15th century who is thought to have
        scrambled parts of Cicero's De Finibus Bonorum et Malorum for use in
        a type specimen book. It usually begins with:`}
      </p>

      <p>
        {`The lorem ipsum text is typically a scrambled section of De finibus bonorum et malorum, a 1st-century BC Latin text by Cicero, with words altered, added, and removed to make it nonsensical, improper Latin.`}
      </p>

      <p>
        {`A variation of the ordinary lorem ipsum text has been used in typesetting since the 1960s or earlier, when it was popularized by advertisements for Letraset transfer sheets. It was introduced to the information age in the mid-1980s by Aldus Corporation, which employed it in graphics and word-processing templates for its desktop publishing program PageMaker. Many popular word processors use this format as a placeholder. Some examples are Pages or Microsoft Word.`}
      </p>

      <h2>Example text</h2>

      <p>{`A common form of lorem ipsum reads:`}</p>

      <blockquote className="blockquote">
        <p>
          {`"Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum."`}
        </p>
      </blockquote>

      <p>
        {'Source: '}
        <LinkExternal url={'https://en.wikipedia.org/wiki/Lorem_ipsum'}>
          https://en.wikipedia.org/wiki/Lorem_ipsum
        </LinkExternal>
      </p>
    </>
  )
}

export default About
