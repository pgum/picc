$.StartScreen = function(){
    var plugin = this;
    var width = (window.innerWidth > 0) ? window.innerWidth : screen.width;

    plugin.init = function(){
        setTilesAreaSize();
        if (width >= 768) addMouseWheel();
    };

    var setTilesAreaSize = function(){
        var groups = $(".tiles-group");
        var tileAreaWidth = 80;
        $.each(groups, function(i, t){
            if (width <= 768) {
                tileAreaWidth = width;
            } else {
                tileAreaWidth += $(t).outerWidth() + 80;
            }
        });
        $(".tiles-area").css({
            width: tileAreaWidth
        });
    };

    var addMouseWheel = function (){
        $("body").mousewheel(function(event, delta, deltaX, deltaY){
            var page = $(".start-screen");
            var scroll_value = delta * 50;
            page.scrollLeft(page.scrollLeft() - scroll_value);
            return false;
        });
    };

    plugin.init();
};

$.StartScreen();

$.each($('[class*=tile-]'), function(){
    var tile = $(this);
    setTimeout(function(){
        tile.css({
            opacity: 1,
            "transform": "scale(1)",
            "transition": ".3s"
        }).css("transform", false);

    }, Math.floor(Math.random()*500));
});

$(".tiles-group").animate({
    left: 0
});

$(window).on(Metro.events.resize + "-start-screen-resize", function(){
    $.StartScreen();
});

$(document).ready(function() {
      $.get("js/bg_picker.json",function(data){console.log(data);});
      
      $('#clock').FlipClock({ clockFace: 'TwentyFourHourClock', showSeconds: false });
    
      $('[data-role="tile"]').click(function(){
        console.log($(this).attr('data-action'));
        var a= $(this).attr('data-action');
        if(a == "refresh"){
          location.reload();
        }
      });
      
      $('#background').attr('src', 'img/bg/'+Metro.session.getItem('bg', defaultBG));

      
      $('#bg-picker').on('click', '.bg-pick', function(){
        var tilePathname= $(this).find('img').attr('src');
        var bgFilename= tilePathname.substring(tilePathname.lastIndexOf('/')+1);
        console.log('picked: '+bgFilename);
        $('.bg-pick').removeClass('selected');
        $(this).addClass('selected');
        $('#background').attr('src','img/bg/'+bgFilename);
        Metro.session.setItem('bg', bgFilename);
        });
      
    });