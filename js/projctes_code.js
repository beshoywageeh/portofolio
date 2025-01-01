// Configure your GitHub username and personal access token here
const GITHUB_USERNAME = 'beshoywageeh';
const GITHUB_TOKEN = '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'; // Change this to your GitHub personal access token

// Format date to a more readable format
function formatDate(dateString) {
    const options = { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric', 
        hour: '2-digit', 
        minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString('en-US', options);
}

async function fetchRepositories() {
    const errorDiv = document.getElementById('error-message');
    const reposDiv = document.getElementById('projects');
    
    try {
        // Fetch repositories
        const response = await fetch(`https://api.github.com/users/${GITHUB_USERNAME}/repos?sort=updated&direction=desc`, {
            headers: {
                Authorization: `Bearer ${GITHUB_TOKEN}`
            }
        });
        
        if (!response.ok) {
            if (response.status === 403) {
                errorDiv.classList.remove('d-none');
                errorDiv.textContent = '403 Forbidden. You have exceeded the GitHub API rate limit. Please wait some time before trying again.';
            } else {
                throw new Error('Failed to fetch repositories');
            }
        }

        const repos = await response.json();
        
        // Filter out forked repositories
        const originalRepos = repos.filter(repo => !repo.fork);

        if (originalRepos.length === 0) {
            reposDiv.innerHTML = `
            <div class="col-12">
                <div class="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative" role="alert">
                    <strong class="font-bold">No original repositories found.</strong>
                </div>
            </div>
            `;
            return;
        }

        // Display repositories
        originalRepos.forEach(async (repo) => {
            const col = document.createElement('div');
            col.className = 'col-12 col-md-6 col-lg-4';

            const card = document.createElement('div');
            card.className = 'shadow-sm card h-100';

            // Add repository information
            card.innerHTML = `
                <div class="card-body">
                    <div class="flex justify-between items-start mb-2">
                        <h5 class="text-lg font-semibold mb-0">
                            <a href="${repo.html_url}" class="no-underline" target="_blank">
                                ${repo.name}
                            </a>
                        </h5>
                        <span class="${repo.private ? 'bg-red-500' : 'bg-green-500'} text-white text-xs font-medium px-2 py-1 rounded">
                            ${repo.private ? 'Private' : 'Public'}
                        </span>
                    </div>
                    <p class="text-gray-600">
                        ${repo.description || 'No description available'}
                    </p>
                    
                    <div class="date-info mb-3">
                        <div class="flex items-center">
                            <i class="bi bi-calendar-plus mr-1"></i> Created: 
                            ${formatDate(repo.created_at)}
                        </div>
                        <div class="flex items-center">
                            <i class="bi bi-calendar-check mr-1"></i> Last Updated: 
                            ${formatDate(repo.updated_at)}
                        </div>
                        ${repo.pushed_at ? `
                        <div class="flex items-center">
                            <i class="bi bi-code-square mr-1"></i> Last Push: 
                            ${formatDate(repo.pushed_at)}
                        </div>` : ''}
                    </div>

                    <div class="flex gap-2 flex-wrap mb-3">
                        <span class="bg-blue-500 text-white text-xs font-medium px-2 py-1 rounded">
                            <i class="bi bi-star mr-1"></i> ${repo.stargazers_count} stars
                        </span>
                        <span class="bg-gray-500 text-white text-xs font-medium px-2 py-1 rounded">
                            <i class="bi bi-diagram-2 mr-1"></i> ${repo.forks_count} forks
                        </span>
                        <span class="bg-teal-500 text-white text-xs font-medium px-2 py-1 rounded">
                            <i class="bi bi-eye mr-1"></i> ${repo.watchers_count} watchers
                        </span>
                        ${repo.language ? `
                        <span class="bg-black text-white text-xs font-medium px-2 py-1 rounded">
                            <i class="bi bi-code-slash mr-1"></i> ${repo.language}
                        </span>` : ''}
                    </div>
                    <div class="repo-images mt-3"></div>
                </div>
                <div class="card-footer bg-transparent">
                    <a href="${repo.html_url}/commits" class="btn btn-sm border border-gray-300 text-gray-700 hover:bg-gray-100" target="_blank">
                        <i class="bi bi-git"></i> View Commits
                    </a>
                    <a href="${repo.html_url}/issues" class="btn btn-sm border border-gray-300 text-gray-700 hover:bg-gray-100 ms-2" target="_blank">
                        <i class="bi bi-exclamation-circle"></i> Issues
                    </a>
                    <a href="${repo.html_url}" class="btn btn-sm border border-gray-300 text-gray-700 hover:bg-gray-100 ms-2" target="_blank">
                        <i class="bi bi-link"></i> Check Repo
                    </a>
                </div>
            `;

            // Try to fetch repository contents to find images
            try {
                const contentsResponse = await fetch(`https://api.github.com/repos/${GITHUB_USERNAME}/${repo.name}/contents`, {
                    headers: {
                        Authorization: `Bearer ${GITHUB_TOKEN}`
                    }
                });
                if (contentsResponse.ok) {
                    const contents = await contentsResponse.json();
                    
                    // Look for image files in root directory
                    const imageFile = contents.find(file => 
                        /\.(jpg|jpeg|png|gif)$/i.test(file.name)
                    );

                    if (imageFile) {
                        const imagesDiv = card.querySelector('.repo-images');
                        imagesDiv.innerHTML = `
                            <img src="${imageFile.download_url}" 
                                 class="repo-image img-fluid" 
                                 alt="Image from ${repo.name}">
                        `;
                    }
                }
            } catch (error) {
                console.log(`Could not fetch images for ${repo.name}`);
            }

            col.appendChild(card);
            //document.querySelector('#mywork').appendChild(col);
            reposDiv.appendChild(col);
        });

    } catch (error) {
        errorDiv.classList.remove('d-none');
        errorDiv.textContent = error.message || 'An error occurred while fetching repositories';
    }
}

// Fetch repositories when the page loads
document.addEventListener('DOMContentLoaded', fetchRepositories);

