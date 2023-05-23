/* variable */
let modal = null;
const focusableSelector = "button, a , input, textarea";
let focusables = [];
let previouslyFocusedElement = null;

async function importImages() {
  const response = await fetch("http://localhost:5678/api/works");
  const data = await response.json(); /*Récupération des données*/

  const gallery = document.querySelector(".gallery"); /*Selection du parent*/

  for (const image of data) {
    /*Déclaration de ma boucle*/
    const div = document.createElement("div");
    const img = document.createElement("img");
    const title = document.createElement("p");
    title.textContent = image.title;
    img.src = image.imageUrl; /*la source de l'image est imageUrl*/
    img.alt = image.title; /*On récupère le titre des images*/
    img.crossOrigin = "anonymous"; /*Fix du bug d'affichage*/
    div.appendChild(img); /*importation des images au parent*/
    div.appendChild(title);
    gallery.appendChild(div);
    div.setAttribute("data-id", image.id);
  }
}
function updateGallery() {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = ""; // Effacer le contenu actuel de la galerie

  // Appel de la fonction importImages pour récupérer les nouvelles données de la galerie
  importImages();
}
/* Ouverture de la boite modale */
const openModal = function (e) {
  e.preventDefault();
  modal = document.querySelector(e.currentTarget.getAttribute("href"));
  focusables = Array.from(modal.querySelectorAll(focusableSelector));
  document.querySelector(":focus"); /* save de l'ancien element focus */
  modal.style.display = null;
  focusables[0].focus(); /* element 0 en focus au chargement de la page */
  modal.removeAttribute("aria-hidden");
  modal.setAttribute("aria-modal", "true");
  modal.addEventListener("click", closeModal);
  modal.querySelector(".js-modal-close").addEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .addEventListener("click", stopPropagation);
  modalLoad();
};

/* Fermeture de la boite modale */
const closeModal = function (e) {
  if (modal === null) return;
  if (previouslyFocusedElement !== null) previouslyFocusedElement.focus();
  e.preventDefault();
  window.setTimeout(function () {
    modal.style.display = "none";
    modal = null;
  }, 500);
  modal.setAttribute("aria-hidden", "true");
  modal.removeAttribute("aria-modal");
  modal.removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-close")
    .removeEventListener("click", closeModal);
  modal
    .querySelector(".js-modal-stop")
    .removeEventListener("click", stopPropagation);
};

/* focus seulement sur la boite modal */
const stopPropagation = function (e) {
  e.stopPropagation();
};

/* gestion du tab et du shifttab seulement dans la modal */
const focusInModal = function (e) {
  e.preventDefault();
  let index = focusables.findIndex((f) => f === modal.querySelector(":focus"));
  if (e.shiftkey === true) {
    index--;
  } else {
    index++;
  }
  if (index >= focusables.length) {
    index = 0;
  }
  if (index < 0) {
    index = focusables.length - 1;
  }
  focusables[index].focus();
};

/*appel de la function ouverture de la modal*/
document.querySelectorAll(".js-modal").forEach((a) => {
  a.addEventListener("click", openModal);
});

/* appel de la function fermeture de la modal */
window.addEventListener("keydown", function (e) {
  if (e.key === "Escape" || e.key === "Esc") {
    closeModal(e);
  }
  if (e.key === "Tab" && modal !== null) {
    focusInModal(e);
  }
});
/* chargement des travaux dans la modale */
async function modalLoad() {
  const response = await fetch("http://localhost:5678/api/works");
  const data = await response.json();

  const targetWrapper = document.querySelector(".img-load-container");

  targetWrapper.innerHTML = "";

  for (const image of data) {
    /*Déclaration de ma boucle*/

    const div = document.createElement("div");
    div.classList.add("work-item"); // Ajouter une classe de référence au div parent
    const img = document.createElement("img"); /*Création d'une image*/
    const title = document.createElement("p");
    const trashButton = document.createElement("button");
    trashButton.classList.add("deleted-work");
    trashButton.dataset.id =
      image.id; /* j'ajoute le dataset data-id avec la valeur de l'id correspondant à l'image */
    title.textContent = "éditer";
    img.src = image.imageUrl; /*la source de l'image est imageUrl*/
    img.crossOrigin = "anonymous"; /*Fix du bug d'affichage*/
    trashButton.innerHTML = '<i class="fa-sharp fa-solid fa-trash"></i>';
    div.appendChild(img); /*importation des images au parent*/
    div.appendChild(title);
    div.appendChild(trashButton);
    targetWrapper.appendChild(div);
  } /* Suppression de travaux */
  const deleteButtons =
    document.querySelectorAll(
      ".deleted-work"
    ); /* je selectionne touts mes boutons */
  deleteButtons.forEach((button) => {
    button.addEventListener("click", async function (e) {
      /* pour chaque bouton je créer un évenement click */
      e.preventDefault();
      let workId =
        button.dataset
          .id; /* je créer ma variable qui récupère l'ID de chaque image qui est stockée dans le dataset du bouton */
      const token = localStorage.getItem("monToken");
      await fetch(`http://localhost:5678/api/works/${workId}`, {
        method: "DELETE",
        headers: {
          accept: "*/*",
          Authorization: `Bearer ${token}`,
        },
      });
      const deletedWorkDiv = button.closest(".work-item");
      deletedWorkDiv.remove();
      updateGallery(); // Supprimer le div parent de l'image supprimée
    });
  });
}

