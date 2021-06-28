const SelectText = (node) => {
  let range
  if (document.body.createTextRange) {
    range = document.body.createTextRange()
    range.moveToElementText(node)
    range.select()
  } else if (window.getSelection) {
    const selection = window.getSelection()
    range = document.createRange()
    range.selectNodeContents(node)
    selection.removeAllRanges()
    selection.addRange(range)
  }
}

const ShallowEqual = (object1, object2) => {
  const keys1 = Object.keys(object1)
  const keys2 = Object.keys(object2)

  if (keys1.length !== keys2.length) {
    return false
  }

  for (const key of keys1) {
    if (object1[key] !== object2[key]) {
      return false
    }
  }

  return true
}

const CopyInto = (objectInto, objectFrom) => {
  Object.keys(objectFrom).forEach(key => {
    objectInto[key] = objectFrom[key]
  })
}

const ImagePath = (image) => {
  return image.substr(0, 4) === 'http' ? image : 'graphics/' + image
}

const ParseVariables = (str, data) => {
  var reg = /\{\{(.*?)\}\}/g
  let found = reg.exec(str)
  while (found) {
    if (data[found[1]] !== undefined) {
      str = str.replace(found[0], data[found[1]])
    } else {
      str = str.replace(found[0], '--')
    }
    found = reg.exec(str)
  }
  return str
}

export default {
  SelectText,
  ShallowEqual,
  CopyInto,
  ImagePath,
  ParseVariables
}
