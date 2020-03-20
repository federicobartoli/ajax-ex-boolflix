$(document).ready(function () {


     var oggettoVoto = [];
     var apiBaseUrl = 'https://api.themoviedb.org/3'; //URL per api
     var source = $('#template-film-id').html();
     var templateFilm = Handlebars.compile(source);

     $('.vai-al-film').click(cerca); //con un click nel bottone accanto alla barra di ricerca faccio partire la funzione cerca
     $('.cerca-un-film').keypress(function (event) { //avvio con il pulsante enter la funzione cerca.
          if(event.keyCode == 13) {
               cerca();
          }
     })




     function approssimo(numero) { // con questa funzione ritorno un numero diviso per 2 e arrotondato per eccesso.
     numero = numero/2;
     return  Math.ceil(numero);
     };

     function cerca() {
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
                    var films = data.results; // creo una variabile con un array che contiene tutti i film trovati..
                    if(data.total_results < 1 ){
                    $('.mc-films-cont').text('Non ho trovato nessun film,spiacente.');
                    console.log('non ho trovato niente');
                    }else{
                         ricerca(films);
                    }

               },
               error: function (err) {
                    alert('grande giove!');
               }
          })
          console.log(ricercaDelFilm); // debug
          $.ajax({ // faccio una chiamata ajax
               url: apiBaseUrl + '/search/tv',
               data: {
                    api_key: '73ae8877a28c5944fa34ff1c5a2be181',
                    query: ricercaDelFilm, //qui vado ad inserire il dato inserito dall'utente
                    language: 'it-IT'
               },
               method: 'GET',
               success: function (data) { // se la chiamata ajax va a buon fine...
                    var series = data.results; // creo una variabile con un array che contiene tutti i film trovati..
                    if(data.total_results < 1 ){
                    $('.mc-films-cont').text('Non ho trovato nessun film,spiacente.');

                    }else{
                         ricerca2(series);
                    }

               },
               error: function (err) {
                    alert('grande giove!');
               }
          })
     };


     function stars(voto) { //Funzione per la votazione a stelle
          voto = Math.ceil(voto/2); // approssimo il mio voto da 1 a 10 a 1 a 5
          var stella = '<i class="fas fa-star"></i>' // questa è una stella piena
          var stellaVuota = '<i class="far fa-star"></i>' // questa è una stella vuota
          var votoStelle = []; // questo è il mio array che andrò a popolare
          for (var i = 0; i < voto; i++) { // faccio un ciclo che cicla per il numero della votazione poi..
               votoStelle.push(stella);
          }
          if(votoStelle.length < 5 ){ //se la votazione è minore di 5 entra in questo if
               votoStelleRimanenti = 5 - votoStelle.length; // e mi vado a prendere le stelle rimanenti che devo assegnare, visto che il range di votazione è 5, devo far apparire le stelle vuote in caso il voto sia minore di 5
               for (var i = 0; i < votoStelleRimanenti; i++) { // faccio un ciclo for per quante stelle rimanenti
                    votoStelle.push(stellaVuota); // e vado a fare il push nell'array un n di volte quanto le stelle rimanenti.
               }

          }
          return votoStelle.join(''); // mi returno l'array più ho aggiunto il join per togliere le virgole che separavano gli array(in questo caso le stelline)
     };

     function flag(linguaOriginale) {
          var bandiera = linguaOriginale;
          if(bandiera == 'en') {
               bandiera = 'us';
          }
          if(bandiera == 'ja') {
               bandiera = 'jp';
          }
          return bandiera;

     };


     function ricerca(films) {
          for (var i = 0; i < films.length; i++) { // con il ciclo for entro nell'array contenente tutti i film ...
               var film = films[i] // mi creo ad ogni giro del ciclo una variabile con un film corrispondente alla ricerca
               console.log(film.title); // debug
               console.log(film.overview); // debug
               var informazioni = { // creo un oggetto contenente i parametri che andrò a cambiare con handlebars..
                    titolo: film.title,
                    titoloOriginale: film.original_title,
                    lingua :flag(film.original_language),
                    voto: stars(film.vote_average)  //per la votazione uso la funzione stars .
               };

               var html = templateFilm(informazioni);
               $('.mc-films-cont').append(html); //scrivo
          };
     }

     function ricerca2(series) {
          for (var i = 0; i < series.length; i++) { // con il ciclo for entro nell'array contenente tutti i film ...
               var serie = series[i] // mi creo ad ogni giro del ciclo una variabile con un film corrispondente alla ricerca

               var informazioniSeries = { // creo un oggetto contenente i parametri che andrò a cambiare con handlebars..
                    titolo: serie.name,
                    titoloOriginale: serie.original_name,
                    lingua :flag(serie.original_language),
                    voto: stars(serie.vote_average)  //per la votazione uso la funzione stars .
               };

               var html = templateFilm(informazioniSeries);
               $('.mc-films-cont').append(html); //scrivo
          };
     }
});