async function creatingWork() {
  const loadContainer = document.querySelector(".img-load-container");
  const deleteGallery = document.querySelector(".delete-all-gallery");
  const previousModal = document.querySelector(".previous-modal");
  const workForm = document.querySelector("#my-form");
  const titleModal = document.querySelector("#titlemodal");
  const contentBottom = document.querySelector(".bottom-content");
  const hiddenContent = document.querySelector(".hide-content");
  const hiddenTxt = document.querySelector(".image-text");
  const hiddenFormat = document.querySelector(".image-format");

  hiddenContent.style.display = "flex";
  hiddenTxt.style.display = "flex";
  hiddenFormat.style.display = "flex";
  contentBottom.style.display = "none";
  previousModal.style.display = "block";
  loadContainer.style.display = "none";
  titleModal.innerHTML = "Ajout photo";
  deleteGallery.style.display = "none";
  workForm.style.display = "flex";
}
const targetAddWork = document.querySelector(".btn-add-modal");
targetAddWork.addEventListener("click", creatingWork);

/* fleche precedent */
async function modalPrevious() {
  const loadContainer = document.querySelector(".img-load-container");
  const deleteGallery = document.querySelector(".delete-all-gallery");
  const previousModal = document.querySelector(".previous-modal");
  const workForm = document.querySelector("#my-form");
  const titleModal = document.querySelector("#titlemodal");
  const contentBottom = document.querySelector(".bottom-content");
  const uploadedImg = document.querySelector("#uploadedimage");

  contentBottom.style.display = "flex";
  previousModal.style.display = "none";
  loadContainer.style.display = "flex";
  titleModal.innerHTML = "Galerie photo";
  deleteGallery.style.display = "block";
  uploadedImg.innerHTML = "";
  uploadedImg.style.width = "0px";
  uploadedImg.style.height = "0px";
  workForm.style.display = "none";
  workForm.reset();
}
const targetPrevious = document.querySelector(".previous-modal");
targetPrevious.addEventListener("click", modalPrevious);

async function createWork() {
  const token = localStorage.getItem("monToken");
  const imageForm = document.getElementById("image").files[0];
  const titleForm = document.getElementById("title").value;
  const categoryForm = document.getElementById("category").value;

  if (!imageForm || !titleForm || !categoryForm) {
    alert("Veuillez remplir tous les champs du formulaire.");
    return;
  }

  const formData = new FormData();
  formData.append("image", imageForm);
  formData.append("title", titleForm);
  formData.append("category", categoryForm);

  await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`,
    },
    body: formData,
  })
    .then((response) => {
      console.log(response);
      if (!response.ok) {
        throw new Error("Network error");
      }
      return response.json();
    })
    .then((data) => {
      console.log(data);
      modalLoad();
      modalPrevious();
      updateGallery();
    })
    .catch((error) => {
      console.error("problem with the fetch operation:", error);
    });
}

document.getElementById("my-form").addEventListener("submit", function (event) {
  event.preventDefault();
  createWork();
});
/* afficher l'image sélectionnée */
const uploadedImageDiv = document.querySelector("#uploadedimage");
const fileUpload = document.querySelector("#image");
const titleUpload = document.querySelector("#title");
const sendWork = document.querySelector("#valid-photo");
const hiddenContent = document.querySelector(".hide-content");
const hiddenTxt = document.querySelector(".image-text");
const hiddenFormat = document.querySelector(".image-format");

fileUpload.addEventListener("change", getImage, checkChange);
titleUpload.addEventListener("change", checkChange);
function checkChange() {
  sendWork.style.backgroundColor = "#1D6154";
}
function getImage(e) {
  hiddenContent.style.display = "none";
  hiddenTxt.style.display = "none";
  hiddenFormat.style.display = "none";
  console.log(e.target.files[0]);
  console.log("images", e.target.files[0]);
  const imageToProcess = e.target.files[0];

  let newImg = new Image(imageToProcess.width, imageToProcess.height);
  newImg.src = URL.createObjectURL(imageToProcess);
  uploadedImageDiv.style.width = "130px";
  uploadedImageDiv.style.height = "169px";
  uploadedImageDiv.appendChild(newImg);
}
function logout() {
  document.getElementById("btn-login").innerText = "login";
  localStorage.removeItem("monToken");
}
targetLogout = document.querySelector("#btn-login");
targetLogout.addEventListener("click", logout);
