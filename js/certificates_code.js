function renderCertificates() {
    const certificatesContainer = document.getElementById('certificates-container');
    if (!certificatesContainer) return;

    // Create modal container if it doesn't exist
    let modalContainer = document.getElementById('certificate-modal');
    if (!modalContainer) {
        modalContainer = document.createElement('div');
        modalContainer.id = 'certificate-modal';
        modalContainer.className = 'fixed inset-0 z-50 hidden items-center justify-center backdrop-blur-sm transition-all duration-300';
        modalContainer.innerHTML = `
            <div class="absolute inset-0 bg-black/80 transition-opacity duration-300"></div>
            <div class="relative max-w-5xl w-full mx-4 transform transition-all duration-500 scale-95 opacity-0" id="modal-content">
                <button id="close-modal" class="absolute -top-16 right-0 text-white hover:text-blue-400 transition-colors p-2 rounded-full hover:bg-white/10 z-50">
                    <svg class="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
                <div class="bg-slate-900/95 rounded-xl overflow-hidden shadow-2xl border border-slate-700/50">
                    <div class="p-4">
                        <div class="w-full max-w-xl mx-auto">
                            <img id="modal-image" src="" alt="" 
                                class="w-full h-auto rounded-xl bg-slate-800/50">
                        </div>
                    </div>
                    <div class="p-6 space-y-4">
                        <div class="flex items-start justify-between">
                            <div>
                                <h3 id="modal-title" class="text-2xl font-bold text-white mb-2"></h3>
                                <p id="modal-org" class="text-blue-400 font-medium"></p>
                            </div>
                            <div class="text-right">
                                <p id="modal-date" class="text-gray-400 text-sm"></p>
                                <a id="modal-link" href="#" target="_blank" 
                                   class="inline-flex items-center mt-2 text-blue-400 hover:text-blue-300 transition-colors">
                                    View Original Certificate
                                    <svg class="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                                    </svg>
                                </a>
                            </div>
                        </div>
                        <div class="flex gap-2 mt-4 justify-center">
                            <button id="prev-cert" class="p-2 text-white hover:text-blue-400 transition-colors rounded-full hover:bg-white/10">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                                </svg>
                            </button>
                            <button id="next-cert" class="p-2 text-white hover:text-blue-400 transition-colors rounded-full hover:bg-white/10">
                                <svg class="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                                </svg>
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        document.body.appendChild(modalContainer);

        // Add event listeners
        const closeModal = () => {
            const modalContent = document.getElementById('modal-content');
            modalContent.classList.add('scale-95', 'opacity-0');
            setTimeout(() => {
                modalContainer.classList.add('hidden');
                modalContainer.classList.remove('flex');
            }, 300);
        };

        document.getElementById('close-modal').addEventListener('click', (e) => {
            e.stopPropagation();
            closeModal();
        });

        modalContainer.addEventListener('click', (e) => {
            if (e.target === modalContainer) closeModal();
        });

        // Navigation buttons
        let currentIndex = 0;
        document.getElementById('prev-cert').addEventListener('click', () => {
            currentIndex = (currentIndex - 1 + certificates.length) % certificates.length;
            openCertificateModal(certificates[currentIndex].image, certificates[currentIndex].title, 
                certificates[currentIndex].organization, certificates[currentIndex].date, 
                certificates[currentIndex].link, currentIndex);
        });

        document.getElementById('next-cert').addEventListener('click', () => {
            currentIndex = (currentIndex + 1) % certificates.length;
            openCertificateModal(certificates[currentIndex].image, certificates[currentIndex].title, 
                certificates[currentIndex].organization, certificates[currentIndex].date, 
                certificates[currentIndex].link, currentIndex);
        });

        // Image hover effect
        const modalImage = document.getElementById('modal-image');
        const imageOverlay = document.getElementById('image-overlay');
        modalImage.addEventListener('mouseenter', () => imageOverlay.classList.remove('opacity-0'));
        modalImage.addEventListener('mouseleave', () => imageOverlay.classList.add('opacity-0'));
    }

    const certificatesHTML = certificates.map((cert, index) => `
        <div class="group relative overflow-hidden bg-slate-800 rounded-lg border border-slate-700 transition-all duration-500 hover:shadow-2xl hover:shadow-blue-500/20 hover:scale-[1.02] hover:border-blue-500/50 hover:-translate-y-1">
            <div class="absolute inset-0 transition-all duration-500 opacity-0 bg-gradient-to-b from-transparent via-slate-900/70 to-slate-900/95 group-hover:opacity-100 backdrop-blur-[2px]">
                <div class="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-500">
                    <div class="transform translate-y-4 group-hover:translate-y-0 transition-transform duration-500">
                        <button onclick="openCertificateModal('${cert.image}', '${cert.title}', '${cert.organization}', '${cert.date}', '${cert.link}', ${index})"
                            class="px-4 py-2 bg-blue-500/20 hover:bg-blue-500/30 text-blue-400 rounded-full backdrop-blur-sm transition-all duration-300 hover:scale-105 border border-blue-500/30">
                            View Details
                        </button>
                    </div>
                </div>
            </div>
            <div class="aspect-[4/3] overflow-hidden">
                <img src="${cert.image}" alt="${cert.title}"
                    class="w-full h-full object-cover transition-all duration-500 group-hover:scale-110 group-hover:brightness-75 cursor-pointer"
                    onclick="openCertificateModal('${cert.image}', '${cert.title}', '${cert.organization}', '${cert.date}', '${cert.link}', ${index})">
            </div>
            <div class="relative z-10 p-6 transform transition-all duration-500 group-hover:translate-y-[-0.5rem]">
                <div class="flex items-start justify-between mb-2">
                    <h3 class="text-xl font-semibold text-white transition-colors duration-300 group-hover:text-blue-400 group-hover:translate-x-1">
                        ${cert.title}
                    </h3>
                    <span class="text-sm text-blue-400/0 group-hover:text-blue-400 transition-colors duration-300">
                        ${cert.date}
                    </span>
                </div>
                <p class="mb-4 text-gray-400 transition-colors duration-300 group-hover:text-gray-300 group-hover:translate-x-1">
                    ${cert.organization}
                </p>
                <div class="flex gap-4 opacity-0 group-hover:opacity-100 transform translate-y-4 group-hover:translate-y-0 transition-all duration-500">
                    <a href="${cert.link}"
                        class="inline-flex items-center text-blue-400 transition-all duration-300 hover:text-blue-300 hover:scale-105"
                        target="_blank">
                        View Certificate
                        <svg class="w-4 h-4 ml-2 transition-transform duration-300 transform group-hover:translate-x-1" 
                             fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                    </a>
                    <button onclick="openCertificateModal('${cert.image}', '${cert.title}', '${cert.organization}', '${cert.date}', '${cert.link}', ${index})"
                        class="inline-flex items-center text-blue-400 transition-all duration-300 hover:text-blue-300 hover:scale-105">
                        View Gallery
                        <svg class="w-4 h-4 ml-2 transition-transform duration-300 group-hover:rotate-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5v-4m0 4h-4m4 0l-5-5" />
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `).join('');

    certificatesContainer.innerHTML = certificatesHTML;
}

// Function to open certificate modal
function openCertificateModal(imageUrl, title, organization, date, link, index) {
    const modal = document.getElementById('certificate-modal');
    const modalContent = document.getElementById('modal-content');
    const modalImage = document.getElementById('modal-image');
    const modalTitle = document.getElementById('modal-title');
    const modalOrg = document.getElementById('modal-org');
    const modalDate = document.getElementById('modal-date');
    const modalLink = document.getElementById('modal-link');

    // Preload the image
    const img = new Image();
    img.onload = function() {
        modalImage.src = imageUrl;
        modalTitle.textContent = title;
        modalOrg.textContent = organization;
        modalDate.textContent = date;
        modalLink.href = link;

        modal.classList.remove('hidden');
        modal.classList.add('flex');
        
        // Trigger animation
        requestAnimationFrame(() => {
            modalContent.classList.remove('scale-95', 'opacity-0');
        });
    };
    img.src = imageUrl;
}

// Call the function when the DOM is loaded
document.addEventListener('DOMContentLoaded', renderCertificates); 