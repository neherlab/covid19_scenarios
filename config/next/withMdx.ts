import withMDX from '@next/mdx'

import remarkImages from 'remark-images'
import remarkMath from 'remark-math'
import remarkSmartypants from '@silvenon/remark-smartypants'
import rehypeKatex from 'rehype-katex'

export default withMDX({
  extension: /\.mdx?$/,
  options: {
    remarkPlugins: [
      [remarkImages, {}],
      [remarkMath, {}],
      [remarkSmartypants, { quotes: false, backticks: false, ellipses: false, dashes: 'oldschool' }],
    ],
    rehypePlugins: [rehypeKatex],
  },
})
