var soap = require('soap');
var xpath = require('xpath')
var express = require('express');
var dom = require('xmldom').DOMParser;
var bodyParser = require('body-parser');
//var url = 'http://127.0.0.1:3000/wsdl?wsdl';  // offline
var url = 'https://selecta1app.herokuapp.com/wsdl?wsdl';

var app = express();
app.set('view engine', 'ejs');
app.use('/assets', express.static('assets'));
app.use(bodyParser.urlencoded({ extended: true }));

app.get('/', function(req, res) {
		res.render('index', {content : ""});
})

app.post('/search/add', function(req, res) {
    var content = '';
		//console.log(req.body);
    soap.createClient(url, function (err, client) {
        if(req.body.ac_buttun == 'search'){
            	if(req.body.search != ""){
								if(req.body.optradio == 'movie_name'){
										var args = { movie_name: req.body.search};
										client.queryMoviename(args, function (err, result) {
												data = buildTable(result.xml);
												res.render('index', {content: data.table});
								});}
								if(req.body.optradio == 'director_name'){
										var args = { movie_director: req.body.search};
										client.queryMoviedirector(args, function (err, result) {
												data = buildTable(result.xml);
												res.render('index', {content: data.table});
								});}
								if(req.body.optradio == 'year'){
									var args = { movie_year: req.body.search};
									client.queryMovieyear(args, function (err, result) {
											data = buildTable(result.xml);
											res.render('index', {content: data.table});
									});}
						}
						else{
								res.render('index', {content: ""});
						}
        }else if (req.body.ac_buttun == 'add'){
					if(req.body.movieName == "" || req.body.directorName == "" || req.body.year == "" || req.body.genres == "" || req.body.stars == ""){
							res.render('index', {content: "<div align='center'><img src='/assets/img/error.png' width='304' height='236' class='img-rounded'><br><h3>Add Movie Error :(</h3><div>"});
					}else {
							var args = { movie_name: req.body.movieName, director: req.body.directorName, year: req.body.year, genres: req.body.genres, stars: req.body.stars };
							soap.createClient(url, function (err, client) {
							    client.addMovie(args, function (err, result) {
											var data = buildTable(result.xml);
											res.render('index', {content: "<div align='center'><img src='/assets/img/cloudadd.png' width='304' height='236' class='img-rounded'><br><h3>Add Successful :)</h3><div>"+data.table});
							    });
							});
					}
        }
    });
})

app.post('/edit', function(req, res) {
	var args = { movie_name: req.body.movieName, director: req.body.directorName, year: req.body.year, genres: req.body.genres, stars: req.body.stars, Dname: req.body.Dname };
	soap.createClient(url, function (err, client) {
				client.updateMovie(args, function (err, result) {
					var data = buildTable(result.xml);
					res.render('index', {content: "<div align='center'><img src='/assets/img/handshake.png' width='304' height='236' class='img-rounded'><br><h3>Editing Successful :)</h3><div"+data.table});
				});
	});
})

app.post('/delete', function(req, res) {
	var args = { movie_name: req.body.movieName};
	soap.createClient(url, function (err, client) {
				client.deleteMovie(args, function (err, result) {
				var data = buildTable(result.xml);
				res.render('index', {content: "<div align='center'><img src='/assets/img/bin-red-icon.png' width='304' height='236' class='img-rounded'><br><h3>Remove Successful :)</h3><div"+data.table});
			});
	});

})

