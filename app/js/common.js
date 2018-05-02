$(function() {

	// Custom JS
    $('.banner-slider').slick({
        infinite: false,
        arrows: false,
        dots: true,
        slidesToShow: 1,
        slidesToScroll: 1,
        draggable: false
    });
    $('.banner-slider').on('afterChange', function(event, slick, currentSlide) {
        setActiveTab(currentSlide)
    });
    $('.products-slider').slick({
        slidesToShow: 6,
        slidesToScroll: 1,
        dots: false,
        arrows: true,
        responsive: [
            {
                breakpoint: 1690,
                settings: {
                    slidesToShow: 5
                }
            },
            {
                breakpoint: 1220,
                settings: {
                    slidesToShow: 4
                }
            },
            {
                breakpoint: 960,
                settings: {
                    slidesToShow: 3
                }
            },
            {
                breakpoint: 768,
                settings: {
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 560,
                settings: {
                    slidesToShow: 1
                }
            }
        ]
    });
    $('.testi-slider').slick({
        slidesToShow: 1,
        slidesToScroll: 1,
        arrows: true,
        dots: false,
        autoplay: true,
        autoplaySpeed: 5000
    });
    var productSliderInitiated = 0;
    var initProductsSlider = function() {
        $('.tab.is-active .recipes-grid').slick({
            centerMode: true,
            slidesToShow: 3,
            infinite: false,
            dots: true,
            arrows: false,
            variableWidth: true,
            initialSlide: 0
        })
        productSliderInitiated = 1;
    }
    if (window.innerWidth <= 768) {
        initProductsSlider();
    }

    var ts = {activeTab: ''};
    $('.js-toggle-tab').on('click', function() {
        var _ = $(this);
        if (_.hasClass('is-active')) return;

        setActiveTab(_.index());
    });
    $('.js-toggle-tab-from-banner').on('click', function() {
        var index = $('.banner-slider').slick('slickCurrentSlide')
        setActiveTab(index);
    })
    var setActiveTab = function(index) {
        if (ts.activeTab == index) return;
        if (window.innerWidth <= 768) {
            $('.tab.is-active .recipes-grid').slick('unslick');
            productSliderInitiated = 0;
        }
        collapseAll();


        ts.activeTab = index;
        console.log(index)
        $('.js-toggle-tab, .tab').removeClass('is-active');
        $('.tab:nth-child('+ (index + 1)+'), .js-toggle-tab:nth-child('+ (index + 1)+')').addClass('is-active');
        if (window.innerWidth <= 768) {
            initProductsSlider();
        }

    }


    var cc = $('.clone-chamber'),
        cd = {visibleHeight: '', cloneHeight: '', resizeEvent: ''};
    var showRecipe = function(item) {

        collapseAll();

        var _ = item,
            recipe = _.parent().parent(),
            details = recipe.find($('.recipe-details')),
            clone = details.clone(),
            height;

        cc.append(clone);

        console.log(item)

        if (window.innerWidth <= 768) // shows mobile overlay
        {
            var data = {};
            data.title = clone.find('.recipe-top').text();
            data.calcHTML = clone.find('.calculation').clone();
            data.imagesHTML = clone.find('.image-col').clone();
            data.recipeHTML = clone.find('.process').clone();

            var overlay = $('.recipe-overlay--for-mobile');
            overlay.find('.m-recipe-img').append(data.imagesHTML);
            overlay.find('.m-recipe-title').text(data.title);
            overlay.find('.m-recipe-calc').append(data.calcHTML);
            overlay.find('.m-recipe-process').append(data.recipeHTML);

            $('body').addClass('recipe-overlay-is-active');

        }
        else // shows desktop collapsible
        {

            height = clone.height();
            cd.visibleHeight = cd.cloneHeight = height;

            recipe.addClass('is-collapsed add-transition');
            details.css('max-height', height + 'px');
            recipe.css('margin-bottom', (height - 20) + 'px');

            setTimeout(function() {
                $('.recipe.is-collapsed').removeClass('add-transition');
            }, 500);

            if (!cd.resizeEvent) {
                $(window).on('resize', function() {
                    recalcHeight();
                })
            }
        }
    }

    $(window).on('click', function(e) {
        var _ = $(e.target);
        if (_.hasClass('js-collapse-recipe')) {
            showRecipe(_);
        } else if (_.parent().hasClass('js-collapse-recipe')) {
            showRecipe(_.parent());
        } else if  (_.hasClass('js-close-recipe')) {
            console.log(0)
            collapseAll();
        };
    })

    $('.js-close-recipe').on('click', function() {
        collapseAll();
    });
    var collapseAll = function() {
        cd.visibleHeight = cd.cloneHeight = '';
        $('.recipe.is-collapsed').addClass('add-transition')
        $('.recipe').removeClass('is-collapsed');
        $('.recipe, .recipe-details').removeAttr('style');
        cc.empty();
        setTimeout(function() {
            $('.recipe').removeClass('add-transition');
        }, 500);
    };

    $('.js-close-overlay, .js-close-overlay-bottom').on('click', function() {
        hideRecipeOverlay();
    })

    var hideRecipeOverlay = function() {
        $('.m-recipe-calc, .m-recipe-title, .m-recipe-process, .m-recipe-img').empty();
        $('body').removeClass('recipe-overlay-is-active');
    }

    var recalcHeight = function() {
        if (!$('.recipe').hasClass('is-collapsed')) return;

        var clone = cc.find($('.recipe-details'));
        if (clone.height() != cd.cloneHeight) {
            var recipe = $('.recipe.is-collapsed'),
                details = recipe.find($('.recipe-details'));

            cd.visibleHeight = cd.cloneHeight = clone.height();
            details.css('max-height', cd.visibleHeight + 'px');
            recipe.css('margin-bottom', (cd.visibleHeight - 20) + 'px');
        }
    };

    // mobile nav appearance
    $('.js-toggle-mnav').on('click', function() {
        var body = $('body');
        if (body.hasClass('mnav-active')) {
            closeMobileNav();
        } else if (!body.hasClass('mnav-active')) {
            openMboileNav();
        }
    });

    $('.js-scroll-to').on('click', function() {
        closeMobileNav();
    })

    var openMboileNav = function() {
        $('body').addClass('mnav-active');
    }
    var closeMobileNav = function() {
        $('body').removeClass('mnav-active');
    }




    $(window).on('resize', function() {
        if (window.innerWidth > 768)
        {
            if (productSliderInitiated)
            {
                $('.tab.is-active .recipes-grid').slick('unslick');
                productSliderInitiated = 0;
            }

            if ($('body').hasClass('mnav-active'))
            {
                console.log('close fired from resize listener');
                closeMobileNav()
            };

            if ($('body').hasClass('recipe-overlay-is-active'))
            {
                hideRecipeOverlay();
            };
        }
        else if (window.innerWidth <= 768)
        {
            if (!productSliderInitiated)
            {
                collapseAll();
                initProductsSlider();
                productSliderInitiated = 1;
            }
        }
    })


    // nav & banner scroll
    // Select all links with hashes
    $('a[href*="#"]')
    // Remove links that don't actually link to anything
        .not('[href="#"]')
        .not('[href="#0"]')
        .click(function(event) {
            // On-page links
            if (
                location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '')
                &&
                location.hostname == this.hostname
            ) {
                // Figure out element to scroll to
                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                // Does a scroll target exist?
                if (target.length) {
                    // Only prevent default if animation is actually gonna happen
                    event.preventDefault();
                    $('html, body').animate({
                        scrollTop: target.offset().top
                    }, 1000, function() {
                        // Callback after animation
                        // Must change focus!
                        var $target = $(target);
                        $target.focus();
                        if ($target.is(":focus")) { // Checking if the target was focused
                            return false;
                        } else {
                            $target.attr('tabindex','-1'); // Adding tabindex for elements not focusable
                            $target.focus(); // Set focus again
                        };
                    });
                }
            }
        });




});
