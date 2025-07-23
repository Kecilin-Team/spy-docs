(function() {
  var PASSWORD = "assistx@123"; // Change this to your desired password
  var STORAGE_KEY = "spy_docs_authenticated";

  function showContent() {
    document.body.style.display = "";
  }

  function hideContent() {
    document.body.style.display = "none";
  }

  function promptPassword() {
    var input = window.prompt("Enter password to access this site:");
    if (input === PASSWORD) {
      localStorage.setItem(STORAGE_KEY, "true");
      showContent();
    } else {
      hideContent();
      alert("Incorrect password.");
      promptPassword();
    }
  }

  if (localStorage.getItem(STORAGE_KEY) === "true") {
    showContent();
  } else {
    hideContent();
    window.addEventListener("DOMContentLoaded", promptPassword);
  }
})();
