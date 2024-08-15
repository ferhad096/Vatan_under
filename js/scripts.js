$(function() {

    "use strict";

    var wind = $(window);



    // scrollIt
    $.scrollIt({
      upKey: 38,                // key code to navigate to the next section
      downKey: 40,              // key code to navigate to the previous section
      easing: 'swing',          // the easing function for animation
      scrollTime: 600,          // how long (in ms) the animation takes
      activeClass: 'active',    // class given to the active nav element
      onPageChange: null,       // function(pageIndex) that is called when page is changed
      topOffset: -80            // offste (in px) for fixed top navigation
    });



    // navbar scrolling background
    wind.on("scroll",function () {

        var bodyScroll = wind.scrollTop(),
            navbar = $(".navbar"),
            logo = $(".navbar .logo> img");

        if(bodyScroll > 100){

            navbar.addClass("nav-scroll");
            // logo.attr('src', 'img/logo-dark.png');

        }else{

            navbar.removeClass("nav-scroll");
            // logo.attr('src', 'img/logo-light.png');
        }
    });



    // progress bar
    wind.on('scroll', function () {
        $(".skills-progress span").each(function () {
            var bottom_of_object = 
            $(this).offset().top + $(this).outerHeight();
            var bottom_of_window = 
            $(window).scrollTop() + $(window).height();
            var myVal = $(this).attr('data-value');
            if(bottom_of_window > bottom_of_object) {
                $(this).css({
                  width : myVal
                });
            }
        });
    });



    // sections background image from data background
    var pageSection = $(".bg-img, section");
    pageSection.each(function(indx){
        
        if ($(this).attr("data-background")){
            $(this).css("background-image", "url(" + $(this).data("background") + ")");
        }
    });


    // === owl-carousel === //

    // Blog owlCarousel
    $('.blog .owl-carousel').owlCarousel({
        loop:true,
        margin: 30,
        mouseDrag:false,
        autoplay:true,
        smartSpeed:500,
        responsiveClass:true,
        responsive:{
            0:{
                items:1
            },
            700:{
                items:2
            },
            1000:{
                items:3
            }
        }
    });

    // === End owl-carousel === //


    // magnificPopup
    $('.gallery').magnificPopup({
        delegate: '.popimg',
        type: 'image',
        gallery: {
            enabled: true
        }
    });

});


// === window When Loading === //

$(window).on("load",function (){

    var wind = $(window);

    // Preloader
    $(".loading").fadeOut(500);


    // stellar
    wind.stellar();


    // contact form validator
    $('#contact-form').validator();

    $('#contact-form').on('submit', function (e) {
        if (!e.isDefaultPrevented()) {
            var url = "contact.php";

            $.ajax({
                type: "POST",
                url: url,
                data: $(this).serialize(),
                success: function (data)
                {
                    var messageAlert = 'alert-' + data.type;
                    var messageText = data.message;

                    var alertBox = '<div class="alert ' + messageAlert + ' alert-dismissable"><button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>' + messageText + '</div>';
                    if (messageAlert && messageText) {
                        $('#contact-form').find('.messages').html(alertBox);
                        $('#contact-form')[0].reset();
                    }
                }
            });
            return false;
        }
    });

});


$(document).ready(function () {
  function runIsotope() {
    if ($(".gallery").data("isotope")) {
      $(".gallery").isotope("reloadItems").isotope();
    } else {
      $(".gallery").isotope({
        itemSelector: ".items",
      });
    }

    $(".filtering").on("click", "span", function () {
      var filterValue = $(this).attr("data-filter");
      $(".gallery").isotope({ filter: filterValue });
    });

    $(".filtering").on("click", "span", function () {
      $(this).addClass("active").siblings().removeClass("active");
    });
    console.log("Running Isotope...");
  }

  fetch("js/images.json")
    .then((response) => response.json())
    .then((imagesArray) => renderAllImages(imagesArray));

  const itemsPerPage = 10;
  let currentPage = 1;
  let imagesArray = [];

  const gallery = document.querySelector(".gallery");
  const paginationContainer = document.querySelector(".pagination");

  // Function to shuffle the array
  function shuffleArray(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
  }

  function renderAllImages(data) {
    imagesArray = data;

    // Shuffle the images
    shuffleArray(imagesArray);

    renderPage(currentPage);
    renderPaginationControls();
  }

  // function renderPage(pageNumber) {
  //   gallery.innerHTML = ""; // Clear the gallery before rendering the new page
  //   const startIndex = (pageNumber - 1) * itemsPerPage;
  //   const endIndex = Math.min(startIndex + itemsPerPage, imagesArray.length);
  //   const imagesToDisplay = imagesArray.slice(startIndex, endIndex);

  //   imagesToDisplay.forEach((image) => renderOneImage(image));

  //   // Initialize Isotope after the gallery has been updated
  //   setTimeout(() => {
  //     runIsotope();
  //   }, 100); // Adjust timeout if necessary
  // }
  function renderPage(pageNumber) {
    gallery.innerHTML = ""; // Clear the gallery before rendering the new page
    const startIndex = (pageNumber - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, imagesArray.length);
    const imagesToDisplay = imagesArray.slice(startIndex, endIndex);

    imagesToDisplay.forEach((image) => renderOneImage(image));

    // Ensure Isotope runs after all images are fully loaded
    imagesLoaded(gallery, function () {
      runIsotope(); // Initialize Isotope only after images are loaded
    });
  }


  function renderOneImage(image) {
    const newElement = document.createElement("div");
    newElement.className = `col-md-6 col-lg-4 items`;
    newElement.innerHTML = `
          <div class="item-img">
              <img src="${image.path}" alt="image">
              <div class="item-img-overlay valign">
                  <div class="overlay-info full-width vertical-center">
                      <h6>${image.description}</h6>
                  </div>
                  <a href="${image.originPath}" class="popimg">
                      <i class="fas fa-images"></i>
                  </a>
              </div>
          </div>
      `;
    gallery.append(newElement);
  }

  function renderPaginationControls() {
    paginationContainer.innerHTML = ""; // Clear existing controls
    const totalPages = Math.ceil(imagesArray.length / itemsPerPage);

    for (let i = 1; i <= totalPages; i++) {
      const pageButton = document.createElement("button");
      pageButton.innerText = i;
      pageButton.className = "pagination-button";

      // Add active class to the current page button
      if (i === currentPage) {
        pageButton.classList.add("active");
      }

      pageButton.addEventListener("click", () => {
        currentPage = i;
        renderPage(currentPage);

        // Update active class on pagination buttons
        const allButtons =
          paginationContainer.querySelectorAll(".pagination-button");
        allButtons.forEach((button) => button.classList.remove("active"));
        pageButton.classList.add("active");
      });

      paginationContainer.append(pageButton);
    }
  }

  function addNavigationControls() {
    const prevButton = document.createElement("button");
    prevButton.innerText = "Previous";
    prevButton.addEventListener("click", () => {
      if (currentPage > 1) {
        currentPage--;
        renderPage(currentPage);
      }
    });

    const nextButton = document.createElement("button");
    nextButton.innerText = "Next";
    nextButton.addEventListener("click", () => {
      if (currentPage < Math.ceil(imagesArray.length / itemsPerPage)) {
        currentPage++;
        renderPage(currentPage);
      }
    });

    paginationContainer.prepend(prevButton);
    paginationContainer.append(nextButton);
  }

  // Initialize pagination
  addNavigationControls();
});
