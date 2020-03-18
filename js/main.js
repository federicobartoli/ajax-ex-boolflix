$(document).ready(function () {



     var apiBaseUrl = 'https://api.themoviedb.org/3'  ;
     var source = $('#template-film-id').html();
     var templateFilm = Handlebars.compile(source);

     $('.vai-al-film').click(function () {
          $('.mc-films-cont').empty();
          var ricercaDelFilm = $('.cerca-un-film').val();
          console.log(ricercaDelFilm);
          $.ajax({
               url: apiBaseUrl + '/search/movie',
               data: {
                    api_key: '73ae8877a28c5944fa34ff1c5a2be181',
                    query: ricercaDelFilm,
                    language: 'it-IT'
               },
               method: 'GET',
               success: function (data) {
                    console.log(data);

                    var films = data.results;
                    for (var i = 0; i < films.length; i++) {
                         var film = films[i]
                         console.log(film.title);
                         console.log(film.overview);
                         var informazioni = {
                              titolo: film.title,
                              titoloOriginale: film.original_title,
                              lingua :film.original_language,
                              voto: film.vote_average
                         };
                         var html = templateFilm(informazioni);

                         $('.mc-films-cont').append(html);


                    }

               },
               error: function (err) {
                    alert('grande giove!');
               }
          })
     });





});
