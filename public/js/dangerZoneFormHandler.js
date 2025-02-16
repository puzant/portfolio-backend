const dangerZoneLoading = document.getElementById('dangerZoneLoadingIndicator')
dangerZoneLoading.style.display = 'none'

document.getElementById('dangerZone').addEventListener('submit', async function(e) {
  e.preventDefault()
  dangerZoneLoading.style.display = 'block'

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