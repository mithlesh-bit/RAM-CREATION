function uploadImage() {
  
  const fileInput = document.getElementById("imageInput");
  const imagePreview = document.getElementById("imagePreview");

  const file = fileInput.files[0];

  if (file) {
    const reader = new FileReader();

    reader.onload = function (e) {
      const imageUrl = e.target.result;
      imagePreview.innerHTML = `<img src="${imageUrl}" alt="Uploaded Image" />`;
    };

    reader.readAsDataURL(file);
  } else {
    alert("Please select an image.");
  }
}
