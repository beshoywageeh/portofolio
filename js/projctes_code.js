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
        <div class="p-4 flex-grow">
          <!-- Header Section -->
          <div class="flex justify-between items-start mb-3">
        <h5 class="text-lg font-bold text-gray-800">
          <a href="${
            repo.html_url
          }" class="hover:text-blue-500 transition duration-200" target="_blank">
            ${repo.name}
          </a>
        </h5>
        <span class="text-white text-xs px-2 py-0.5 rounded-full ${
          repo.private ? "bg-red-400" : "bg-green-400"
        }">
          ${repo.private ? "Private" : "Public"}
        </span>
          </div>
          
          <!-- Description -->
          <p class="text-sm text-gray-600 mb-3 line-clamp-2">
        ${repo.description || "No description available"}
          </p>

          <!-- Stats Grid -->
          <div class="grid grid-cols-2 gap-2 mb-3 text-xs text-gray-500">
        <div class="flex items-center">
          <i data-feather="calendar-plus" class="w-3 h-3 mr-1"></i>
          <span>Created: ${formatDate(repo.created_at)}</span>
        </div>
        <div class="flex items-center">
          <i data-feather="calendar-check" class="w-3 h-3 mr-1"></i>
          <span>Updated: ${formatDate(repo.updated_at)}</span>
        </div>
        ${
          repo.pushed_at
            ? `
        <div class="flex items-center col-span-2">
          <i data-feather="code" class="w-3 h-3 mr-1"></i>
          <span>Last Push: ${formatDate(repo.pushed_at)}</span>
        </div>`
            : ""
        }
          </div>

          <!-- Repository Metrics -->
          <div class="flex flex-wrap gap-1.5 mb-3">
        ${[
          {
            icon: "star",
            count: repo.stargazers_count,
            label: "stars",
            color: "blue",
          },
          {
            icon: "git-branch",
            count: repo.forks_count,
            label: "forks",
            color: "gray",
          },
          {
            icon: "eye",
            count: repo.watchers_count,
            label: "watchers",
            color: "teal",
          },
        ]
          .map(
            ({ icon, count, label, color }) => `
          <span class="bg-${color}-400 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
            <i data-feather="${icon}" class="w-3 h-3 mr-1"></i>${count} ${label}
          </span>
        `
          )
          .join("")}
        ${
          repo.language
            ? `
          <span class="bg-gray-800 text-white text-xs px-2 py-0.5 rounded-full flex items-center">
            <i data-feather="code" class="w-3 h-3 mr-1"></i>${repo.language}
          </span>`
            : ""
        }
          </div>

          <!-- Repository Image -->
          <div class="repo-images mb-3"></div>
        </div>

        <!-- Action Buttons -->
        <div class="p-3 bg-gray-50 rounded-b-lg border-t">
          <div class="flex flex-wrap gap-1.5">
        ${[
          {
            href: `${repo.html_url}/commits`,
            icon: "git-commit",
            text: "Commits",
          },
          {
            href: `${repo.html_url}/issues`,
            icon: "alert-circle",
            text: "Issues",
          },
          { href: repo.html_url, icon: "external-link", text: "Repo" },
        ]
          .map(
            ({ href, icon, text }) => `
          <a href="${href}" 
             class="inline-flex items-center px-2.5 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 hover:text-gray-800 transition duration-200" 
             target="_blank">
            <i data-feather="${icon}" class="w-3 h-3 mr-1"></i>${text}
          </a>
        `
          )
          .join("")}
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
