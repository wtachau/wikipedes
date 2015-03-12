$('select').selectize({
	valueField: 'text',
	labelField: 'text',
	searchField: 'link',
	options: [],
	create: false,
	render: {
		option: function(item, escape) {
			return '<div class="suggestion">'+
						'<div class="text"><b>' + item.text + '</b></div>' + 
						'<div class="link"><i>' + item.link + '</i></div>' + 
						'<div class="desc">' + item.desc + '</div>' +
					'</div>';
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
                search: query
            },
			error: function() {
				callback();
			},
			success: function(res) {

				var suggestions = []
				for (var i = 0; i < 10; i++) {
					var suggestion = {}
					// text
					suggestion['text'] = res[1][i]; 
					// desc (truncate if necessary)
					var desc = res[2][i];
					var length = 125;
					if (desc && desc.length > length) {
						suggestion['desc'] = desc.substring(0, length-3) + "...";
					} else {
						suggestion['desc'] = desc;
					}
					// link
					suggestion['link'] = res[3][i];
					suggestions.push(suggestion);
				}
				callback(suggestions);
			}
		});
	}
});