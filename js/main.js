window.onload = function() {

    $('#navbar-affix').css({
        "top": $(".header-container").outerHeight(true) + "px"
    });
};
$(document).ready(function() {

    $('.dropdown').hover(function() {
        $(this).siblings().removeClass("open");
    });


    $('#navbar-affix').affix({
        offset: {
            top: function() {
                return ($('.company-img').outerHeight(true) + 7);
            }
        }
    });
    $('#navbar-affix').css({
        "top": $(".header-container").outerHeight(true) + "px"
    });
    $(window).resize(function() {
        $('#navbar-affix').css({
            "top": $(".header-container").outerHeight(true) + "px"
        });
    });
    $("#navbar-affix").on('affixed.bs.affix', function() {
        $('#company-navbar .affix').css({
            "top": $(".header-container").outerHeight(true) + "px"
        });
    });


    $("body").prepend('<div class="sidepanel sidepanel-left" id="sidepanel-left"></div><div class="sidepanel sidepanel-right" id="sidepanel-right"></div><div class="sidepanel-overlay" id="sidepanel-right" style="display:none;"></div>');
    $(".sidepanel-right").append('<div class="sidepanel-close sidepanel-right-close"> <span class="glyphicon glyphicon-remove"></span></div>');
    $(".sidepanel-right").append($("#header-bottom-nav").html());
    $(".sidepanel-left").append('<div class="sidepanel-close sidepanel-left-close"> <span class="glyphicon glyphicon-remove"></span></div>');
    $(".sidepanel-left").append($("#company-nav").html());

    /*$('.sidepanel .dropdown').on('show.bs.dropdown', function(e){
        $(this).find('.dropdown-menu').first().stop(true, true).slideDown();
      });


      $('.sidepanel .dropdown').on('hide.bs.dropdown', function(e){
      $(this).find('.dropdown-menu').first().stop(true, true).slideUp(0);
      });*/
    $('.sidepanel-toggle').click(function() {
        if ($($(this).attr("data-sidepanel-target")).hasClass("active")) {
            $(".sidepanel").removeClass("active");
            $(".sidepanel-overlay").fadeOut();
        } else {
            $(".sidepanel").removeClass("active");
            $($(this).attr("data-sidepanel-target")).addClass("active");
            $(".sidepanel-overlay").fadeIn();

        }
        return false;
    });
    var sidepanelshort = false;
    if (!sidepanelshort) {
        $($('.sidepanel-short-toggle').attr("data-sidepanel-target")).addClass("sidepanel-short scrollspy");
        var navOffset = 180; //used if there is fixed navbar
        $('body').scrollspy({
            target: '.scrollspy',
            offset: navOffset + 10
        });
        //    $('body').scrollspy({ target: '.sidepanel', offset: navOffset+10 });
        $('.sidepanel-short.scrollspy li a').click(function() {
            var scrollPos = $('body').find($(this).attr('href')).offset().top - navOffset;

            $('body,html').animate({
                scrollTop: scrollPos
            }, 500, function() {});
            return false;
        });
        sidepanelshort = true;
    }
    $('.sidepanel-short-toggle').click(function() {
        if ($($(this).attr("data-sidepanel-target")).hasClass("active")) {
            $(".sidepanel").removeClass("active");
            $(".sidepanel-overlay").fadeOut();
        } else {
            $(".sidepanel").removeClass("active");

            $($(this).attr("data-sidepanel-target")).addClass("active");
            $(".sidepanel-overlay").fadeIn();

        }
        return false;
    });

    $('.sidepanel-close').click(function() {
        $(".sidepanel").removeClass("active");
        $(".sidepanel-overlay").fadeOut();

        return false;
    });
    $('.sidepanel-overlay').click(function() {
        $(".sidepanel").removeClass("active");
        $(this).fadeOut();

        return false;
    });




    var media_xs = window.matchMedia("(max-width: 767px)");
    $vac = $(".vertical-align-center");
    $vac_n_xs = $(".vertical-align-center-not-xs");

    $(".vertical-align-center").each(function(index) {
        var outerheight = $(this).parent().height();
        var itemheight = $(this).height();
        $that = $(this);
        var margintop = ((outerheight - itemheight) > 0) ? ((outerheight - itemheight) / 2) : "auto";
        $(this).css({
            "margin-top": margintop
        });
    });


    $(".vertical-align-center-not-xs").each(function(index) {
        var outerheight = $(this).parent().height();
        var itemheight = $(this).height();
        $that = $(this);
        var margintop = ((outerheight - itemheight) > 0) ? ((outerheight - itemheight) / 2) : "auto";
        if (!media_xs.matches) {
            $(this).css({
                "margin-top": margintop
            });
        }
    });

    var dataWidthSet = false;
    function companyNavOverflow(){
        if(!dataWidthSet){
            $companyNav = $("#company-nav").clone();
            $companyNavList = $("#company-nav > ul").clone();

            $("li",$("#company-nav")).each(function(index) {
                $(this).attr("data-width",$(this).width());
            });
            $companyNavList0 = $("#company-nav > ul").clone();
            dataWidthSet = true;
        }
        var companyNavLength = 0;
        var windowLength = $(window).width();
        var caretWidth = 80;
        var $caretDropdown = $('<li class="caretdropdown pull-right">\
                                <a class=" dropdown-toggle" id="dropdownMenunav" data-toggle="dropdown" href="#" aria-expanded="true"><span class="glyphicon glyphicon-option-vertical"></span></a>\
                                <ul class="dropdown-menu pull-right" role="menu" aria-labelledby="dropdownMenunav"  style="    background-color: #5DAB34;  margin-top: 12px;">\
                                </ul>\
                            </li>');

        $companyNavList.html("");

        $("li",$("#company-nav")).each(function(index) {
            //check if caret dropdown li , then continue
            if($(this).hasClass("caretdropdown"))return;
            companyNavLength = companyNavLength + parseInt($(this).attr("data-width"));

            if(windowLength < (companyNavLength+caretWidth)){
                //apend to caret dropdown
                $caretDropdown.find(".dropdown-menu").append($(this));

            }
            else{
                //append to normal list
                $companyNavList.append($(this));
            }
        });
        if(windowLength < (companyNavLength+caretWidth)){
            //append normal list li 's
            //append carret dropdown li
            $("#company-nav").html($companyNavList[0].outerHTML);
            $("#company-nav > ul").append($caretDropdown[0].outerHTML);
        }
        else{
              $("#company-nav").html($companyNavList0[0].outerHTML);
        }

    }
    if (!media_xs.matches && $('#company-nav').length != 0){
        companyNavOverflow();
        $("#sidepanel-left > ul > li > img").hide();
    }

    $(window).resize(function() {
        if (!media_xs.matches && $('#company-nav').length != 0){
            companyNavOverflow();
            $("#sidepanel-left > ul > li > img").hide();
        }else{

        }
        $(".vertical-align-center").each(function(index) {
            var outerheight = $(this).parent().height();
            var itemheight = $(this).height();
            $that = $(this);
            var margintop = ((outerheight - itemheight) > 0) ? ((outerheight - itemheight) / 2) : "auto";
            $(this).css({
                "margin-top": margintop
            });
        });

        $(".vertical-align-center-not-xs").each(function(index) {
            var outerheight = $(this).parent().height();
            var itemheight = $(this).height();
            $that = $(this);
            var margintop = ((outerheight - itemheight) > 0) ? ((outerheight - itemheight) / 2) : "auto";
            if (!media_xs.matches) {
                $(this).css({
                    "margin-top": margintop
                });
            }
        });
    });
    $(window).scroll(function() {
        $(".vertical-align-center").each(function(index) {
            var outerheight = $(this).parent().height();
            var itemheight = $(this).height();
            $that = $(this);
            var margintop = ((outerheight - itemheight) > 0) ? ((outerheight - itemheight) / 2) : "auto";
            $(this).css({
                "margin-top": margintop
            });
        });


        $(".vertical-align-center-not-xs").each(function(index) {
            var outerheight = $(this).parent().height();
            var itemheight = $(this).height();
            $that = $(this);
            var margintop = ((outerheight - itemheight) > 0) ? ((outerheight - itemheight) / 2) : "auto";
            if (!media_xs.matches) {
                $(this).css({
                    "margin-top": margintop
                });
            }
        });

    });


});





