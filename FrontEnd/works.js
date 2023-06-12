// Getting the JSON file of all the works from the API
var works = await fetch("http://localhost:5678/api/works").then((works) =>
  works.json()
);
var categoriesUploaded = await fetch(
  "http://localhost:5678/api/categories"
).then((categoriesUploaded) => categoriesUploaded.json());

////////// Gallery //////////
// Function to create the gallery with all the works
function generateGallery(works) {
  for (let i = 0; i < works.length; i++) {
    let article = works[i];
    // Selecting where the works should be displayed
    let gallery = document.querySelector(".gallery");
    // Work figure tag creation
    let workFigure = document.createElement("figure");
    // Work content creation
    let imageElement = document.createElement("img");
    imageElement.src = article.imageUrl;
    imageElement.alt = article.title;
    let figcaptionElement = document.createElement("figcaption");
    figcaptionElement.innerText = article.title;

    // Appending the elements in the gallery
    gallery.appendChild(workFigure);
    workFigure.appendChild(imageElement);
    workFigure.appendChild(figcaptionElement);
  }
}

generateGallery(works);

////////// Filters //////////
// Function to create the filters
function generateFilters(works) {
  // Unique categories list creation
  var categories = works.map((work) => work.category);
  var uniqueCategories = new Set(categories.map(JSON.stringify));
  var uniqueCategroriesArray = Array.from(uniqueCategories);
  var categoriesList = uniqueCategroriesArray.map(JSON.parse);

  // Generating button to display all the projects
  var filters = document.querySelector(".filters");
  var filterAll = document.createElement("button");
  filterAll.innerText = "Tous";
  filterAll.className = "filter all selected";
  filters.appendChild(filterAll);

  // Generating a button for each unique category
  for (let i = 0; i < categoriesList.length; i++) {
    var category = categoriesList[i];
    var filters = document.querySelector(".filters");
    var filterButton = document.createElement("button");
    filterButton.innerText = category.name;
    filterButton.className = `filter id${category.id}`;

    filters.appendChild(filterButton);
  }
  // Button click events to show filtered projects for each category
  for (let i = 0; i < categoriesList.length; i++) {
    let category = categoriesList[i];
    let filter = document.querySelector(`.id${category.id}`);
    let filteredWorks = works.filter(function (work) {
      return work.category.id === category.id;
    });

    filter.addEventListener("click", function () {
      document.querySelector(".gallery").innerHTML = "";
      generateGallery(filteredWorks);
      document.querySelector(".selected").classList.remove("selected");
      document.querySelector(`.id${category.id}`).classList.add("selected");
    });
  }
  // Button click event to show all projects
  var filter = document.querySelector(".all");
  filter.addEventListener("click", function () {
    document.querySelector(".gallery").innerHTML = "";
    generateGallery(works);
    document.querySelector(".selected").classList.remove("selected");
    document.querySelector(".all").classList.add("selected");
  });
}

generateFilters(works);

////////// Admin interface //////////
// Function to load the admin interface when logged in
function adminInterface() {
  if (sessionStorage.getItem("token") !== null) {
    // Top admin menu creation
    const publishTop = document.querySelector(".body");
    const publish = document.createElement("div");
    publish.className = "publish";
    const editionMode = document.createElement("div");
    const modifyIcon = document.createElement("i");
    modifyIcon.className = "fa-regular fa-pen-to-square";
    const edition = document.createElement("span");
    edition.innerText = "Mode édition";
    const buttonPublish = document.createElement("button");
    buttonPublish.innerText = "publier les changements";
    buttonPublish.className = "button-publish";

    publishTop.prepend(publish);
    publish.appendChild(editionMode);
    editionMode.appendChild(modifyIcon.cloneNode(true));
    editionMode.appendChild(edition);
    publish.appendChild(buttonPublish);

    // modify buttons creation
    const modifyAction = document.createElement("button");
    modifyAction.className = "modify";
    const modify = document.createElement("span");
    modify.innerText = "modifier";
    modifyAction.appendChild(modifyIcon.cloneNode(true));
    modifyAction.appendChild(modify.cloneNode(true));

    document
      .querySelector("#introduction")
      .appendChild(modifyAction.cloneNode(true));
    document
      .querySelector(".projects")
      .appendChild(modifyAction.cloneNode(true));
    // adding a class for the gallery modification button
    document.querySelector(".projects .modify").classList.add("gallery-button");
  }
}

