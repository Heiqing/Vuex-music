export function hasClass(el, className) {
  let reg = new RegExp('(^|\\s)' + className + '(\\s|$)')
  return reg.test(el.className)
}

export function addClass(el, className) {
  if (hasClass(el, className)) {
    return
  }

  // ["class1"]["class2"]
  let newClass = el.className.split(' ')
  // ["class1","class2"]
  newClass.push(className)
  // "class1 class2"
  el.className = newClass.join(' ')
}
