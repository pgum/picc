var defaultBG= 'eevee.png';

function moj_test(){console.log("moj test!");}
function bg_picker_open(){
  $('#bg-picker').find('.bg-pick').removeClass('selected');
  $('#bg-picker').find('.bg-pick').find('img[src="img/tiles/'+Metro.session.getItem('bg', defaultBG)+'"]').parent().addClass('selected');
}

function render_row(row){
  var r=$('<div class="row"></div>');
  for(i in row){
    r=r.append(render_cell(row[i]));
  }
  return r;
}

function showAmiibo_img(id){
  $('.amiibo').hide();
  $('[amiibo-id='+id+']').show();
  }

function showAmiibo(id, timeout=2300){
  el = $('#amiibo-gallery').data('dropdown');
  showAmiibo_img(id);
  el.open();
  setTimeout(function(){
        el.close();
  }, timeout);
  }
function render_cell(d){
  var r=$('<div class="cell"></div>');
  if(d.type=="bg-pick"){
    var t = $('<div class="img-container"></div>').addClass('bg-pick');
    var timg = $('<img>').attr('src',d.img);
    var tovr = $('<div class="image-overlay"><h5 class="text-light"></h5><p></p></div>');
    $(tovr).find('h5').text(d.text);
    $(tovr).find('p').text(d.p);
    return r.append(t.append(timg, tovr));
    }
  if(d.type=="description"){
    return r.append($('<p></p>').text(d.p));
    }
  }

$(document).ready(function() {
  $('#clock').FlipClock({ clockFace: 'TwentyFourHourClock', showSeconds: false });

  $.get("js/bg_picker.json",function(data){
    console.log(data);
    var v= $('<div class="grid"></div>');
    for(r=0; r< data.rows.length; r++){
      v = v.append(render_row(data.rows[r]));
    }
    $('#bg-picker').append(v);
  });
  Metro.session.setKey('picc');
  if(Metro.session.getItem('bg') == null){
    console.log('kurwa');
    Metro.session.setItem('bg', defaultBG);
  }
  var bg= Metro.session.getItem('bg');
  $('#background').attr('src', 'img/bg/'+bg);
  
  $.get("js/amiibo.json",function(data){
    console.log(data);
    for(a=0; a< data.amiibo.length; a++){
      var d= data.amiibo[a];
      var t = $('<div class="img-container amiibo"></div>').append($('<img class="">').attr('src','/img/amiibo/'+d.img));
      t.attr('amiibo-name',d.name);
      t.attr('amiibo-id',d.img.split('.')[0]).hide();
      $('#amiibo-gallery').append(t);
      }
  });

  $('[data-role="tile"]').click(function(){
    console.log($(this).attr('data-action'));
    var a= $(this).attr('data-action');
    if(a == "refresh"){
      location.reload();
    }
  });

    $('#bg-picker').on('click', '.bg-pick', function(){
      var tilePathname= $(this).find('img').attr('src');
      bg= tilePathname.substring(tilePathname.lastIndexOf('/')+1);
      console.log('picked: '+bg);
      $('.bg-pick').removeClass('selected');
      $(this).addClass('selected');
      $('#background').attr('src','img/bg/'+bg);
      Metro.session.setItem('bg', bg);
      });
});
