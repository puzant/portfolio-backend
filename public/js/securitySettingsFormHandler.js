const loadingIndicator = document.getElementById('securityLoadingIndicator')
loadingIndicator.style.display = 'none'

document.getElementById('securitySettings').addEventListener('submit', async function(e) {
  e.preventDefault()
  loadingIndicator.style.display = 'block'

  const form = e.target
  const formData = new FormData(form)

  try {
    const response = await axios({
      url: this.action,
      method: this.method,
      data: Object.fromEntries(formData)
    })

    if (response.data.success) {
      showAlert('success', response.data.message)
    }
  } catch (err) {
    console.log(err)
    showAlert('danger', err.response.data.message)
  } finally {
    loadingIndicator.style.display = 'none'
  }
})