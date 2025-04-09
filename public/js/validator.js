function validator(errorsMap, fields) {
  fields.map(e => {
    const validationMessageForField = document.getElementById(e.path + 'Error')

    if (errorsMap.some(error => error.path === e.path)) {
      validationMessageForField.textContent = errorsMap.find(error => error.path === e.path).msg
    } else {
      validationMessageForField.textContent = ''
    }
  })
}