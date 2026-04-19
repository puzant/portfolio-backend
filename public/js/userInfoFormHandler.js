document.getElementById('loadingIndicator').style.display = 'none'

document.getElementById('userInfo').addEventListener('submit', async function(e) {
  e.preventDefault()
  document.getElementById('loadingIndicator').style.display = 'block'

  const form = e.target
  const formData = new FormData(form)

  try {
    const response = await api({
      url: this.action,
      method: this.method,
      data: Object.fromEntries(formData),
    })

    if (response.success) {
      showAlert('success', response.message)
    }
  } catch (err) {
    showAlert('danger', 'An unexpected error occurred.')
  } finally {
    document.getElementById('loadingIndicator').style.display = 'none'
  }
})