adminInterface();

////////// Popup modal for gallery modification //////////
// modal popup
const modal = document.querySelector(".modal");

async function generateGalleryEdit() {
  for (let i = 0; i < works.length; i++) {
    let article = works[i];
    // Selecting where the works should be displayed
    let gallery = document.querySelector(".gallery-edit");
    // Work figure tag creation
    let workFigure = document.createElement("figure");
    workFigure.className = "modal-click-outside";
    // Work content creation
    let imageElement = document.createElement("img");
    imageElement.src = article.imageUrl;
    imageElement.alt = article.title;
    imageElement.className = "modal-click-outside";
    let figcaptionElement = document.createElement("figcaption");
    figcaptionElement.innerText = "éditer";
    figcaptionElement.className = "modal-click-outside";
    const deleteIcon = document.createElement("i");
    deleteIcon.className = "modal-click-outside fa-solid fa-trash-can";

    workFigure.style.position = "relative";
    deleteIcon.style.position = "absolute";
    deleteIcon.style.top = "6px";
    deleteIcon.style.right = "6px";

    // Appending the elements in the gallery
    gallery.appendChild(workFigure);
    workFigure.appendChild(imageElement);
    workFigure.appendChild(figcaptionElement);
    workFigure.appendChild(deleteIcon);

    // Button to delete a project
    deleteIcon.addEventListener("click", async (e) => {
      e.preventDefault();
      e.stopPropagation();
      let deleteid = article.id;
      let myToken = sessionStorage.getItem("token");
      let response = await fetch(
        `http://localhost:5678/api/works/${deleteid}`,
        {
          method: "DELETE",
          headers: {
            accept: "*/*",
            Authorization: `Bearer ${myToken}`,
          },
        }
      );
      // If a work is deleted, the gallery, gallery edition and filters are updated
      if (response.ok) {
        return (
          (works = await fetch("http://localhost:5678/api/works").then(
            (works) => works.json()
          )),
          (document.querySelector(".gallery").innerHTML = ""),
          generateGallery(works),
          (document.querySelector(".gallery-edit").innerHTML = ""),
          generateGalleryEdit(),
          (document.querySelector(".filters").innerHTML = ""),
          generateFilters(works)
        );
      } else {
        alert("Echec de suppression");
      }
    });
  }
}

// Event on click to open gallery edition
document.querySelector(".gallery-button").addEventListener("click", () => {
  modal.showModal();
  document.querySelector(".gallery-edit").innerHTML = "";
  generateGalleryEdit();
});
//Closing gallery edition by clicking the cross icon
document.querySelector(".close").addEventListener("click", () => {
  modal.close();
});
// Closing gallery edition by clicking outside of it
modal.addEventListener("click", (event) => {
  if (event.target === event.currentTarget) {
    modal.close();
  }
});

////////// Navigation between gallery edition and form to add a new project //////////
const modalAdd = document.querySelector(".add-project");
const inputFile = document.querySelector("#picture");

// Event on click to open gallery edition
document.querySelector(".add-picture").addEventListener("click", () => {
  modal.close();
  modalAdd.showModal();
  generateSelect();
  selectedImage.src = "";
  imageOff.style.display = "flex";
  imageOn.style.display = "none";
  inputFile.value = "";
  newProjectTitle.value = "";
  sendRequest.style.background = "#A7A7A7";
});
// Closing gallery edition by clicking outside of it
modalAdd.addEventListener("click", (event) => {
  if (event.target === event.currentTarget) {
    modalAdd.close();
  }
});
// Closing the form to add a new project when clicking on the cross
document.querySelector(".close-add").addEventListener("click", () => {
  modalAdd.close();
});
// Return to gallery edition when clicking left arrow
document.querySelector(".return").addEventListener("click", () => {
  modalAdd.close();
  modal.showModal();
});

////////// Form to add a new project //////////

// This code handels the automatic closure of <dialog> when input file dialog is closed without choosing a file
// This automatic closure appears only on Chrome
var dialogopen = false;

function sleep(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}
async function wait() {
  await sleep(100);
  if (!modalAdd.open) {
    modalAdd.showModal();
  }
}

window.addEventListener("focus", () => {
  if (dialogopen) {
    wait();
    dialogopen = false;
  }
});

