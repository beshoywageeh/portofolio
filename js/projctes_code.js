

function displayProjects() {
  const reposDiv = document.getElementById("projects");
  reposDiv.className = "grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3";

  // Display projects with staggered animation
  projects.forEach((project, index) => {
    const projectCard = document.createElement("div");
    projectCard.className = "animate fade-in project-card transition-base";
    projectCard.style.animationDelay = `${index * 0.2}s`;

    projectCard.innerHTML = `
      <div class="h-full bg-slate-900 rounded-xl border border-slate-700 shadow-lg hover:shadow-blue-500/20 hover:border-blue-500/30 hover:-translate-y-2 transition-all duration-300">
        ${project.image ? `
          <div class="relative h-48 overflow-hidden rounded-t-xl group">
            <img src="${project.image}" 
                 alt="${project.name}" 
                 class="object-cover w-full h-full transition-all duration-500 group-hover:scale-110 group-hover:brightness-110">
          </div>
        ` : ''}
        <div class="p-6">
          <!-- Project Header -->
          <div class="flex justify-between items-start mb-4">
            <h3 class="text-xl font-bold text-white group transition-all duration-300 hover:translate-x-1">
              <a href="${project.liveUrl}" 
                 class="hover:text-blue-400 transition-all duration-300 flex items-center gap-2" 
                 target="_blank">
                ${project.name}
                <svg class="w-5 h-5 opacity-0 group-hover:opacity-100 transition-base" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14"/>
                </svg>
              </a>
            </h3>
            <span class="px-3 py-1 text-xs font-medium rounded-full ${
              project.isPrivate 
              ? "bg-red-900/50 text-red-300 border border-red-500" 
              : "bg-emerald-900/50 text-emerald-300 border border-emerald-500"
            }">
              ${project.isPrivate ? "Private" : "Public"}
            </span>
          </div>
          
          <!-- Description -->
          <div class="mb-6 p-4 bg-slate-800/50 rounded-lg border border-slate-700 transition-all duration-300 hover:border-blue-500/30 hover:bg-slate-800/70">
            <p class="text-gray-300 text-sm line-clamp-3">
              ${project.description || "No description available"}
            </p>
          </div>

          <!-- Technologies -->
          <div class="flex flex-wrap gap-2 mb-6">
            ${project.technologies.map(tech => `
              <span class="px-3 py-1 text-xs font-medium text-blue-300 bg-blue-900/30 rounded-full border border-blue-500/30 transition-all duration-300 hover:bg-blue-900/50 hover:border-blue-500/50 hover:translate-y-[-2px]">
                ${tech}
              </span>
            `).join('')}
          </div>

          <!-- Action Buttons -->
          <div class="flex gap-3">
            ${project.liveUrl ? `
              <a href="${project.liveUrl}" 
                 class="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-slate-800 hover:bg-slate-700 rounded-lg transition-all duration-300 border border-slate-600 hover:border-blue-500/30 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1" 
                 target="_blank">
                <i data-feather="external-link" class="w-4 h-4"></i>
                <span>Live Demo</span>
              </a>
            ` : ''}
            ${project.githubUrl ? `
              <a href="${project.githubUrl}" 
                 class="flex-1 flex items-center justify-center gap-2 px-4 py-2 text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 rounded-lg transition-all duration-300 hover:shadow-lg hover:shadow-blue-500/20 hover:-translate-y-1" 
                 target="_blank">
                <i data-feather="github" class="w-4 h-4"></i>
                <span>View Code</span>
              </a>
            ` : ''}
          </div>
        </div>
      </div>
    `;

    reposDiv.appendChild(projectCard);
    feather.replace();
  });
}

// Display projects when the page loads
document.addEventListener("DOMContentLoaded", displayProjects);
