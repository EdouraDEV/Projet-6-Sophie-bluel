const form = document.getElementById("form-log");

// Ajouter un écouteur d'événement à la soumission du formulaire
form.addEventListener("submit", async (event) => {
  // Empêcher la soumission du formulaire par défaut
  event.preventDefault();

  // Récupérer les valeurs des champs de formulaire
  const email = document.getElementById("email").value;
  const password = document.getElementById("password").value;

  // Envoyer une requête POST à l'API de connexion
  const response = await fetch("http://localhost:5678/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      email: email,
      password: password,
    }),
  });
  if (response.ok) {
    const data = await response.json();
    console.log(data);
    // Stocker le token dans la session locale
    localStorage.setItem("monToken", data.token);
    window.location.href = "./index.html";
  } else {
    const passwordInput = document.getElementById("password");
    passwordInput.classList.add("incorrect-password");
    event.preventDefault();
    setTimeout(function () {
      passwordInput.classList.remove("incorrect-password");
      console.error("Erreur lors de la connexion");
      window.alert("Mauvais mot de passe, veuillez réessayer !");
    }, 300);
  }
});
