document.getElementById('loadingIndicator').style.display = 'none'

    document.getElementById('userInfo').addEventListener('submit', async function(e) {
      e.preventDefault()
      document.getElementById('loadingIndicator').style.display = 'block'

      const form = event.target
      const formData = new FormData(form)

      try {
        const response = await fetch(this.action, {
          method: this.method,
          body: JSON.stringify(Object.fromEntries(formData)),
          headers: { "Content-Type": "application/json" }
        })

        const result = await response.json()
        if (result.success) {
          showAlert('success', result.message)
        } else if (data.error) {
          showAlert('danger', data.error)
        }

      } catch (err) {
        showAlert('danger', 'An unexpected error occurred.')
      } finally {
        document.getElementById('loadingIndicator').style.display = 'none'
      }
    })