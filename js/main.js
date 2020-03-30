$(document).ready(function () {



     var imgBaseurl = 'https://image.tmdb.org/t/p/';
     var imgSize = 'w500/';
     var oggettoVoto = [];
     var apiBaseUrl = 'https://api.themoviedb.org/3'; //URL per api
     var source = $('#template-film-id').html();
     var templateFilm = Handlebars.compile(source);
     var source2 = $('#template-film-id-2').html();
     var templateFilm2 = Handlebars.compile(source2);
     $('.fa-search').click(function () {
          if($(this).hasClass('mc-absolute')){
               $(this).removeClass('mc-absolute');
               $('.cerca-un-film').hide();
               $('.mc-barra-di-ricerca').removeClass('width-50');
               $('.mc-logodiv').removeClass('width-50');
          }else {
               $(this).addClass('mc-absolute');
               $('.cerca-un-film').show();
               $('.mc-barra-di-ricerca').addClass('width-30');
               $('.mc-logodiv').addClass('width-70');

          }


     })





     // $('.cerca-un-film').keyup(function () { //funzione KEYUP in prova
     //      cerca('movie');
     //      cerca('tv');
     // });

     // $('.vai-al-film').click(cerca); //con un click nel bottone accanto alla barra di ricerca faccio partire la funzione cerca
     $('.cerca-un-film').keypress(function (event) { //avvio con il pulsante enter la funzione cerca.
          if(event.keyCode == 13) {
               cerca('movie');
               cerca('tv');
          }


     });




     function approssimo(numero) { // con questa funzione ritorno un numero diviso per 2 e arrotondato per eccesso.
     numero = numero/2;
     return  Math.ceil(numero);
     };

     function cerca(variabile) {
          $('.img-wallpaper').hide();

          $('.mc-films-cont').empty(); // vado a svuotare il div in caso ci fossero dei risultati di ricerca vecchi
          var ricercaDelFilm = $('.cerca-un-film').val(); // mi creo una variabile dove acquisisco i dati inseriti dall'utente tramite l'input
          if(ricercaDelFilm == '' ){
               $('.img-wallpaper').show();
          }
          console.log(ricercaDelFilm); // debug
          $.ajax({ // faccio una chiamata ajax
               url: apiBaseUrl + '/search/' + variabile,
               data: {
                    api_key: '73ae8877a28c5944fa34ff1c5a2be181',
                    query: ricercaDelFilm, //qui vado ad inserire il dato inserito dall'utente
                    language: 'it-IT'
               },
               method: 'GET',
               success: function (data) { // se la chiamata ajax va a buon fine...
                    console.log(data);
                    var films = data.results; // creo una variabile con un array che contiene tutti i film trovati..
                    console.log(films);
                         if(variabile == 'movie'){
                              ricerca(films);

                         }
                         if (variabile == 'tv'){
                              ricerca2(films);
                         }
               }

          })
          console.log(ricercaDelFilm); // debug


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

     function flag(linguaOriginale) { //funzione per le bandiere
          var bandiera = linguaOriginale;
          if(bandiera == 'en') {
               bandiera = 'us';
          }
          if(bandiera == 'ja') {
               bandiera = 'jp';
          }
          if(bandiera == 'zh') {
               bandiera = 'cn';
          }
          if(bandiera == 'ko') {
               bandiera = 'kp';
          }
          if(bandiera == 'ur') {
               bandiera = 'tr';
          }
          if(bandiera == 'he') {
               bandiera = 'il';
          }
          if(bandiera == 'da') {
               bandiera = 'dk';
          }
          if(bandiera == 'hi') {
               bandiera = 'in';
          }
          if(bandiera == 'xx') {
               bandiera = 'us';
          }
          return bandiera;

     };


     function ricerca(films) {
          for (var i = 0; i < films.length; i++) { // con il ciclo for entro nell'array contenente tutti i film ...
               var film = films[i] // mi creo ad ogni giro del ciclo una variabile con un film corrispondente alla ricerca
               console.log(film.title); // debug
               console.log(film.overview); // debug
               console.log(film.id);
               var informazioni = { // creo un oggetto contenente i parametri che andrò a cambiare con handlebars..
                    titolo: film.title,
                    titoloOriginale: film.original_title,
                    lingua :flag(film.original_language),
                    copertina: poster(film.poster_path),
                    overview: film.overview.substring(0,200) + '...',  //Stringa max 200 caratteri
                    subOverview: film.overview,//Stringa piena
                    voto: stars(film.vote_average),  //per la votazione uso la funzione stars .
                    dataId: film.id
               };

               var html = templateFilm(informazioni);
               $('.mc-films-cont').append(html); //scrivo




               $('.trama').click(function () { // funzione per vedere la trama intera
                    $(this).hide();
                    $(this).siblings('.informazioni-mc-info').hide();
                    $(this).siblings('.trama-intera').show();
               })
               $('.trama-intera').click(function () {
               $(this).hide();
               $(this).siblings('.informazioni-mc-info').show();

               })


          };
          $('.aggiungi-info').click(function () {
               var informazioniPersonaggieAttori = '';
               var these = $(this)
               var theseData = $(this).parentsUntil('.mc-films-item').data('identificativo');
               console.log(these);
               $.ajax({ // faccio una chiamata ajax
                    url: apiBaseUrl + '/movie/' + theseData + '/credits',
                    data: {
                         api_key: '73ae8877a28c5944fa34ff1c5a2be181',
                    },
                    method: 'GET',
                    success: function (credits) { // se la chiamata ajax va a buon fine...
                         console.log(credits);
                         var creditCast = credits.cast;
                         var nomiAttori = [];
                         for (var i = 0; i < 5; i++) {
                              nomiAttori.push(creditCast[i].name);
                         }
                         console.log(nomiAttori);

                         var nomiCharacter = [];
                         for (var i = 0; i < 5; i++) {
                              nomiCharacter.push(creditCast[i].character);
                         }
                         console.log(nomiCharacter);
                         var informazioniPersonaggieAttori = { // creo un oggetto contenente i parametri che andrò a cambiare con handlebars..
                              attori: nomiAttori.toString(),
                         };
                         console.log(informazioniPersonaggieAttori);
                         var html2 = templateFilm2(informazioniPersonaggieAttori);
                         $(these).parent('.mc-info').append(html2); //scrivo





                         // var creditNameCast = creditCast[0].name
                         // var creditNameCharCast = creditCast.character
                         // console.log(creditNameCast);
                         // console.log(creditNameCharCast);
                         // console.log(creditCast);

                    }
               })
          })
     }

     function poster(path) { //costruzione del poster
          if(path != null) {
               return imgBaseurl + imgSize + path;
          } else {
               return 'https://upload.wikimedia.org/wikipedia/commons/6/64/Poster_not_available.jpg';
          }
     }

     function ellipsLines() {
          $('.two-lines').ellipsis({
          lines: 3,             // force ellipsis after a certain number of lines. Default is 'auto'
          ellipClass: 'ellip',  // class used for ellipsis wrapper and to namespace ellip line
          responsive: true      // set to true if you want ellipsis to update on window resize. Default is false
        });
     }

     function ricerca2(series) {
          for (var i = 0; i < series.length; i++) { // con il ciclo for entro nell'array contenente tutti le serie ...
               var serie = series[i] // mi creo ad ogni giro del ciclo una variabile con una serie corrispondente alla ricerca

               var informazioniSeries = { // creo un oggetto contenente i parametri che andrò a cambiare con handlebars..
                    titolo: serie.name,
                    titoloOriginale: serie.original_name,
                    lingua : flag(serie.original_language),
                    copertina: poster(serie.poster_path),
                    overview: serie.overview.substring(0,200) + '...',  //Stringa max 200 caratteri
                    subOverview: serie.overview,//Stringa piena
                    voto: stars(serie.vote_average)  //per la votazione uso la funzione stars .
               };

               var html = templateFilm(informazioniSeries);
               $('.mc-films-cont').append(html); //scrivo
               $('.trama').click(function () { // funzione per vedere la trama intera
                    $(this).hide();
                    $(this).siblings('.informazioni-mc-info').hide();
                    $(this).siblings('.trama-intera').show();

               })
               $('.trama-intera').click(function () {
               $(this).hide();
               $(this).siblings('.informazioni-mc-info').show();

               })

          };
     }
});
