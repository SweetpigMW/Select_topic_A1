var fs = require('fs');
var http = require('http');
var soap = require('soap');
var xpath = require('xpath');
var XMLWriter = require('xml-writer');
var dom = require('xmldom').DOMParser;

var movieService = {
    Movie_Service: {
        Movie_Port: {
//====================== Update Movie =========================================================
            updateMovie: function (args) {  //change
                  var xml = require('fs').readFileSync('movieG5.xml', 'utf8')
                  xml = xml.replace(/(\r\n|\n|\r|\t)/gm, "");
                  var doc = new dom().parseFromString(xml)
                  var nodes = xpath.select("/movielist", doc);
                  var i = 0;
                  while (i < nodes[0].getElementsByTagName("movie").length) {
                      if (nodes[0].getElementsByTagName("movie")[i].getElementsByTagName("name")[0].childNodes[0].nodeValue == args.Dname) {
                          nodes[0].removeChild(nodes[0].getElementsByTagName("movie")[i]);
                      } else {
                          i++;
                      }
                  }
                  var newMovie = doc.createElement("movie")
                  name = doc.createElement("name");
                  txtName = doc.createTextNode(args.movie_name)
                  name.appendChild(txtName);

                  director = doc.createElement("director");
                  txtDir = doc.createTextNode(args.director)
                  director.appendChild(txtDir);

                  year = doc.createElement("year");
                  txtYear = doc.createTextNode(args.year)
                  year.appendChild(txtYear);

                  genres = doc.createElement("genres");
                  for(i = 0 ; i < args.genres.split('&').length ; i++){
                    genre = doc.createElement("genre");
                    txtGenre = doc.createTextNode(args.genres.split('&')[i])
                    genre.appendChild(txtGenre);
                    genres.appendChild(genre);
                  }

                  stars = doc.createElement("stars");
                  console.log(args.stars.split('&').length);
                  for(i = 0 ; i < args.stars.split('&').length ; i++){
                    stName = doc.createElement("name");
                    txtStr = doc.createTextNode(args.stars.split('&')[i])
                    stName.appendChild(txtStr);
                    stars.appendChild(stName);
                  }

                  newMovie = doc.createElement("movie");
                  newMovie.appendChild(name);
                  newMovie.appendChild(director);
                  newMovie.appendChild(year);
                  newMovie.appendChild(genres);
                  newMovie.appendChild(stars);
                  doc.getElementsByTagName("movielist")[0].appendChild(newMovie);

                  var result = nodes.toString();
                  fs.writeFile('movieG5.xml', '<?xml version="1.0" encoding="UTF-8"?>'+result, function(err, data){
                      if (err) console.log(err);
                      console.log("successfully written our update xml to file");
                  })
                  return { xml: result };
            },
//====================== Delete Movie =========================================================
            deleteMovie: function (args) {  //remove
                var xml = require('fs').readFileSync('movieG5.xml', 'utf8')
                xml = xml.replace(/(\r\n|\n|\r|\t)/gm, "");
                var doc = new dom().parseFromString(xml)
                var nodes = xpath.select("/movielist", doc);
                var i = 0;
                while (i < nodes[0].getElementsByTagName("movie").length) {
                    if (nodes[0].getElementsByTagName("movie")[i].getElementsByTagName("name")[0].childNodes[0].nodeValue == args.movie_name) {
                        nodes[0].removeChild(nodes[0].getElementsByTagName("movie")[i]);
                    } else {
                        i++;
                    }
                }
                var result = nodes.toString();
                fs.writeFile('movieG5.xml', '<?xml version="1.0" encoding="UTF-8"?>'+result, function(err, data){
                    if (err) console.log(err);
                    console.log("successfully written our update xml to file");
                })
                return { xml: result };
            },
//====================== Query Movie =========================================================
            queryMoviename: function (args) {  //query
                var xml = require('fs').readFileSync('movieG5.xml', 'utf8')
                xml = xml.replace(/(\r\n|\n|\r|\t)/gm, "");
                var doc = new dom().parseFromString(xml)
                var nodes = xpath.select("/movielist", doc);
                console.log(nodes[0].getElementsByTagName("movie").length);
                var i = 0;
                while (i < nodes[0].getElementsByTagName("movie").length) {       //remove tuples that none of argumnet is equal
                    if (nodes[0].getElementsByTagName("movie")[i].getElementsByTagName("name")[0].childNodes[0].nodeValue == args.movie_name) {
                        console.log(nodes[0].getElementsByTagName("movie")[i].getElementsByTagName("name")[0].childNodes[0].nodeValue);
                        i++;
                    } else {
                        nodes[0].removeChild(nodes[0].getElementsByTagName("movie")[i]);
                    }
                }
                console.log(nodes.toString());
                return { xml: nodes.toString() };
            },

            queryMoviedirector: function (args) {  //query
              var xml = require('fs').readFileSync('movieG5.xml', 'utf8')
              xml = xml.replace(/(\r\n|\n|\r|\t)/gm, "");
              var doc = new dom().parseFromString(xml)
              var nodes = xpath.select("/movielist", doc);
              console.log(nodes[0].getElementsByTagName("movie").length);
              var i = 0;
              while (i < nodes[0].getElementsByTagName("movie").length) {       //remove tuples that none of argumnet is equal
                  if (nodes[0].getElementsByTagName("movie")[i].getElementsByTagName("director")[0].childNodes[0].nodeValue == args.movie_director) {
                      console.log(nodes[0].getElementsByTagName("movie")[i].getElementsByTagName("name")[0].childNodes[0].nodeValue);
                      i++;
                  } else {
                      nodes[0].removeChild(nodes[0].getElementsByTagName("movie")[i]);
                  }
              }
              console.log(nodes.toString());
              return { xml: nodes.toString() };
            },

            queryMovieyear: function (args) {  //query
              var xml = require('fs').readFileSync('movieG5.xml', 'utf8')
              xml = xml.replace(/(\r\n|\n|\r|\t)/gm, "");
              var doc = new dom().parseFromString(xml)
              var nodes = xpath.select("/movielist", doc);
              console.log(nodes[0].getElementsByTagName("movie").length);
              var i = 0;
              while (i < nodes[0].getElementsByTagName("movie").length) {       //remove tuples that none of argumnet is equal
                  if (nodes[0].getElementsByTagName("movie")[i].getElementsByTagName("year")[0].childNodes[0].nodeValue == args.movie_year) {
                      console.log(nodes[0].getElementsByTagName("movie")[i].getElementsByTagName("name")[0].childNodes[0].nodeValue);
                      i++;
                  } else {
                      nodes[0].removeChild(nodes[0].getElementsByTagName("movie")[i]);
                  }
              }
              console.log(nodes.toString());
              return { xml: nodes.toString() };
            },

//===============================================================================
            addMovie: function (args) {  //add
                var xml = require('fs').readFileSync('movieG5.xml', 'utf8')
                xml = xml.replace(/(\r\n|\n|\r|\t)/gm, "");
                var doc = new dom().parseFromString(xml)
                var nodes = xpath.select("/movielist", doc);
                var newMovie = doc.createElement("movie")

                name = doc.createElement("name");
                txtName = doc.createTextNode(args.movie_name)
                name.appendChild(txtName);

                director = doc.createElement("director");
                txtDir = doc.createTextNode(args.director)
                director.appendChild(txtDir);

                year = doc.createElement("year");
                txtYear = doc.createTextNode(args.year)
                year.appendChild(txtYear);

                genres = doc.createElement("genres");
                for(i = 0 ; i < args.genres.split('&').length ; i++){
                  genre = doc.createElement("genre");
                  txtGenre = doc.createTextNode(args.genres.split('&')[i])
                  genre.appendChild(txtGenre);
                  genres.appendChild(genre);
                }

                stars = doc.createElement("stars");
                console.log(args.stars.split('&').length);
                for(i = 0 ; i < args.stars.split('&').length ; i++){
                  stName = doc.createElement("name");
                  txtStr = doc.createTextNode(args.stars.split('&')[i])
                  stName.appendChild(txtStr);
                  stars.appendChild(stName);
                }

                newMovie = doc.createElement("movie");
                newMovie.appendChild(name);
                newMovie.appendChild(director);
                newMovie.appendChild(year);
                newMovie.appendChild(genres);
                newMovie.appendChild(stars);
                doc.getElementsByTagName("movielist")[0].appendChild(newMovie);

                var result = nodes.toString();
                fs.writeFile('movieG5.xml', '<?xml version="1.0" encoding="UTF-8"?>'+result, function(err, data){
                    if (err) console.log(err);
                    console.log("successfully written our update xml to file");
                })
                return { xml: result };
            }
        }
    }
}
var xml = require('fs').readFileSync('MovieService.wsdl', 'utf8'),
      server = http.createServer(function (request, response) {
          response.end("404: Not Found: " + request.url)
      });

//server.listen(process.env.PORT || 3000, process.env.IP || "127.0.0.1", function () {
server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
  var addr = server.address();
  console.log("server listening at", addr.address + ":" + addr.port);
});

soap.listen(server, '/wsdl', movieService, xml);
