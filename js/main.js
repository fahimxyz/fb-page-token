function bml_fb_popup(url, width, height, cb) {

	var top = top || (screen.height/2) - (height/2);
	var left = left || (screen.width/2) - (width/2);

	win = window.open(url, '', 'location=1, status=1, resizable=yes, width='+width+', height='+height+', top='+top+', left='+left);
	
	function check() {

		if (!win || win.closed != false) {
			cb();
		} else {
			setTimeout(check, 100);
		}

	}

	setTimeout(check, 100);
}

function bml_fb_connect(el, data) {

	bml_fb_popup('https://app.widgetpack.com/auth/fbrev?scope=manage_pages,pages_show_list', 670, 520, function() {

		WPacXDM.get('https://embed.widgetpack.com', 'https://app.widgetpack.com/widget/facebook/accesstoken', {}, function(res) {
				
			WPacFastjs.jsonp('https://graph.facebook.com/me/accounts', { access_token: res.accessToken, limit: 250 }, function(res) {

				// let page_id = '1588162751487144';
				var page_id = document.getElementById('bml[page_id]').value;

				var connectErr = document.getElementById('error_fb_connect');

				WPacFastjs.each( res.data, function(page) {

					if( page.id === page_id ) {

						let accessTokenEl = document.getElementById('bml[page_access_token]');

						accessTokenEl.value = page.access_token;

						jQuery( accessTokenEl ).change();

						connectErr.style.display = "none";

						jQuery( connectErr ).change();

					} else {

						connectErr.innerHTML = 'Something is wrong, please enter correct page id.';
						connectErr.style.display = "block";

						jQuery(connectErr).change();

					}
				});
			});
		});
	});

	return false;
}

function bml_fb_init(data) {

	var el = data.el;

	if (!el) return;

	var connectBtn = el.querySelector('.bml-fb-connect');

	WPacFastjs.on(connectBtn, 'click', function() {
		bml_fb_connect(el, data);
		console.log('work!');
		return false;
	});

}