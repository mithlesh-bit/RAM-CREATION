// login ke liye

function handleLoginFormSubmission() {
  const form = document.getElementById("loginForm");

  const loginnowtext = document.querySelector("#loginnowtext");
  loginnowtext.innerHTML = `<span class="loader"></span>`;
  loginnowtext.disabled = true;
  const email = form.querySelector('input[name="email"]').value;
  const password = form.querySelector('input[name="pass"]').value;

  fetch("/login", {
    method: "POST",
    body: JSON.stringify({ email, password }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      console.log(data.success);
      if (data.success) {
        Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message,
        }).then(() => {
          window.location.href = "/";
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message,
        });
      }
      loginnowtext.innerHTML = "Login Now";
      loginnowtext.disabled = false;
    });
}
