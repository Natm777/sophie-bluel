const filterContainer = document.querySelector(".filters");
let projets = [];

async function getProjets() {
    const response = await fetch('http://localhost:5678/api/works');
    projets = await response.json();

    createProjets();
    createButtonsFilter(); 
}

function createProjets() {
    const sectionGallery = document.querySelector(".gallery");
    sectionGallery.innerHTML = ''; 

    for (let i = 0; i < projets.length; i++) {
        const projet = projets[i];
        const projetElement = document.createElement("figure");
        projetElement.dataset.categoryId = projet.categoryId; 

        const imageElement = document.createElement("img");
        imageElement.src = projet.imageUrl;

        const captionElement = document.createElement("figcaption");
        captionElement.innerText = projet.title;

        projetElement.appendChild(imageElement);
        projetElement.appendChild(captionElement);
        sectionGallery.appendChild(projetElement);
    }
}

async function createButtonsFilter(works) {
   const response = await fetch('http://localhost:5678/api/categories');
   const categories = await response.json();
   
   filterContainer.innerHTML = '';
    //Création du bouton "Tous"
    const allCategories = document.createElement('button');
    allCategories.classList.add("filter-btn");
    allCategories.innerHTML = "Tous";
    filterContainer.appendChild(allCategories);
    allCategories.addEventListener("click", () => {
        const projets = document.querySelectorAll(".gallery figure"); 
        for (let i = 0; i < projets.length; i++) {
            projets[i].classList.remove("hidden");
        }
    });
    
    // Création des autres boutons
    for (let i = 0; i < categories.length; i++) {
        const category = categories[i];
        const button = document.createElement("button");
        button.classList.add("filter-btn");
        button.innerHTML = category.name;
        button.dataset.categoryId = category.id;
        button.addEventListener("click", addFilterEventListener);
        filterContainer.appendChild(button);
    };
}

function addFilterEventListener(event) {
    const categoryId = event.target.dataset.categoryId;
    const projets = document.querySelectorAll(".gallery figure");

    projets.forEach(projet => {
        if (projet.dataset.categoryId !== categoryId) {
            projet.classList.add("hidden");
        } else {
            projet.classList.remove("hidden");
        }
    });
}

getProjets();


//Mode édition
document.getElementById("login").addEventListener("click", function() {
    window.location.href = "connexion.html"; // Rediriger vers la page de connexion
});

const token = localStorage.getItem('token')

    const modeEdition = document.getElementById("mode-edition");
    const modifierButton = document.getElementById("modifier-button");
    const loginButton = document.getElementById("login");
    const logoutButton = document.getElementById("logout");

    // Si l'utilisateur est connecté, afficher la bannière, le bouton modifier, et remplacer login par logout
    if (token) {
        modeEdition.style.display = "block"; // Affiche la bannière d'édition
        modifierButton.style.display = "block"; // Affiche le bouton Modifier
        loginButton.style.display = "none"; // Cache le bouton login
        logoutButton.style.display = "block"; // Affiche le bouton logout
    }

    // Gérer la déconnexion
    logoutButton.addEventListener("click", function (event) {
        event.preventDefault();
        localStorage.removeItem("token"); // Supprimer le token pour déconnecter l'utilisateur
        window.location.reload(); // Recharger la page après la déconnexion
});

//Boite Modal
let modal = document.querySelector('.modal') 

//Ouvrir la modale
const openModal = async function (e) {
    e.preventDefault();

    await getProjets();
    
    const target = e.target.getAttribute("href")
    modal.querySelectorAll('.modal-wrapper').forEach( content => {
        content.style.display = 'none'
    })
    modalContent = modal.querySelector(target).style.display = 'block'

    createModalProjects();
    
    modal.style.display = null
    modal.removeAttribute("aria-hidden")
    modal.setAttribute('aria-modal', true);
    

    modal.addEventListener('click', closeModal)
    modal.querySelectorAll('.js-modal-close').forEach(item => {
        item.addEventListener('click', closeModal)
    })
    modal.querySelectorAll('.js-modal-stop').forEach(item => {
        item.addEventListener('click', stopPropagation)
    });
    
    
}

// Function pour gèrer le bouton back et revenir à  la première modale
const goBackToFirstModal = function (e) {
    e.preventDefault();

    // Cache la première modale et affiche la deuxième
    document.getElementById('modal2').style.display = 'none'; // Cache modal2
    document.getElementById('modal1').style.display = 'block'; // Montre modal1
}

// Ajoute un écouteur d'événement pour le bouton back
document.querySelector('.back-button').addEventListener('click', goBackToFirstModal);


//Fermer la modale
const closeModal = function (e) {
    if (modal === null) return
    e.preventDefault()

    
    modal.setAttribute("aria-hidden", 'true')
    modal.style.display = 'none'
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    
    
}

const stopPropagation = function (e) {	
    e.stopPropagation()
}


