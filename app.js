var http = require('http');
var soap = require('soap');
var xpath = require('xpath')
  , dom = require('xmldom').DOMParser;

var movieService = {
    Movie_Service: {
        Movie_Port: {
            updateMovie: function (args) {  //change
                  var xml = require('fs').readFileSync('movieG5.xml', 'utf8')
                  xml = xml.replace(/(\r\n|\n|\r|\t)/gm, "");
                  var doc = new dom().parseFromString(xml)
                  var nodes = xpath.select("/movielist", doc);
                  for (var i = 0; i < nodes[0].getElementsByTagName("movie").length; i++) {
                      if (nodes[0].getElementsByTagName("movie")[i].getElementsByTagName("name")[0].childNodes[0].nodeValue == args.old_movie_name) {
                          nodes[0].getElementsByTagName("movie")[i].getElementsByTagName("name")[0].childNodes[0].data = args.new_movie_name;
                      }
                  }
                  console.log(nodes[0].getElementsByTagName("movie")[0].getElementsByTagName("name")[0].toString());
                  return { xml: nodes.toString() };
            },
            deleteMovie: function (args) {  //remove
                var xml = require('fs').readFileSync('movieG5.xml', 'utf8')
                xml = xml.replace(/(\r\n|\n|\r|\t)/gm, "");
                var doc = new dom().parseFromString(xml)
                var nodes = xpath.select("/movielist", doc);
                console.log(nodes[0].getElementsByTagName("movie").length);
             //-------------------------------------------- remove by id ----------------------------------------------------------
                //nodes[0].removeChild(nodes[0].getElementsByTagName("movie")[args.movie_id]);
             //--------------------------------------------------------------------------------------------------------------------
             //-------------------------------------------- remove by movie name --------------------------------------------------
                for (var i = 0; i < nodes[0].getElementsByTagName("movie").length; i++) {
                    if (nodes[0].getElementsByTagName("movie")[i].getElementsByTagName("name")[0].childNodes[0].data == args.movie_name) {
                        if (nodes[0].getElementsByTagName("movie")[i].getElementsByTagName("director")[0].childNodes[0].data == args.director) {
                            nodes[0].removeChild(nodes[0].getElementsByTagName("movie")[i]);
                            i++;
                        }
                    }
                }
             //--------------------------------------------------------------------------------------------------------------------
                console.log(nodes[0].getElementsByTagName("movie")[0].getElementsByTagName("name")[0].toString());
                return { xml: nodes.toString() };
            },



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
                genre = doc.createElement("genre");
                txtGenre = doc.createTextNode(args.genre[1])
                genre.appendChild(txtGenre);
                genres.appendChild(genre);

                stars = doc.createElement("stars");
                stName = doc.createElement("name");
                txtStr = doc.createTextNode(args.star)
                stName.appendChild(txtStr);
                stars.appendChild(stName);

                newMovie = doc.createElement("movie");
                newMovie.appendChild(name);
                newMovie.appendChild(director);
                newMovie.appendChild(year);
                newMovie.appendChild(genres);
                newMovie.appendChild(stars);
                doc.getElementsByTagName("movielist")[0].appendChild(newMovie);
                var result = nodes.toString();
                return { xml: result };
            }
        }
    }
}
var xml = require('fs').readFileSync('MovieService.wsdl', 'utf8'),
      server = http.createServer(function (request, response) {
          response.end("404: Not Found: " + request.url)
      });

server.listen(process.env.PORT || 3000, process.env.IP || "0.0.0.0", function () {
  var addr = server.address();
  console.log("server listening at", addr.address + ":" + addr.port);
  });

soap.listen(server, '/wsdl', movieService, xml);
