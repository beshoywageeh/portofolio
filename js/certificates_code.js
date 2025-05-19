function renderCertificates() {
    const certificatesContainer = document.getElementById('certificates-container');
    if (!certificatesContainer) return;

    const certificatesHTML = certificates.map(cert => `
        <div class="group relative overflow-hidden bg-slate-800 rounded-lg border border-slate-700 transition-all duration-500 hover:shadow-xl hover:shadow-blue-500/30 hover:scale-[1.02] hover:border-blue-500/50">
            <div class="absolute inset-0 transition-opacity duration-300 opacity-0 bg-gradient-to-b from-transparent to-slate-900/90 group-hover:opacity-100">
            </div>
            <img src="${cert.image}" alt="${cert.title}"
                class="object-cover w-full h-48 transition-transform duration-500 group-hover:scale-110">
            <div class="relative z-10 p-6">
                <h3 class="mb-2 text-xl font-semibold text-white transition-colors duration-300 group-hover:text-blue-400">
                    ${cert.title}</h3>
                <p class="mb-4 text-gray-400 transition-colors duration-300 group-hover:text-gray-300">${cert.organization} • ${cert.date}</p>
                <a href="${cert.link}"
                    class="inline-flex items-center text-blue-400 transition-all duration-300 hover:text-blue-300 group-hover:translate-x-2">
                    View Certificate
                    <svg class="w-4 h-4 ml-2 transition-transform duration-300 transform group-hover:translate-x-1" 
                         fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14 5l7 7m0 0l-7 7m7-7H3" />
                    </svg>
                </a>
            </div>
        </div>
    `).join('');

    certificatesContainer.innerHTML = certificatesHTML;
}

// Call the function when the DOM is loaded
document.addEventListener('DOMContentLoaded', renderCertificates); 