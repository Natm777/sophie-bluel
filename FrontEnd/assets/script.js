const filterContainer = document.querySelector(".filters");
let projets = [];

async function getProjets() {
    const response = await fetch('http://localhost:5678/api/works');
    projets = await response.json();
    createProjets();
    createButtonsFilter(); // Assurez-vous que les boutons sont créés après le chargement des projets
}

function createProjets() {
    const sectionGallery = document.querySelector(".gallery");
    sectionGallery.innerHTML = ''; // Efface le contenu précédent

    for (let i = 0; i < projets.length; i++) {
        const projet = projets[i];
        const projetElement = document.createElement("figure");
        projetElement.dataset.categoryId = projet.categoryId; // Ajout de l'attribut data-category-id

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
    window.location.href = "connexion.html"; // Redirige vers la page de connexion
});

const token = localStorage.getItem("token");

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
let modal = null 
const focusableSelector = 'a, button, input, textarea, select, [tabindex]:not([tabindex="-1"])'
let focusables = []
let previouslyFocusedElement = null

const openModal = async function (e) {
    e.preventDefault();
    const target = e.target.getAttribute("href")
    if (target.startsWith('#')) {
        modal = document.querySelector(target)
    } else {
        modal = await loadModal(target)
        console.log(modal)
    }

    createModalProjects();
    focusables = Array.from(modal.querySelectorAll(focusableSelector))
    console.log('Focusable elements:', focusables);
    previouslyFocusedElement = document.querySelectorAll(':focus')
    modal.style.display = null
    modal.removeAttribute("aria-hidden")
    modal.setAttribute('aria-modal', true)
    modal.addEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').addEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').addEventListener('click', stopPropagation)
    modal.addEventListener('keydown', focusInModal) 
    focusables[0].focus();

    
}

const closeModal = function (e) {
    if (modal === null) return
    
    console.log(modal)
    e.preventDefault()

    
    modal.setAttribute("aria-hidden", 'true')
    modal.removeAttribute('aria-modal')
    modal.removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-close').removeEventListener('click', closeModal)
    modal.querySelector('.js-modal-stop').removeEventListener('click', stopPropagation)
    modal.removeEventListener('keydown', focusInModal) 

    if (previouslyFocusedElement !== null) previouslyFocusedElement[0].focus()
    
    modal = null
}

const stopPropagation = function (e) {	
    e.stopPropagation()
}

const focusInModal = function (e) {
    if (e.key === 'Tab'){
    e.preventDefault()
    let index = focusables.findIndex(f => f === document.activeElement)
    if (e.shiftKey === true) {
        index--
    } else {
        index++
    }
    if (index >= focusables.length) {
        index = 0
    }

    if (index < 0) {
        index = focusables.length - 1
    }

    focusables[index].focus()
    }
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






