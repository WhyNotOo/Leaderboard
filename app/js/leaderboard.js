/**
 * @fileoverview Application logic for the Leaderboard template.
 *
 */

(function ($) {

var app = {
  options     : Joshfire.factory.config.template.options || {},
  scores      : Joshfire.factory.getDataSource("scores"),
  users       : [],
  table       : $('#views .table'),

  getScores: function() {
    // If only one datasource
    if(app.scores.children.length == 1) {
      app.scores.find({}, function (err, data) {
        if(err) {
          console.log('erreur : '+err);
          alert('Une erreur est survenue pendant le chargement de l\'application. Merci de recharger la page.');
        } else {
          $.map(data.entries, function (entry, idx) {
            var user = entry.entries;

            $('header h1').html(app.scores.children[0].name);

            var userTable = app.table.clone();
            $('#content .content').prepend(userTable);

            if(app.options.entriesrange && app.options.entriesrange < user.length) {
              for(var i=0, len = app.options.entriesrange; i<len; i++) {
                var date = app.getScoreDate(user.dateCreated);
                $('#content .content .table').append('<tr><td>'+(i+1)+'</td><td>'+user[i].familyName+'</td><td>'+user[i].givenName+'</td><td>'+user[i].nationality.name+'</td><td>'+date+'</td><td class="score">'+user[i]['quiz:score']+'</td></tr>');
              }
            } else {
              for(var i=0, len = user.length; i<len; i++) {
                var date = app.getScoreDate(user[i].dateCreated);
                $('#content .content .table').append('<tr><td>'+(i+1)+'</td><td>'+user[i].familyName+'</td><td>'+user[i].givenName+'</td><td>'+user[i].nationality.name+'</td><td>'+date+'</td><td class="score">'+user[i]['quiz:score']+'</td></tr>');
              }
            }
          });
        }
      });
    } else {
      $('title, header h1').html(app.options.boardtitle);
      $('.nav').removeClass('hidden');

      for(var i = 0, len = app.scores.children.length; i < len; i++) {
        var datasource = app.scores.children[i];
        var name = datasource.name.replace(' ', '');

        if(i == 0) {
          $('.nav').find('.active a').attr('href', '#'+name).html(datasource.name);
          $('#content .content').append('<section id="'+name+'"></section>');
        } else {
          $('.nav').append('<li><a href=""></a></li>').children('li:last-child').children('a').attr('href', '#'+name).html(datasource.name);
          $('#content .content').append('<section id="'+name+'" class="hidden"></section>');
        }

        app.getUserDatasource(datasource);
      }
    }
  },

  getUserDatasource: function(datasource) {
    datasource.find({}, function(err, data) {
      if(err) {
        console.log('erreur : '+err);
        alert('Une erreur est survenue pendant le chargement de l\'application. Merci de recharger la page.');
      } else {
        var user = data.entries, name = data.name.replace(' ', ''), userTable = app.table.clone();

        $('#'+name).html(userTable);

        if(user.length == 0) {
          $('#'+name).html('<h2 class="empty">No user has already registered its score for this quiz.</h2>');
        } else {
          if(app.options.entriesrange && app.options.entriesrange < user.length) {
            for(var i=0, len = app.options.entriesrange; i<len; i++) {
              var date = app.getScoreDate(user[i].dateCreated);
              $('#'+name+' .table').append('<tr><td>'+(i+1)+'</td><td>'+user[i].familyName+'</td><td>'+user[i].givenName+'</td><td>'+user[i].nationality.name+'</td><td>'+date+'</td><td class="score">'+user[i]['quiz:score']+'</td></tr>');
            }
          } else {
            for(var i=0, len = user.length; i<len; i++) {
              var date = app.getScoreDate(user[i].dateCreated);
              $('#'+name+' .table').append('<tr><td>'+(i+1)+'</td><td>'+user[i].familyName+'</td><td>'+user[i].givenName+'</td><td>'+user[i].nationality.name+'</td><td>'+date+'</td><td class="score">'+user[i]['quiz:score']+'</td></tr>');
            }
          }
        }
      }
    });
  },

  getScoreDate: function(date) {
    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        dateCreated = new Date(date),
        dateD = dateCreated.getDate(),
        dateM = dateCreated.getMonth(),
        dateY = dateCreated.getFullYear(),
        month = monthNames[dateM];
    return month+' '+dateD+' '+dateY;
  },

  addCustomConfig: function() {
    if(Joshfire.factory.config.app.icon) {
      $('footer .container-fluid').append('<img src="'+Joshfire.factory.config.app.icon.contentURL+'" title="Emirates" class="emirates" />');
    }
    if(Joshfire.factory.config.app.logo) {
      $('#container').css({
        'background'              : 'url('+Joshfire.factory.config.app.logo.contentURL+') no-repeat center center fixed #5c4d47',
        '-o-background-size'      : 'cover',
        '-moz-background-size'    : 'cover',
        '-webkit-background-size' : 'cover',
        'background-size'         : 'cover'
      });
    }
    if(app.options.colornavbartop && app.options.colornavbarbottom) {
      var top = '#'+app.options.colornavbartop,
          bot = '#'+app.options.colornavbarbottom,
          navbar = document.getElementsByClassName('heading');

      navbar[0].style.background = '-webkit-linear-gradient(top,'+top+','+bot+')';
      navbar[0].style.background = '-moz-linear-gradient(top,'+top+','+bot+')';
      navbar[0].style.background = '-ms-linear-gradient(top,'+top+','+bot+')';
      navbar[0].style.background = '-o-linear-gradient(top,'+top+','+bot+')';
      navbar[0].style.background = 'linear-gradient(top,'+top+','+bot+')';
    }
    if(app.options.colortext) {
      $('header h1').css('color', '#'+app.options.colortext);
    }
  },

  showContent: function(link) {
    var target = link.attr('href');
    $('.nav').children().removeClass('active');
    link.parent().addClass('active');
    $('#content .content').children().addClass('hidden');
    $(target).removeClass('hidden');
  },

  resizeContent: function() {
    var windowH = parseInt($(window).height(), 10);
    var headerH = parseInt($('header').height(), 10);
    var footerH = parseInt($('footer').height(), 10);
    $('#content').height(windowH - headerH - footerH - 10);
  }

}; /** END APP **/

$('.nav a').live('click', function() {
  var link = $(this);
  app.showContent(link);
});

$(window).resize(function() {
  app.resizeContent();
});

// Launch APP
$(document).ready(function() {
  app.resizeContent();
  app.addCustomConfig();
  app.getScores();
});

})(jQuery);