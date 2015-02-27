$(function() {
	$('#subject1').selectize({
	    valueField: 'title',
	    labelField: 'title',
	    searchField: 'title',
	    options: [],
	    create: false,
	    render: {
	        option: function(item, escape) {

	        	console.log(item);
	        	return "<h1>hey</h1>"
	            // var actors = [];
	            // for (var i = 0, n = item.abridged_cast.length; i < n; i++) {
	            //     actors.push('<span>' + escape(item.abridged_cast[i].name) + '</span>');
	            // }

	            // return '<div>' +
	            //     '<img src="' + escape(item.posters.thumbnail) + '" alt="">' +
	            //     '<span class="title">' +
	            //         '<span class="name">' + escape(item.title) + '</span>' +
	            //     '</span>' +
	            //     '<span class="description">' + escape(item.synopsis || 'No synopsis available at this time.') + '</span>' +
	            //     '<span class="actors">' + (actors.length ? 'Starring ' + actors.join(', ') : 'Actors unavailable') + '</span>' +
	            // '</div>';
	        }
	    },
	    load: function(query, callback) {
	        if (!query.length) return callback();
	        $.ajax({
	            url: 'http://en.wikipedia.org/w/api.php',
	            type: 'GET',
	            dataType: 'jsonp',
	            data: {
	                format: 'json',
	                action: 'opensearch',
	                search: encodeURIComponent(query)
	            },
	            error: function() {
	                callback();
	            },
	            success: function(res) {
	            	console.log(res);
	            	console.log("---");
	            	console.log(res[1]);
	                callback(res[1]);
	            }
	        });
	    }
	});


	$('#subject1').selectize({
		valueField: 'url',
		labelField: 'name',
		searchField: 'name',
		options: [],
		create: false,
		render: {
			option: function(item, escape) {
				return '<div>' +
					'<span class="title">' +
						'<span class="name"><i class="icon ' + (item.fork ? 'fork' : 'source') + '"></i>' + escape(item.name) + '</span>' +
						'<span class="by">' + escape(item.username) + '</span>' +
					'</span>' +
					'<span class="description">' + escape(item.description) + '</span>' +
					'<ul class="meta">' +
						(item.language ? '<li class="language">' + escape(item.language) + '</li>' : '') +
						'<li class="watchers"><span>' + escape(item.watchers) + '</span> watchers</li>' +
						'<li class="forks"><span>' + escape(item.forks) + '</span> forks</li>' +
					'</ul>' +
				'</div>';
			}
		},
		score: function(search) {
			var score = this.getScoreFunction(search);
			return function(item) {
				return score(item) * (1 + Math.min(item.watchers / 100, 1));
			};
		},
		load: function(query, callback) {
			if (!query.length) return callback();
			$.ajax({
				url: 'https://api.github.com/legacy/repos/search/' + encodeURIComponent(query),
				type: 'GET',
				error: function() {
					callback();
				},
				success: function(res) {
					console.log(callback);
					console.log(res);
					console.log("--");
					console.log(res.repositories);
					callback(res.repositories.slice(0, 10));
				}
			});
		}
	});
});