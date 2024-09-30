// Sélection du formulaire
const form = document.querySelector("form");
const errorMessage = document.getElementById("error-message");


// Ajout de l'écouteur d'événement pour l'envoi du formulaire
form.addEventListener("submit", function (event) {
    event.preventDefault(); // Empêche le comportement par défaut du formulaire


    // Création de l'objet utilisateur avec les valeurs des champs email et mot de passe
    // récupérées depuis le formulaire soumis (en utilisant les attributs "name").     
    const utilisateur = {
        email: event.target.querySelector("[name=email").value,
        password: event.target.querySelector("[name=password]").value,
    }; 
    
    const chargeUtile = JSON.stringify(utilisateur)

    // Envoyer la requête POST avec fetch
    fetch("http://localhost:5678/api/users/login", {
        method: "POST",
        headers: {"Content-Type": "application/json"},
        body: chargeUtile
    })
        .then(function (response) {
            if (response.ok) {
                return response.json(); // Convertir la réponse en JSON
            } else if (response.status === 401 || response.status === 404) {
                // Afficher le message d'erreur
                errorMessage.textContent = "Les informations de connexion sont invalides. Veuillez réessayer.";
                errorMessage.style.display = "block"; // Affiche le message d'erreur
                throw new Error("Identifiants incorrects.");
            } else {
                throw new Error("Erreur inattendue.");
            }
        })
        .then(function (data) {
            // Si la réponse est OK, on redirige vers la page d'accueil
            alert("Connexion réussie !");
            localStorage.setItem("token", data.token); // Stocker le token pour les futures requêtes
            window.location.href = "index.html"; // Redirection vers l'accueil
        })

});
