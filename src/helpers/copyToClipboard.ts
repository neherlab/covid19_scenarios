export const copyToClipboard = (str: string) => {
  const el = document.createElement('textarea')
  el.value = str
  document.body.append(el)
  el.select()
  document.execCommand('copy')
  el.remove()
}