document.querySelector("#loadPicture").addEventListener("click", (event) => {
  if (event.target === event.currentTarget) {
    inputFile.click();
    dialogopen = true;
  }
});

const imageOff = document.querySelector(".image-shown");
const imageOn = document.querySelector(".show-image");
const selectedImage = document.querySelector(".selected-image");

// Display of image chosen
inputFile.addEventListener("change", () => {
  let [file] = inputFile.files;

  if (inputFile.files[0].size > 4 * 1024 * 1024) {
    alert("La photo dépasse 4Mo!");
    inputFile.value = "";
  }
  if (!inputFile.files[0].name.match(/\.(jpg|jpeg|png)$/i)) {
    alert("Le fichier sélectionné n'est pas une image.");
    inputFile.value = "";
  }
  if (inputFile.value === "") {
    imageOff.style.display = "flex";
    imageOn.style.display = "none";
  } else {
    imageOff.style.display = "none";
    imageOn.style.display = "flex";
    if (file) {
      selectedImage.src = URL.createObjectURL(file);
    }
    // if other inputs are filled, change submit style
    if (newProjectCat.value !== "" && newProjectTitle.value !== "") {
      sendRequest.style.background = "#1D6154";
    }
  }
});

// Function to generate the options in the category select input
function generateSelect() {
  let select = document.querySelector("#category");
  select.innerHTML = "";
  let blank = document.createElement("option");
  blank.value = "";
  blank.className = "blank-option";
  blank.setAttribute("selected", "");
  blank.setAttribute("disabled", "");
  select.appendChild(blank);

  for (let i = 0; i < categoriesUploaded.length; i++) {
    let cat = categoriesUploaded[i];
    let option = document.createElement("option");
    option.value = cat.id;
    option.innerText = cat.name;

    select.appendChild(option);
  }
}

// Sending form to add new project
const sendRequest = document.querySelector("#send-request");
const newProjectTitle = document.querySelector("#title");
const newProjectCat = document.querySelector("#category");

// Title, if other inputs are filled, change submit style
newProjectTitle.addEventListener("change", () => {
  if (newProjectTitle.value === "") {
    sendRequest.style.background = "#A7A7A7";
  }
  if (
    inputFile.files.length !== 0 &&
    newProjectTitle.value !== "" &&
    newProjectCat.value !== ""
  ) {
    sendRequest.style.background = "#1D6154";
  }
});

// Category, if other inputs are filled, change submit style
newProjectCat.addEventListener("change", () => {
  if (
    inputFile.files.length !== 0 &&
    newProjectTitle.value !== "" &&
    newProjectCat.value !== ""
  ) {
    sendRequest.style.background = "#1D6154";
  }
});

////////// Function to send POST request for a new project //////////

async function postRequest(inputs) {
  let response = await fetch("http://localhost:5678/api/works", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${sessionStorage.getItem("token")}`,
    },
    body: inputs,
  });

  // if reponse ok, close modal for new project and open modal for gallery edition
  // and update main gallery, filters and gallery edition
  if (response.ok) {
    return (
      works = await fetch("http://localhost:5678/api/works").then((works) =>
        works.json()
      ),
      modalAdd.close(),
      modal.showModal(),
      document.querySelector(".gallery").innerHTML = "",
      generateGallery(works),
      document.querySelector(".gallery-edit").innerHTML = "",
      generateGalleryEdit(),
      document.querySelector(".filters").innerHTML = "",
      generateFilters(works)
    );

    // if response 401, user token is incorrect. User has to log in again.
  } else if (response.status == 401) {
    location.href = "login.html";
    alert(
      "Votre session a expiré. Veuillez vous reconnecter pour ajouter un projet."
    );
  } else {
    alert("Erreur serveur!");
  }
}

sendRequest.addEventListener("click", (event) => {
  event.preventDefault();
  // Request sent only if all fields are filled
  if (
    inputFile.files.length !== 0 &&
    newProjectTitle.value !== "" &&
    newProjectCat.value !== ""
  ) {
    // Send new project to database
    const formData = new FormData();
    formData.append("image", inputFile.files[0]);
    formData.append("title", newProjectTitle.value);
    formData.append("category", parseInt(newProjectCat.value));

    postRequest(formData);
  } else {
    alert(
      "Le formulaire d'ajout de projet n'est pas complet. Merci de remplir tous les champs: Photo, Titre et Catégorie."
    );
  }
});
