// Configure your GitHub username
const GITHUB_USERNAME = "beshoywageeh";

// Format date to a more readable format
function formatDate(dateString) {
  const options = {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  };
  return new Date(dateString).toLocaleDateString("en-US", options);
}

async function fetchRepositories() {
  const errorDiv = document.getElementById("error-message");
  const reposDiv = document.getElementById("projects");

  try {
    // Fetch repositories
    const response = await fetch(
      `https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc`
    );

    if (!response.ok) {
      if (response.status === 403) {
        errorDiv.classList.remove("hidden");
        errorDiv.innerHTML = `
          <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
            <strong class="font-bold">403 Forbidden.</strong>
            <span class="block sm:inline"> You have exceeded the GitHub API rate limit. Please wait some time before trying again.</span>
          </div>
        `;
      } else {
        throw new Error("Failed to fetch repositories");
      }
      return;
    }

    const repos = await response.json();
    const originalRepos = repos.filter((repo) => !repo.fork);

    if (originalRepos.length === 0) {
      reposDiv.innerHTML = `
        <div class="col-span-3">
          <div class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded-lg" role="alert">
            <strong class="font-bold">No original repositories found.</strong>
          </div>
        </div>
      `;
      return;
    }

    // Display repositories
    originalRepos.forEach(async (repo) => {
      const col = document.createElement("div");
      col.className = "col-span-1";

      const card = document.createElement("div");
      card.className = "flex flex-col h-full bg-white rounded-lg shadow-md";

      // Add repository information
      card.innerHTML = `
        <div class="p-6 flex-grow">
          <div class="flex justify-between items-start mb-4">
            <h5 class="text-xl font-semibold text-gray-900">
              <a href="${
                repo.html_url
              }" class="hover:text-blue-600 transition-colors" target="_blank">
                ${repo.name}
              </a>
            </h5>
            <span class="${
              repo.private ? "bg-red-500" : "bg-green-500"
            } text-white text-xs font-medium px-2.5 py-1 rounded-full">
              ${repo.private ? "Private" : "Public"}
            </span>
          </div>
          
          <p class="text-gray-600 mb-4">
            ${repo.description || "No description available"}
          </p>

          <div class="space-y-2 mb-4">
            <div class="flex items-center text-gray-600">
              <i data-feather="calendar-plus" class="w-4 h-4 mr-2"></i>
              Created: ${formatDate(repo.created_at)}
            </div>
            <div class="flex items-center text-gray-600">
              <i data-feather="calendar-check" class="w-4 h-4 mr-2"></i>
              Last Updated: ${formatDate(repo.updated_at)}
            </div>
            ${
              repo.pushed_at
                ? `
            <div class="flex items-center text-gray-600">
              <i data-feather="code" class="w-4 h-4 mr-2"></i>
              Last Push: ${formatDate(repo.pushed_at)}
            </div>`
                : ""
            }
          </div>

          <div class="flex gap-2 flex-wrap mb-4">
            <span class="bg-blue-500 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
              <i data-feather="star" class="w-3 h-3 mr-1"></i>
              ${repo.stargazers_count} stars
            </span>
            <span class="bg-gray-500 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
              <i data-feather="git-branch" class="w-3 h-3 mr-1"></i>
              ${repo.forks_count} forks
            </span>
            <span class="bg-teal-500 text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
              <i data-feather="eye" class="w-3 h-3 mr-1"></i>
              ${repo.watchers_count} watchers
            </span>
            ${
              repo.language
                ? `
            <span class="bg-black text-white text-xs font-medium px-2.5 py-1 rounded-full flex items-center">
              <i data-feather="code" class="w-3 h-3 mr-1"></i>
              ${repo.language}
            </span>`
                : ""
            }
          </div>

          <div class="repo-images mt-4"></div>
        </div>

        <div class="p-6 bg-gray-50 rounded-b-lg border-t border-gray-100">
          <div class="flex flex-wrap gap-2">
            <a href="${repo.html_url}/commits" 
               class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500" 
               target="_blank">
              <i data-feather="git-commit" class="w-4 h-4 mr-2"></i>
              View Commits
            </a>
            <a href="${repo.html_url}/issues" 
               class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500" 
               target="_blank">
              <i data-feather="alert-circle" class="w-4 h-4 mr-2"></i>
              Issues
            </a>
            <a href="${repo.html_url}" 
               class="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-100 hover:text-gray-900 transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500" 
               target="_blank">
              <i data-feather="external-link" class="w-4 h-4 mr-2"></i>
              Check Repo
            </a>
          </div>
        </div>
      `;

      // Try to fetch repository contents to find images
      try {
        const contentsResponse = await fetch(
          `https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/contents`
        );
        if (contentsResponse.ok) {
          const contents = await contentsResponse.json();
          const imageFile = contents.find((file) =>
            /\.(jpg|jpeg|png|gif)$/i.test(file.name)
          );

          if (imageFile) {
            const imagesDiv = card.querySelector(".repo-images");
            imagesDiv.innerHTML = `
              <img src="${imageFile.download_url}" 
                   class="w-full h-48 object-cover rounded-lg" 
                   alt="Image from ${repo.name}">
            `;
          }
        }
      } catch (error) {
        console.log(`Could not fetch images for ${repo.name}`);
      }

      col.appendChild(card);
      reposDiv.appendChild(col);

      // Initialize Feather icons for the new content
      feather.replace();
    });
  } catch (error) {
    errorDiv.classList.remove("hidden");
    errorDiv.innerHTML = `
      <div class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
        <strong class="font-bold">Error:</strong>
        <span class="block sm:inline"> ${
          error.message || "An error occurred while fetching repositories"
        }</span>
      </div>
    `;
  }
}

// Fetch repositories when the page loads
document.addEventListener("DOMContentLoaded", fetchRepositories);
