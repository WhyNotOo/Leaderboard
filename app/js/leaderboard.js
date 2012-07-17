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
            var user = entry.entries,
                userTable = app.table.clone();

            if(app.options.boardtitle)
              $('title, header h1').html(app.options.boardtitle);
            else
              $('title, header h1').html(Joshfire.factory.config.app.name);

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
      if(app.options.boardtitle)
        $('title, header h1').html(app.options.boardtitle);
      else
        $('title, header h1').html(Joshfire.factory.config.app.name);

      $('.nav').removeClass('hidden');

      for(var i = 0, len = app.scores.children.length; i < len; i++) {
        var datasource = app.scores.children[i],
            name = datasource.name.replace(/ /g, '');

        if(i == 0) {
          $('.nav').find('.active a').attr('href', name).html(datasource.name);
          $('#content .content').append('<section id="'+name+'"></section>');
        } else {
          $('.nav').append('<li><a href=""></a></li>').children('li:last-child').children('a').attr('href', name).html(datasource.name);
          $('#content .content').append('<section id="'+name+'" class="hidden"></section>');
        }

        app.getUserDatasource(datasource);
      }
    }

    if(app.options.refresh)
      app.refreshContent(app.options.refresh);
  },

  getUserDatasource: function(datasource) {
    datasource.find({}, function(err, data) {
      if(err) {
        console.log('erreur : '+err);
        alert('Une erreur est survenue pendant le chargement de l\'application. Merci de recharger la page.');
      } else {
        var user = data.entries,
            name = data.name.replace(/ /g, ''),
            userTable = app.table.clone();

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
    Date.prototype.setISO8601 = function (string) {
        var regexp = "([0-9]{4})(-([0-9]{2})(-([0-9]{2})" +
            "(T([0-9]{2}):([0-9]{2})(:([0-9]{2})(\.([0-9]+))?)?" +
            "(Z|(([-+])([0-9]{2}):([0-9]{2})))?)?)?)?";
        var d = string.match(new RegExp(regexp)),
            offset = 0,
            date = new Date(d[1], 0, 1);

        if (d[3]) { date.setMonth(d[3] - 1); }
        if (d[5]) { date.setDate(d[5]); }
        if (d[7]) { date.setHours(d[7]); }
        if (d[8]) { date.setMinutes(d[8]); }
        if (d[10]) { date.setSeconds(d[10]); }
        if (d[12]) { date.setMilliseconds(Number("0." + d[12]) * 1000); }
        if (d[14]) {
            offset = (Number(d[16]) * 60) + Number(d[17]);
            offset *= ((d[15] == '-') ? 1 : -1);
        }
        offset -= date.getTimezoneOffset();
        time = (Number(date) + (offset * 60 * 1000));
        this.setTime(Number(time));
    }

    var dateCreated = new Date();
    dateCreated.setISO8601(date);

    var monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"],
        dateD = dateCreated.getDate(),
        dateM = dateCreated.getMonth(),
        dateY = dateCreated.getFullYear(),
        month = monthNames[dateM];

    return month+' '+dateD+' '+dateY;
  },

  addCustomConfig: function() {
    if(Joshfire.factory.config.app.icon) {
      $('footer .container-fluid').append('<img src="'+Joshfire.factory.config.app.icon.contentURL+'" alt="Custom Logo" class="logo" />');
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

    if(app.options.linkheroku) {
      $('header .container-fluid').append('<a href="'+app.options.linkheroku+'leaderboard.csv" class="export btn btn-info">Export CSV</a>');
    }

    if(app.options.colornavbartop) {
      var top = '#'+app.options.colornavbartop,
          bot = app.colorLuminance(top, 0.3),
          navbar = document.getElementsByClassName('heading');

      navbar[0].style.background = top;
      navbar[0].style.background = '-webkit-gradient(linear, left top, left bottom, from('+top+'), to('+bot+'))';
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

  colorLuminance: function(hex, lum) {
    // validate hex string
    hex = String(hex).replace(/[^0-9a-f]/gi, '');
    if (hex.length < 6) {
      hex = hex[0]+hex[0]+hex[1]+hex[1]+hex[2]+hex[2];
    }
    lum = lum || 0;
    // convert to decimal and change luminosity
    var rgb = "#", c, i;
    for (i = 0; i < 3; i++) {
      c = parseInt(hex.substr(i*2,2), 16);
      c = Math.round(Math.min(Math.max(0, c + (c * lum)), 255)).toString(16);
      rgb += ("00"+c).substr(c.length);
    }
    return rgb;
  },

  showContent: function(link) {
    var target = link.attr('href');
    $('.nav').children().removeClass('active');
    link.parent().addClass('active');
    $('#content .content').children().addClass('hidden');
    $('#'+target).removeClass('hidden');
  },

  refreshContent: function(timeout) {
    setTimeout("location.reload(true);", timeout);
  },

}; /** END APP **/

$('.nav a').live('click', function(e) {
  e.preventDefault();
  var link = $(this);
  app.showContent(link);
});

// Launch APP
$(document).ready(function() {
  app.addCustomConfig();
  app.getScores();
});

})(jQuery);