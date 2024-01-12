function registerhandle() {
  const form = document.getElementById("registrationForm");

  const name = form.querySelector('input[name="name"]').value;
  const email = form.querySelector('input[name="email"]').value;
  const password = form.querySelector('input[name="password"]').value;
  const confirmPassword = form.querySelector(
    'input[name="confirmPassword"]'
  ).value;
  const userDetailsDiv = document.getElementById("userDetails"); // Get the userDetails div

  fetch("/", {
    method: "POST",
    body: JSON.stringify({
      name: name,
      email: email,
      password: password,
      confirmPassword: confirmPassword,
    }),
    headers: {
      "Content-Type": "application/json",
    },
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        // Update the userDetails div with user details
        userDetailsDiv.innerHTML = `
          <p>Name: ${data.user.name}</p>
          <p>Email: ${data.user.email}</p>
        `;
        Swal.fire({
          icon: "success",
          title: "Success",
          text: data.message,
        });
      } else {
        Swal.fire({
          icon: "error",
          title: "Error",
          text: data.message,
        });
      }
    });
}

// login ke liye

function handleLoginFormSubmission() {
  const form = document.getElementById("loginForm");

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
          window.location.href = "profile";
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
