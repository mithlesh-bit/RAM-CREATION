
  
  // login ke liye
  
  
  function profilesubmi() {
  
    const form = document.getElementById('profileForm');
    const name = form.querySelector('input[name="name"]').value;
    const email = form.querySelector('input[name="email"]').value;
    const password = form.querySelector('input[name="money"]').value;
  
    fetch('/profile', {
      method: 'POST',
      body: JSON.stringify({ name,email,money }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
      .then(response => response.json())
      .then(data => {
        console.log(data.success);
        if (data.success) {
          Swal.fire({
            icon: 'success',
            title: 'Success',
            text: data.message
          }).then(() => {
            window.location.href = '/';
          });
        } else {
          Swal.fire({
            icon: 'error',
            title: 'Error',
            text: data.message
          });
        }
        loginnowtext.innerHTML = "Login Now"
        loginnowtext.disabled = false;
      });
  }
  
  