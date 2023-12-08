document.addEventListener("DOMContentLoaded", function () {
  const blogContainer = document.getElementById("blog-container");
  const filterButtons = document.querySelectorAll(".filter-button");
  let currentPage = 1;
  let isLoading = false;
  let selectedCategory = "Games"; // Cambia a la categoría deseada como predeterminada

  filterButtons.forEach((button) => {
    button.addEventListener("click", function () {
      selectedCategory = button.getAttribute("data-category");
      currentPage = 1;
      blogContainer.innerHTML = ""; // Limpiar el contenedor antes de cargar nuevas publicaciones
      fetchPosts(currentPage);
    });
  });

  function fetchPosts(page) {
    isLoading = true;
    fetch("posts.json")
      .then((response) => response.json())
      .then((data) => {
        isLoading = false;
        const postsPerPage = 5;
        const startIndex = (page - 1) * postsPerPage;
        const endIndex = startIndex + postsPerPage;
        let postsToRender = data.slice(startIndex, endIndex);

        // Aplicar el filtro si se seleccionó una categoría
        if (selectedCategory !== "all") {
          postsToRender = postsToRender.filter(post => post.category === selectedCategory);
        }

        // Si la categoría seleccionada no tiene posts para mostrar, hacer un fetch y mostrar
        if (postsToRender.length === 0) {
          fetchPostsByCategory(selectedCategory);
        } else {
          renderPosts(postsToRender);
          currentPage++;
        }
      })
      .catch((error) => {
        isLoading = false;
        console.error("Error fetching data:", error);
      });
  }

  function fetchPostsByCategory(category) {
    fetch("posts.json")
      .then((response) => response.json())
      .then((data) => {
        const postsToRender = data.filter(post => post.category === category);
        renderPosts(postsToRender);
      })
      .catch((error) => {
        console.error("Error fetching data:", error);
      });
  }
  function renderPosts(posts) {
    posts.forEach((post) => {
      const postElement = document.createElement("div");
      postElement.classList.add("post");
  
      let postContent = `
        <h2>${post.title}</h2>
        <p>${post.content}</p>
      `;
  
      if (post.image) {
        postContent += `
          <img src="${post.image}" alt="Imagen de la publicación">
        `;
      }

      if (post.websiteLink && post.websiteLink.trim() !== "") {
        postContent += `
          <a class="website-link" href="${post.websiteLink}" target="_blank">Click me !</a>
        `;
      }
  
      if (post.youtubeLink) {
        postContent += `
          <iframe width="560" height="315" src="https://www.youtube.com/embed/${post.youtubeLink}" frameborder="0" allowfullscreen></iframe>
        `;
      }
  
      postElement.innerHTML = postContent;
      blogContainer.appendChild(postElement);
    });
  }

  function checkScroll() {
    const scrollable = document.documentElement.scrollHeight - window.innerHeight;
    const scrolled = window.scrollY;

    if (scrolled >= scrollable * 0.8 && !isLoading) {
      fetchPosts(currentPage);
    }
  }

  // Cargar las primeras publicaciones al cargar la página
  fetchPosts(currentPage);

  // Agregar el evento de scroll para cargar más publicaciones
  window.addEventListener("scroll", checkScroll);
});