const loadModal = async function (url) {
    const target = '#' + url.split('#')[1]
    const existingModal = document.querySelector(target)
    if (existingModal !== null) return existingModal
    const html = await fetch(url).then(response => response.text())
    const element = document.createRange().createContextualFragment(html).querySelector(target)
    document.body.append(element)
    return element
}


document.querySelectorAll(`.js-modal`).forEach(a => {
    a.addEventListener('click', openModal)
}) 

window.addEventListener('keydown', function (e) {
    if (e.key === 'Escape'|| e.key === 'Esc') {
        closeModal();
    }
})


// create Modal
function createModalProjects() {
    const sectionWorks = document.querySelector(".photo-gallery");
    sectionWorks.innerHTML = ''; // Efface le contenu précédent

    for (let i = 0; i < projets.length; i++) {
        const projet = projets[i];
        const projetElement = document.createElement("figure");
        projetElement.dataset.categoryId = projet.categoryId; 

        const imageElement = document.createElement("img");
        imageElement.src = projet.imageUrl;

        // Ajout du bouton supprimer pour chaque projet
        const deleteButton = document.createElement("button");
        deleteButton.classList.add("delete-button");
        deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`; 
        projetElement.appendChild(deleteButton);
        projetElement.appendChild(imageElement);

        sectionWorks.appendChild(projetElement);
        deleteButton.addEventListener("click", (e) => {
        e.preventDefault();
        deleteProjet(projet.id);
        });
    }

}


//Preview de l'image
document.getElementById("photo-upload").addEventListener("change", function(event) {
    const file = event.target.files[0];
    if (file) {
        const reader = new FileReader();
        reader.onload = function() {
            const previewImage = document.getElementById("image-preview");
            const previewContainer = document.querySelector('.upload-preview');
            
            // Montrer le preview de l'image
            previewImage.src = reader.result;
            previewImage.style.display = 'block';
            previewImage.classList.add('active'); // Add the class for active styling
            
            // Hide the upload controls (icon, button, text)
            previewContainer.querySelector('i').classList.add('hidden-elements');
            previewContainer.querySelector('label').classList.add('hidden-elements');
            previewContainer.querySelector('small').classList.add('hidden-elements');
        };
        reader.readAsDataURL(file);
    }
});

document.getElementById("add-photo-form").addEventListener("submit", async function(e) {
    e.preventDefault(); // Empêche la soumission par défaut du formulaire
    
    const title = document.getElementById("title").value;
    const category = document.getElementById("category").value;
    const photo = document.getElementById("photo-upload").files[0];

    // Vérifier que tous les champs sont remplis
    if (!title || !category || !photo) {
        alert("Veuillez remplir tous les champs et ajouter une image.");
        return;
    }

    // Création d'un objet FormData pour l'envoi des données multipart/form-data
    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", category);
    formData.append("image", photo);

    try {
        // Envoi des données au back-end
        const response = await fetch('http://localhost:5678/api/works', {
            method: "POST",
            headers: {
                'Authorization': `Bearer ${token}` // Remplacez par le bon token
            },
            body: formData
        });

        if (response.ok) {
            const newProject = await response.json();

            // Ajouter le nouveau projet à la galerie
            addProjectToGallery(newProject);

            // Ajouter également le nouveau projet dans la modale
            addProjectToModal(newProject);

            document.getElementById("add-photo-form").reset(); 

            // Fermer la modale après soumission
            closeModal(e);
        } else {
            alert("Erreur lors de l'ajout du projet.");
        }
    } catch (error) {
        console.error("Erreur:", error);
        alert("Une erreur s'est produite lors de l'ajout du projet.");
    }
});


function addProjectToGallery(project) {
    const gallery = document.querySelector(".gallery");
    
    const figure = document.createElement("figure");
    figure.dataset.categoryId = project.categoryId; // Utilise l'ID de la catégorie

    const img = document.createElement("img");
    img.src = project.imageUrl; // S'assurer que l'API renvoie l'URL de l'image

    const figcaption = document.createElement("figcaption");
    figcaption.innerText = project.title;

    figure.appendChild(img);
    figure.appendChild(figcaption);
    gallery.appendChild(figure);
}

function addProjectToModal(project) {
    const sectionWorks = document.querySelector(".photo-gallery");

    const figure = document.createElement("figure");
    figure.dataset.categoryId = project.categoryId;

    const img = document.createElement("img");
    img.src = project.imageUrl;

    const deleteButton = document.createElement("button");
    deleteButton.classList.add("delete-button");
    deleteButton.innerHTML = `<i class="fa-solid fa-trash-can"></i>`;
    figure.appendChild(deleteButton);
    figure.appendChild(img);

    sectionWorks.appendChild(figure);

    // Ajouter l'écouteur pour la suppression si nécessaire
    deleteButton.addEventListener("click", (e) => {
        e.preventDefault();
        deleteProjet(project.id);
    });
}

async function deleteProjet(projetId) {
const response= await fetch(`http://localhost:5678/api/works/${projetId}`, {
method: 'DELETE',
headers: {
    'Authorization': `Bearer ${token}`
}
})

if (response.status === 204) {
    await getProjets(); 
    createModalProjects();
}

}