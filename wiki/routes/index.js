var express = require('express');
var router = express.Router();
var neo4j = require('node-neo4j');
var request = require('request');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

db = new neo4j('http://localhost:7474/');

/* POST to find paths */
router.post('/path', function(req, res, next) {
	var link1 = req.body['link1'];
	var link2 = req.body['link2'];

	console.log(req.body);

	var query = "MATCH (p0:Page {title:'"+link1+"'}), (p1:Page {title:'"+link2+"'}), p = shortestPath((p0)-[*..6]->(p1)) RETURN NODES(p)";
	console.log(query);

	db.cypherQuery(query, function(err, result){
	    if(err) throw err;

	    results = []
	    for (index in result.data[0]) {
	    	var name = result.data[0][index].data.title;
	    	results.push({	"name": name,
	    					"link": "http://en.wikipedia.org/wiki/" + name.split(" ").join("_") });
	    }
	    console.log(results);
	    res.json(results);
	});
});

router.post('/text', function(req, res, next) {
	request({uri: req.body['fromLink']}, function(err, response, body){
		var shortLink = req.body['targetLink'].replace("http://en.wikipedia.org","");
		var linkIndex = body.indexOf('<a href="'+shortLink);

		var length = 800;
		// "Crop" only a section of the html body
		var bodyText = body.substr(linkIndex - length/2, length);
		// Prune all text before a leading > (i.e. the tail end of an html element)
		bodyText = bodyText.substring( bodyText.indexOf(">") + 1, bodyText.length);
		res.json({	"text": bodyText,
					"element": req.body['element']	})
	});
});

module.exports = router;