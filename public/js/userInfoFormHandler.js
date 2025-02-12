document.getElementById('loadingIndicator').style.display = 'none'

document.getElementById('userInfo').addEventListener('submit', async function(e) {
  e.preventDefault()
  document.getElementById('loadingIndicator').style.display = 'block'

  const form = e.target
  const formData = new FormData(form)

  try {
    const response = await axios({
      url: this.action,
      method: this.method,
      data: Object.fromEntries(formData),
    })

    if (response.data.success) {
      showAlert('success', response.data.message)
    } else if (response.data.error) {
      showAlert('danger', response.data.error)
    }
  
  } catch (err) {
    showAlert('danger', 'An unexpected error occurred.')
  } finally {
    document.getElementById('loadingIndicator').style.display = 'none'
  }
})