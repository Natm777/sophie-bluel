// Sélection du formulaire
const form = document.querySelector("form");
const errorMessage = document.getElementById("error-message");

// Ajout de l'écouteur d'événement pour l'envoi du formulaire
form.addEventListener("submit", async function (event) { 
    event.preventDefault(); // Empêche le comportement par défaut du formulaire

    // Création de l'objet utilisateur avec les valeurs des champs email et mot de passe récupérées depuis le formulaire soumis
    const utilisateur = {
        email: event.target.querySelector("[name=email]").value,
        password: event.target.querySelector("[name=password]").value,
    };
    
    const chargeUtile = JSON.stringify(utilisateur);

    try {
        // Envoyer la requête POST avec fetch
        const response = await fetch("http://localhost:5678/api/users/login", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: chargeUtile
        });

        // Gestion des erreurs de connexion
        if (!response.ok) {
            if (response.status === 401 || response.status === 404) {
                errorMessage.textContent = "Les informations de connexion sont invalides. Veuillez réessayer.";
                errorMessage.style.display = "block";
                throw new Error("Identifiants incorrects.");
            } else {
                throw new Error("Erreur inattendue.");
            }
        }

        // Si la réponse est OK, récupérer les données JSON
        const data = await response.json();

        // Stocker le token et rediriger
        localStorage.setItem("token", data.token);
        window.location.href = "index.html"; // Redirection vers l'accueil
    } catch (error) {
        console.error("Erreur:", error);
    }
});
