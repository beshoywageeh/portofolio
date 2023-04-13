feather.replace();
let projects = document.querySelector("#projects");

data.map(append_data);
function append_data(item) {
  projects.innerHTML += `<div id="${
    item.name
  }" class="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md dark:bg-gray-800 dark:border-gray-700 mr-4">
<a href="${item.github}">
   <img class="rounded-t-lg" src="${item.image}" alt="" />
</a>
<div class="p-5">
   <a href="${item.github}">
       <h5 class="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">${
         item.name
       }</h5>
   </a>
   <p class="mb-3 font-normal text-gray-700 dark:text-gray-400">${
     item.description
   }"</p>
   <a href="${item.github}" target="_blank" class="inline-flex 
    items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
       Check The Repo<i class="fab fa-github fa-2x ml-2 -mr-1"></i>
   </a>
   ${
     item.live != "#"
       ? `  <a
         href="${item.live}"
         target="_blank"
         class="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-green-700 rounded-lg hover:bg-green-800 focus:ring-4 focus:outline-none focus:ring-green-300 dark:bg-green-600 dark:hover:bg-green-700 dark:focus:ring-green-800"
       >
         Check Live<i class="fas fa-link fa-2x ml-2 -mr-1"></i>
       </a>
     `
       : ""
   }
</div>
</div>`;
}
