// When form is submitted
jQuery(function($) {
	$('form').on('submit', function(e){
		//STOP default action
		event.preventDefault();

		var values = $("select").map(function(index, select) { return select['value']; });
		var formURL = $(this).attr("action");
		var data = {'link1': values[0], 'link2': values[1] };

		if (values[0] == "" || values[1] == "") return;

		$('.entry_form').animate({ marginTop: '180px'}, 400);
		$(".path_links").html('<img src="images/spin.gif">');
		$('button[type="submit"]').attr('disabled', true);
		$.ajax(
		{
		    url : formURL,
		    type: "POST",
		    data : data,
		    success:function(data, textStatus, jqXHR) 
		    {
				// enable the button
				$('button[type="submit"]').attr('disabled', false);
				$('button[type="submit"]').hide();
				$('button.start_over').show();
				// slide everything up
				$('.entry_form').animate({ marginTop: '80px'}, 500);

				$(".path_links").html('<div class="list-group"></div>');

				for (index in data) {
					var linkID = "#link"+index;
					var body = (index < data.length - 1) ? '<div class="panel-body"></div>' : '';
					$(".path_links").append(' <div id="link'+index+'">' + 
							' <div class="panel panel-default">'+
								'<div class="panel-heading">'+
									'<a target="blank" href="'+data[index]['link'] + '"' +
								    	' <h3 class="panel-title">'+ data[index]['name']+'</h3>'+
								    '</a>'+
								'</div>'+
								body +
							'</div> ' + 
						'</a>')

					$(linkID).hide().fadeIn(500);

					if(index < data.length - 1) {
						$.ajax(
						{
							url: '/text',
							type: 'POST',
							data: { 'fromLink': data[index]['link'], 
									'targetLink': data[Number(index)+1]['link'],
									'element' : linkID 
							},
							success:function(data, textStatus, jqHXR) 
							{
								$(data['element']+" div.panel-body").html("..."+data['text']+"...");
							}
						});
					}
				}
		    },
		    error: function(jqXHR, textStatus, errorThrown) 
		    {
		    	$('button').attr('disabled', false);
		        alert("Error! Failed response from the server");
		        console.log(errorThrown + " " + textStatus);    
		    }
		});
	});

	$('button.start_over').click(function(){ 
		$('button[type="submit"]').show();
		$('button.start_over').hide();
		$(".path_links").html("");
		$('.entry_form').animate({ marginTop: '200px'}, 500);
		$("select")[0].selectize.clear();
		$("select")[1].selectize.clear();
	});

});