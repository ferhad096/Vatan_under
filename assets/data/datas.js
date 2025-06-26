//   fetch('assets/data/blog-detail.json')
//     .then(response => {
//       if (!response.ok) {
//         throw new Error('JSON faylı yüklənmədi.');
//       }
//       return response.json();
//     })
//     .then(blogData => {
//       const contentContainer = document.querySelector('.card-blog .text');
//       document.querySelector(".card-blog h2").textContent = blogData.title;
//       document.querySelector(".card-blog h5").textContent = blogData.date;
//       document.querySelector(".card-blog img").src = blogData["hero-img"];
//       blogData.content.forEach(item => {
//         if (item.type === 'text') {
//           const p = document.createElement('p');
//           p.textContent = item.value;
//           p.style.textIndent = '30px';
//           p.style.textAlign = 'justify'; 
//           p.style.marginBottom = '15px';
//           contentContainer.appendChild(p);
//         } else if (item.type === 'image') {
//           const img = document.createElement('img');
//           img.src = item.src;
//           img.alt = item.alt || '';
//           img.style.display = 'block';
//           img.style.margin = '20px auto';
//           img.style.maxWidth = '100%';
//           contentContainer.appendChild(img);
//         }
        
//       });
//       const author = document.createElement("p");
//       author.textContent = blogData.author;
//       author.style.fontWeight = "bold";
//       author.style.marginTop = "30px";

//       const university = document.createElement("p");
//       university.textContent = blogData.university;
//       university.style.fontStyle = "italic";
//       university.style.marginBottom = "40px";

//       // DOM-a əlavə et
//       contentContainer.appendChild(author);
//       contentContainer.appendChild(university);

//     })
//     .catch(error => {
//       console.error('Xəta:', error);
//     });

    

// URL-dən ?id= parametrini oxumaq funksiyası
function getQueryParam(param) {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get(param);
  }
  
  // Sayt yükləndikdə işləyən əsas funksiya
  document.addEventListener("DOMContentLoaded", () => {
    const id = getQueryParam("id");
  
    if (!id) {
      document.querySelector('.card-blog .text').innerHTML = "<p>Blog ID tapılmadı.</p>";
      return;
    }
  
    fetch('assets/data/blog-detail.json')
      .then(response => {
        if (!response.ok) {
          throw new Error('JSON faylı yüklənmədi.');
        }
        return response.json();
      })
      .then(blogData => {
        const blog = blogData.blogs.find(b => b.id == id);
  
        if (!blog) {
          document.querySelector('.card-blog .text').innerHTML = "<p>Blog tapılmadı.</p>";
          return;
        }
  
        const contentContainer = document.querySelector('.card-blog .text');
        document.querySelector(".card-blog h2").textContent = blog.title;
        document.querySelector(".card-blog h5").textContent = blog.date;
        document.querySelector(".card-blog img").src = blog["hero-img"];
  
        blog.content.forEach(item => {
          if (item.type === 'text') {
            const p = document.createElement('p');
            p.textContent = item.value;
            p.style.textIndent = '30px';
            p.style.textAlign = 'justify';
            p.style.marginBottom = '15px';
            contentContainer.appendChild(p);
          } else if (item.type === 'image') {
            const img = document.createElement('img');
            img.src = item.src;
            img.alt = item.alt || '';
            img.style.display = 'block';
            img.style.margin = '20px auto';
            img.style.maxWidth = '100%';
            contentContainer.appendChild(img);
          }
        });
  
        // Məlumatın sonuna müəllif və universiteti əlavə et
        if (blog.author) {
          const author = document.createElement("p");
          author.textContent = blog.author;
          author.style.fontWeight = "bold";
          author.style.marginTop = "30px";
          contentContainer.appendChild(author);
        }
  
        if (blog.university) {
          const university = document.createElement("p");
          university.textContent = blog.university;
          university.style.fontStyle = "italic";
          university.style.marginBottom = "40px";
          contentContainer.appendChild(university);
        }
      })
      .catch(error => {
        console.error('Xəta:', error);
        document.querySelector('.card-blog .text').innerHTML = "<p>Xəta baş verdi.</p>";
      });
  });
  