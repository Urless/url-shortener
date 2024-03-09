document.getElementById("copy").addEventListener("click", (event) => {
  let copyText = document.getElementById("short-url");
  navigator.clipboard.writeText(copyText.innerText);
});
