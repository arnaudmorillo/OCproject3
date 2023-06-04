
// Getting the JSON file of all the works from the API
var works = await fetch("http://localhost:5678/api/works").then(works => works.json());

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
// Function to create the filters
function generateFilters(works){

    // Unique categories list creation
    var categories = works.map(work => work.category)
    var uniqueCategories = new Set(categories.map(JSON.stringify));
    var uniqueCategroriesArray = Array.from(uniqueCategories);
    var categoriesList = uniqueCategroriesArray.map(JSON.parse);


    // Generating button to display all the projects
    var filters = document.querySelector(".filters");
    var filterAll = document.createElement("button");
    filterAll.innerText = "Tous";
    filterAll.className="filter all selected";
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
    };
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

async function generateGalleryEdit(){
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
            // If a work is deleted, the gallery, gallery edition and filters are updated
            if (response.ok) {
            return works = await fetch("http://localhost:5678/api/works").then(works => works.json()),
                document.querySelector(".gallery").innerHTML = "",
                generateGallery(works),
                document.querySelector(".gallery-edit").innerHTML="",
                generateGalleryEdit(),
                document.querySelector(".filters").innerHTML="",
                generateFilters(works);
            } else {
            alert("Echec de suppression");
            }
        });
    }
}

// Event on click to open gallery edition
document.querySelector(".gallery-button").addEventListener("click", () => {
    modal.showModal();
    document.querySelector(".gallery-edit").innerHTML="";
    generateGalleryEdit();
});
//Closing gallery edition by clicking the cross icon
document.querySelector(".close").addEventListener("click", () => {
modal.close();
});
// Closing gallery edition by clicking outside of it
modal.addEventListener("click", event => {
    const rect = modal.getBoundingClientRect();
    if (event.clientY < rect.top || event.clientY > rect.bottom ||
        event.clientX < rect.left || event.clientX > rect.right) {
        modal.close();
    }
});



////////// Form to add a new project //////////