function buildTable(xml) {
    var x, i, xmlDoc, table;
    var doc = new dom().parseFromString(xml)
    var nodes = xpath.select("/movielist", doc);
    table = "<tr><th>#</th><th>Movie Name</th><th>Director Name</th><th>Year</th><th>Genres</th><th>Stars</th><th>Time</th><th>Resolution</th></th><th>Action</th></tr>";
    x = doc.getElementsByTagName("movie")
		if(nodes[0].getElementsByTagName("movie").length > 0){
		    for (i = 0; i < x.length; i++) {
		        var genresStr,genres,each_genre,starStr,stars,each_star,genre,star,genreE,starE;
		        genresStr = "";
						genre = "";
						genreE = "";
		        genres = x[i].getElementsByTagName("genres");
		        each_genre = genres[0].getElementsByTagName("genre");
		        for (j = 0; j < each_genre.length; j++) {
		          genresStr += each_genre[j].childNodes[0].nodeValue+"<br>";
							genre += (' [ '+each_genre[j].childNodes[0].nodeValue+' ] ');
							genreE += (each_genre[j].childNodes[0].nodeValue);
							if(j < each_genre.length-1){
								genreE += '&';
							}
		        }
		        starStr = "";
						star = "";
						starE = "";
		        stars = x[i].getElementsByTagName("stars");
		        each_star =  stars[0].getElementsByTagName("name");
		        for (k = 0; k < each_star.length; k++) {
		          starStr += each_star[k].childNodes[0].nodeValue+"<br>";
							star += (' [ '+each_star[k].childNodes[0].nodeValue+' ] ');
							starE += (each_star[k].childNodes[0].nodeValue);
							if(k < each_star.length-1){
								starE += '&';
							}
		        }
		        table += "<tr><td>"+(i+1)+"</td><td>" +
		        x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue +
		        "</td><td>" +
		        x[i].getElementsByTagName("director")[0].childNodes[0].nodeValue +
		        "</td><td>" +
		        x[i].getElementsByTagName("year")[0].childNodes[0].nodeValue +
		        "</td><td>" +
		        genresStr +
		        "</td><td>" +
		        starStr +
		        "</td><td>"+
		         x[i].getElementsByTagName("time")[0].childNodes[0].nodeValue +
		        "</td><td>" +
		         x[i].getElementsByTagName("resolution")[0].childNodes[0].nodeValue +
		        "</td><td>" +
						'<a class="btn btn-default btn-xs" data-toggle="modal" data-target="#detailBox'+i.toString()+'"><i class="fa fa-info-circle fa-lg"></i> Detail</a>&nbsp;&nbsp;'+
						'<a class="btn btn-primary btn-xs" data-toggle="modal" data-target="#editBox'+i.toString()+'"><i class="fa fa-pencil-square-o fa-lg"></i> Edit</a>&nbsp;&nbsp;'+
						'<a class="btn btn-danger btn-xs" data-toggle="modal" data-target="#deleteBox'+i.toString()+'"><i class="fa fa-trash-o fa-lg"></i> Delete</a>&nbsp;&nbsp;'+
						"</td></tr>"+
						'<div class="modal fade" id="detailBox'+i.toString()+'" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel">'+
				        '<div class="modal-dialog" role="document">'+
				            '<div class="modal-content">'+
				              '<div class="modal-header">'+
				                  '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
				                  '<h4 class="modal-title" id="exampleModalLabel"><b>Movie detail</b></h4>'+
				              '</div>'+
				              '<div class="modal-body">'+
				                  '<form>'+
				                      '<div class="form-group">'+
				                          '<label>Movie Name</label>'+
				                          '<input type="text" class="form-control" id="movieName" value="'+x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue+'" readonly>'+
				                      '</div>'+
				                      '<div class="form-group">'+
				                          '<label>Director Name</label>'+
				                          '<input type="text" class="form-control" id="directorName" value="'+x[i].getElementsByTagName("director")[0].childNodes[0].nodeValue+'" readonly>'+
				                      '</div>'+
				                      '<div class="form-group">'+
				                          '<label>Year</label>'+
				                          '<input type="text" class="form-control" id="year" value="'+x[i].getElementsByTagName("year")[0].childNodes[0].nodeValue+'" readonly>'+
				                      '</div>'+
				                      '<div class="form-group">'+
				                          '<label>Genres</label>'+
				                          '<input type="text" class="form-control" id="genres" value="'+genre+'" readonly>'+
				                      '</div>'+
				                      '<div class="form-group">'+
				                          '<label>Stars</label>'+
				                          '<input type="text" class="form-control" id="stars" value="'+star+'" readonly>'+
				                      '</div>'+
				                      '<div class="form-group">'+
				                          '<label>Year</label>'+
				                          '<input type="text" class="form-control" id="year" value="'+x[i].getElementsByTagName("time")[0].childNodes[0].nodeValue+'" readonly>'+
				                      '</div>'+
				                      '<div class="form-group">'+
				                          '<label>Year</label>'+
				                          '<input type="text" class="form-control" id="year" value="'+x[i].getElementsByTagName("resolution")[0].childNodes[0].nodeValue+'" readonly>'+
				                      '</div>'+
				                  '</form>'+
				              '</div>'+
				              '<div class="modal-footer">'+
				              '</div>'+
				            '</div>'+
				        '</div>'+
				    '</div>'+

						'<form action="/edit" method="post">'+
						'<div class="modal fade" id="editBox'+i.toString()+'" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel">'+
				        '<div class="modal-dialog" role="document">'+
				            '<div class="modal-content">'+
				              '<div class="modal-header">'+
				                  '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
				                  '<h4 class="modal-title" id="exampleModalLabel"><b>Edit movie detail</b></h4>'+
				              '</div>'+
					              '<div class="modal-body">'+
					                      '<div class="form-group">'+
					                          '<label>Movie Name</label>'+
					                          '<input type="text" class="form-control" name="movieName" value="'+x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue+'">'+
																		'<input type="hidden" class="form-control" name="Dname" value="'+x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue+'">'+
					                      '</div>'+
					                      '<div class="form-group">'+
					                          '<label>Director Name</label>'+
					                          '<input type="text" class="form-control" name="directorName" value="'+x[i].getElementsByTagName("director")[0].childNodes[0].nodeValue+'">'+
					                      '</div>'+
					                      '<div class="form-group">'+
					                          '<label>Year</label>'+
					                          '<input type="text" class="form-control" name="year" value="'+x[i].getElementsByTagName("year")[0].childNodes[0].nodeValue+'">'+
					                      '</div>'+
					                      '<div class="form-group">'+
					                          '<label>Genres : </label><label style="color: #999999">&nbsp;&nbsp;Example&nbsp;&nbsp;>>&nbsp;&nbsp;Genres1&Genres2&Genres3&Genres..n</label>'+
					                          '<input type="text" class="form-control" name="genres" value="'+genreE+'">'+
					                      '</div>'+
					                      '<div class="form-group">'+
					                          '<label>Stars : </label><label style="color: #999999">&nbsp;&nbsp;Example&nbsp;&nbsp;>>&nbsp;&nbsp;Stars1&Stars2&Stars3&Stars..n</label>'+
					                          '<input type="text" class="form-control" name="stars" value="'+starE+'">'+
					                      '</div>'+
							              '</div>'+
							              '<div class="modal-footer">'+
							                  '<button type="submit" class="btn btn-primary">Submit</button>'+
							              '</div>'+
					            '</div>'+
				        '</div>'+
				    '</div>'+
						'</form>'+

						'<form action="/delete" method="post">'+
						'<div class="modal fade" id="deleteBox'+i.toString()+'" tabindex="-1" role="dialog" aria-labelledby="exampleModalLabel">'+
				        '<div class="modal-dialog" role="document">'+
				            '<div class="modal-content">'+
				              '<div class="modal-header">'+
				                  '<button type="button" class="close" data-dismiss="modal" aria-label="Close"><span aria-hidden="true">&times;</span></button>'+
				                  '<h4 class="modal-title" id="exampleModalLabel"><b>Delete Movie</b></h4>'+
				              '</div>'+
				              '<div class="modal-body">'+
				                      '<div class="form-group">'+
				                          '<label>Movie Name</label>'+
				                          '<input type="text" class="form-control" name="movieName" value="'+x[i].getElementsByTagName("name")[0].childNodes[0].nodeValue+'" readonly>'+
				                      '</div>'+
				                      '<div class="form-group">'+
				                          '<label>Director Name</label>'+
				                          '<input type="text" class="form-control" name="directorName" value="'+x[i].getElementsByTagName("director")[0].childNodes[0].nodeValue+'" readonly>'+
				                      '</div>'+
				                      '<div class="form-group">'+
				                          '<label>Year</label>'+
				                          '<input type="text" class="form-control" name="year" value="'+x[i].getElementsByTagName("year")[0].childNodes[0].nodeValue+'" readonly>'+
				                      '</div>'+
				                      '<div class="form-group">'+
				                          '<label>Genres</label>'+
				                          '<input type="text" class="form-control" name="genres" value="'+genre+'" readonly>'+
				                      '</div>'+
				                      '<div class="form-group">'+
				                          '<label>Stars</label>'+
				                          '<input type="text" class="form-control" name="stars" value="'+star+'" readonly>'+
				                      '</div>'+
				              '</div>'+
				              '<div class="modal-footer">'+
													'<button type="submit" class="btn btn-danger">Delete Movie</button>'+
				              '</div>'+
				            '</div>'+
				        '</div>'+
				      '</div>'
						'</form>';
		    }
			}else {
				table = "<div align='center'><img src='/assets/img/not-found-img.png' width='304' height='236' class='img-rounded'><br><h3>Not Found !!</h3><div>"
			}
    return({table: table})
}

var port = process.env.PORT || 8000;
app.listen(port, function(){
		console.log('listening on 127.0.0.1:'+port);
});
