$(document).ready(function () {



     var apiBaseUrl = 'https://api.themoviedb.org/3'; //URL per api
     var source = $('#template-film-id').html();
     var templateFilm = Handlebars.compile(source);

     $('.vai-al-film').click(function () { //con un click nel bottone accanto alla barra di ricerca...
          $('.mc-films-cont').empty(); // vado a svuotare il div in caso ci fossero dei risultati di ricerca vecchi
          var ricercaDelFilm = $('.cerca-un-film').val(); // mi creo una variabile dove acquisisco i dati inseriti dall'utente tramite l'input
          console.log(ricercaDelFilm); // debug
          $.ajax({ // faccio una chiamata ajax
               url: apiBaseUrl + '/search/movie',
               data: {
                    api_key: '73ae8877a28c5944fa34ff1c5a2be181',
                    query: ricercaDelFilm, //qui vado ad inserire il dato inserito dall'utente
                    language: 'it-IT'
               },
               method: 'GET',
               success: function (data) { // se la chiamata ajax va a buon fine...
                    console.log(data);

                    var films = data.results; // una variabile con un array che contiene tutti i film trovati..
                    for (var i = 0; i < films.length; i++) { // con il ciclo for entro nell'array contenente tutti i film ...
                         var film = films[i] // mi creo ad ogni giro del ciclo una variabile con un film corrispondente alla ricerca
                         console.log(film.title); // debug
                         console.log(film.overview); // debug
                         var informazioni = { // creo un oggetto contenente i parametri che andrò a cambiare con handlebars..
                              titolo: film.title,
                              titoloOriginale: film.original_title,
                              lingua :film.original_language,
                              voto: trasformo(film.vote_average) //trasformo il voto da 1 a 5 anzichè da 1 a 10 grazie alla mia funzione trasformo
                         };
                         var html = templateFilm(informazioni);

                         $('.mc-films-cont').append(html); //scrivo


                    }

               },
               error: function (err) {
                    alert('grande giove!');
               }
          })
     });



     function trasformo(numero) { // con questa funzione ritorno un numero diviso per 2 e arrotondato per eccesso.
     numero = numero/2;
     return  Math.round(numero);
}



});
