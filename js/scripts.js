let slickInitDone = false;
let previousImageId = 0,
    currentImageId = 0;
let pageAlign = "right";
let bgCycle;
let links;
let eachNavLink;

window.onload = function() {
    $("body").addClass("loaded");
};

function navLinkClick(e) {
    if ($(e.target).hasClass("external")) {
        return;
    }

    e.preventDefault();

    if ($(e.target).data("align")) {
        pageAlign = $(e.target).data("align");
    }

    // Change bg image
    previousImageId = currentImageId;
    currentImageId = $(e.target).data("linkid");
    bgCycle.cycleToNextImage(previousImageId, currentImageId);

    // Change menu item highlight
    $(`.tm-nav-item:eq(${previousImageId})`).removeClass("active");
    $(`.tm-nav-item:eq(${currentImageId})`).addClass("active");

    // Change page content
    $(`.tm-section-${previousImageId}`).fadeOut(function(e) {
        $(`.tm-section-${currentImageId}`).fadeIn();
        // Gallery
        if (currentImageId === 2) {
            setupSlider();
        }
    });

    adjustFooter();
}

$(document).ready(function() {
    // Set first page
    $(".tm-section").fadeOut(0);
    $(".tm-section-0").fadeIn();

    // Set Background images
    // https://www.jqueryscript.net/slideshow/Simple-jQuery-Background-Image-Slideshow-with-Fade-Transitions-Background-Cycle.html
    bgCycle = $("body").backgroundCycle({
        imageUrls: [
            "pics/photo-02.jpg",
            "pics/photo-03.jpg",
            "pics/photo-04.jpg",
            "pics/photo-05.jpg"
        ],
        fadeSpeed: 2000,
        duration: -1,
        backgroundSize: SCALING_MODE_COVER
    });

    eachNavLink = $(".tm-nav-link");
    links = $(".tm-nav-links");

    // "Menu" open/close
    if (links.hasClass("open")) {
        links.fadeIn(0);
    } else {
        links.fadeOut(0);
    }

    $("#tm_about_link").on("click", navLinkClick);
    $("#tm_work_link").on("click", navLinkClick);

    // Each menu item click
    eachNavLink.on("click", navLinkClick);

    $(".tm-navbar-menu").click(function(e) {
        if (links.hasClass("open")) {
            links.fadeOut();
        } else {
            links.fadeIn();
        }

        links.toggleClass("open");
    });

    // window resize
    $(window).resize(function() {
        // If current page is Gallery page, set it up
        if (currentImageId === 2) {
            setupSlider();
        }

        // Adjust footer
        adjustFooter();
    });

    adjustFooter();
}); // DOM is ready

function adjustFooter() {
    const windowHeight = $(window).height();
    const topHeight = $(".tm-top-container").height();
    const middleHeight = $(".tm-content").height();
    let contentHeight = topHeight + middleHeight;

    if (pageAlign === "left") {
        contentHeight += $(".tm-bottom-container").height();
    }

    if (contentHeight > windowHeight) {
        $(".tm-bottom-container").addClass("tm-static");
    } else {
        $(".tm-bottom-container").removeClass("tm-static");
    }
}

function setupSlider() {
    let slidesToShow = 4;
    let slidesToScroll = 2;
    let windowWidth = $(window).width();

    if (windowWidth < 480) {
        slidesToShow = 1;
        slidesToScroll = 1;
    } else if (windowWidth < 768) {
        slidesToShow = 2;
        slidesToScroll = 1;
    } else if (windowWidth < 992) {
        slidesToShow = 3;
        slidesToScroll = 2;
    }

    if (slickInitDone) {
        $(".tm-gallery").slick("unslick");
    }

    slickInitDone = true;

    $(".tm-gallery").slick({
        dots: true,
        customPaging: function(slider, i) {
            var thumb = $(slider.$slides[i]).data();
            return `<a>${i + 1}</a>`;
        },
        infinite: true,
        prevArrow: false,
        nextArrow: false,
        slidesToShow: slidesToShow,
        slidesToScroll: slidesToScroll
    });

    // Open big image when a gallery image is clicked.
    $(".slick-list").magnificPopup({
        delegate: "a",
        type: "image",
        gallery: {
            enabled: true
        }
    });
}