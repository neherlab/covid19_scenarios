export const createNonExistingElement = (id: string, type = 'div') => {
  let element = document.getElementById(id)

  if (!element) {
    element = document.createElement(type)
    element.setAttribute('id', id)
    document.body.append(element)
  }
}
