function checkAccess() {
  const topContainer = document.querySelector(".top-container");
  const kitMid = document.querySelector(".modifier-kit-mid");
  const kitTop = document.querySelector(".modifier-kit-top");
  const kitBottom = document.querySelector(".modifier-kit-bot");
  const headerMargin = document.querySelector("header");
  const btnLogin = document.getElementById("btn-login");
  const btnLogout = document.getElementById("btn-logout");
  const filters = document.getElementById("filtres");

  const token = localStorage.getItem("monToken");
  if (!token) {
    topContainer.classList.add("hidden");
    kitMid.classList.add("hidden");
    kitTop.classList.add("hidden");
    kitBottom.classList.add("hidden");
    btnLogout.classList.add("hidden");
    filters.style.display = "flex";
    btnLogin.classList.remove("hidden");
    headerMargin.style.margin = "50px 0";
  } else {
    topContainer.classList.remove("hidden");
    kitMid.classList.remove("hidden");
    kitTop.classList.remove("hidden");
    kitBottom.classList.remove("hidden");
    btnLogout.classList.remove("hidden");
    filters.style.display = "none";
    btnLogin.classList.add("hidden");
    headerMargin.style.margin = "80px 0";
  }
}
checkAccess();
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

importImages();

const filterAll = document.querySelector("#all");
const filterObjet = document.querySelector("#objects");
const filterAppartements = document.querySelector("#appartements");
const filterHotels = document.querySelector("#hotels-restaurants");

filterAll.addEventListener("click", async function () {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  importImages();
});

/* Afficher les projets "Objets" */
filterObjet.addEventListener("click", async function () {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  const response = await fetch("http://localhost:5678/api/works");
  const data = await response.json();
  let result = data.filter(
    (item) => item.category.name === "Objets"
  ); /* Filtrage  des données sur le nom de la catégorie des travaux */

  for (const image of result) {
    const div = document.createElement("div");
    const img = document.createElement("img");
    const title = document.createElement("p");
    title.textContent = image.title;
    img.src = image.imageUrl;
    img.alt = image.title;
    img.crossOrigin = "anonymous";
    div.appendChild(img);
    div.appendChild(title);
    gallery.appendChild(div);
    div.setAttribute("data-id", image.id);
  }
});
/* Afficher les projets "Appartements" */
filterAppartements.addEventListener("click", async function () {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  const response = await fetch("http://localhost:5678/api/works");
  const data = await response.json();
  let result = data.filter((item) => item.category.name === "Appartements");

  for (const image of result) {
    const div = document.createElement("div");
    const img = document.createElement("img");
    const title = document.createElement("p");
    title.textContent = image.title;
    img.src = image.imageUrl;
    img.alt = image.title;
    img.crossOrigin = "anonymous";
    div.appendChild(img);
    div.appendChild(title);
    gallery.appendChild(div);
    div.setAttribute("data-id", image.id);
  }
});
/* Afficher les projets "hotel & restaurants" */
filterHotels.addEventListener("click", async function () {
  const gallery = document.querySelector(".gallery");
  gallery.innerHTML = "";
  const response = await fetch("http://localhost:5678/api/works");
  const data = await response.json();
  let result = data.filter(
    (item) => item.category.name === "Hotels & restaurants"
  );

  for (const image of result) {
    const div = document.createElement("div");
    const img = document.createElement("img");
    const title = document.createElement("p");
    title.textContent = image.title;
    img.src = image.imageUrl;
    img.alt = image.title;
    img.crossOrigin = "anonymous";
    div.appendChild(img);
    div.appendChild(title);
    gallery.appendChild(div);
    div.setAttribute("data-id", image.id);
  }
});

/* Ajout des class pour afficher ou non les projets */
const buttons = document.querySelectorAll(".btn-filtrer");
buttons.forEach((button) => {
  button.addEventListener("click", () => {
    button.classList.add("active");

    buttons.forEach((otherButton) => {
      if (otherButton !== button) {
        otherButton.classList.remove("active");
      }
    });
  });
});
function logout() {
  localStorage.removeItem("monToken");
}
targetLogout = document.querySelector("#btn-logout");
targetLogout.addEventListener("click", logout);
