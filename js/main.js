echo '// Sample projects data
const projects = [
    { name: "Project 1", url: "#", description: "A cool project." },
    { name: "Project 2", url: "#", description: "Another awesome project." }
];

// Render projects
const projectList = document.querySelector(".project-list");
projects.forEach(project => {
    projectList.innerHTML += `
        <div class="project">
            <h3><a href="${project.url}">${project.name}</a></h3>
            <p>${project.description}</p>
        </div>
    `;
});' > js/main.js
