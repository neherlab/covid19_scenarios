/**
 *
 * This dangerously and unreliably patches some of the node_modules. Mostly cosmetic stuff.
 * Do no use this to fix bugs or introduce features. Consider contributing to the upstream project instead.
 *
 */
import fs from 'fs-extra'

export async function replace(filename: string, searchValue: string, replaceValue = '') {
  const content = await fs.readFile(filename, 'utf-8')
  const newContent = content.replace(searchValue, replaceValue)
  await fs.writeFile(filename, newContent, { encoding: 'utf-8' })
}

export async function main() {
  await Promise.all([
    // Removes warning "Anonymous function declarations cause Fast Refresh to not preserve local component state.
    // Please add a name to your function.".
    // Reason: https://github.com/vercel/next.js/issues/15696
    replace(
      'node_modules/next/dist/build/babel/plugins/no-anonymous-default-export.js',
      `warn=onWarning`,
      `warn=function(){}`,
    ),

    // Removes warning "<title> should not be used in _document.js".
    // Reason: We want title and other SEO tags to be pre-rendered, so that crawlers could find them.
    replace(
      'node_modules/next/dist/pages/_document.js',
      `console.warn("Warning: <title> should not be used in _document.js's <Head>. https://err.sh/next.js/no-document-title");`,
    ),
  ])
}

main().catch(console.error)
