// Getting the JSON file of all the works from the API
const works = await fetch("http://localhost:5678/api/works").then(works => works.json());
const categories = await fetch("http://localhost:5678/api/categories").then(categories => categories.json());

// Function to create the gallery with all the works
function generateGallery(works){
    for (let i = 0; i < works.length; i++) {

        const article = works[i];
        // Selecting where the works should be displayed
        const gallery = document.querySelector(".gallery");
        // Work figure tag creation
        const workFigure = document.createElement("figure");
        // Work content creation
        const imageElement = document.createElement("img");
        imageElement.src = article.imageUrl;
        const figcaptionElement = document.createElement("figcaption");
        figcaptionElement.innerText = article.title;
        
        // Appending the elements in the gallery
        gallery.appendChild(workFigure);
        workFigure.appendChild(imageElement);
        workFigure.appendChild(figcaptionElement);

     }
}

generateGallery(works);

