// Getting the JSON file of all the works from the API
const works = await fetch("http://localhost:5678/api/works").then(works => works.json());

////////// Gallery //////////
// Function to create the gallery with all the works
function generateGallery(works){
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
// Unique categories list creation
const categories = works.map(work => work.category)
const uniqueCategories = new Set(categories.map(JSON.stringify));
const uniqueCategroriesArray = Array.from(uniqueCategories);
const categoriesList = uniqueCategroriesArray.map(JSON.parse);

// Function to create the filters
function generateFilters(categoriesList){

    // Generating button to display all the projects
    const filters = document.querySelector(".filters");
    const filterAll = document.createElement("button");
    filterAll.innerText = "Tous";
    filterAll.className="filter all selected";
    filters.appendChild(filterAll);

    // Generating a button for each unique category
    for (let i = 0; i < categoriesList.length; i++) {

        const category = categoriesList[i];
        const filters = document.querySelector(".filters");
        const filterButton = document.createElement("button");
        filterButton.innerText = category.name;
        filterButton.className = `filter id${category.id}`;

        filters.appendChild(filterButton);
    }
}

generateFilters(categoriesList);


// Button click event to show all projects
const filter = document.querySelector(".all");
filter.addEventListener("click", function () {
    document.querySelector(".gallery").innerHTML = "";
    generateGallery(works)
    document.querySelector(".selected").classList.remove("selected");
    document.querySelector(".all").classList.add("selected");
});

// Button click events to show filtered projects for each category
for (let i = 0; i < categoriesList.length; i++) {
    const category = categoriesList[i];
    const filter = document.querySelector(`.id${category.id}`);

    filter.addEventListener("click", function () {
        const filteredWorks = works.filter(function (work) {
            return work.category.id === category.id;
        });
        document.querySelector(".gallery").innerHTML = "";
        generateGallery(filteredWorks);
        document.querySelector(".selected").classList.remove("selected");
        document.querySelector(`.id${category.id}`).classList.add("selected");
    });
};

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

        document.querySelector("#introduction").appendChild(modifyAction.cloneNode(true));
        document.querySelector(".projects").appendChild(modifyAction.cloneNode(true));
        // adding a class for the gallery modification button
        document.querySelector(".projects .modify").classList.add("gallery-button");
    }
}

adminInterface();


////////// Popup modal for gallery modification //////////
// modal popup
const modal = document.querySelector(".modal");

function generateGalleryEdit(works){
    for (let i = 0; i < works.length; i++) {

        let article = works[i];
        // Selecting where the works should be displayed
        let gallery = document.querySelector(".gallery-edit");
        // Work figure tag creation
        let workFigure = document.createElement("figure");
        // Work content creation
        let imageElement = document.createElement("img");
        imageElement.src = article.imageUrl;
        imageElement.alt = article.title;
        let figcaptionElement = document.createElement("figcaption");
        figcaptionElement.innerText = "éditer";
        const deleteIcon = document.createElement("i");
        deleteIcon.className = "fa-solid fa-trash-can";

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
            console.log(deleteid);
            let response = await fetch(`http://localhost:5678/api/works/${deleteid}`, 
            {
                method: "DELETE",
                headers: {
                    accept: "*/*",
                    Authorization: `Bearer ${myToken}`,
                },
            }
            );
            if (response == 200) {
            return false;
            // if HTTP-status is 200-299
            //alert("Photo supprimé avec succes");
            // obtenir le corps de réponse (la méthode expliquée ci-dessous)
            } else {
            alert("Echec de suppression");
            }
        });
    }
}

document.querySelector(".gallery-button").addEventListener("click", () => {
    modal.showModal();
    document.querySelector(".gallery-edit").innerHTML="";
    generateGalleryEdit(works);
});
document.querySelector(".close").addEventListener("click", () => {
   modal.close();
});

// Closing modal when clisking outside of it
modal.addEventListener("click", event => {
    const rect = modal.getBoundingClientRect();
    if (event.clientY < rect.top || event.clientY > rect.bottom ||
        event.clientX < rect.left || event.clientX > rect.right) {
        modal.close();
    }
});

