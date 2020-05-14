(function () {
	window.video_service = {};

	document.getElementById('form__file').onchange = function (e) {
		var files = e.target.files;
		var file = files[0];
		if (!file) {
			return alert('No file selected.');
		}
		getSignedRequest(file);
	};

	function getSignedRequest(file) {
		var xhr = new XMLHttpRequest();
		xhr.open('GET', '/video/sign_s3?file_name=' + file.name + '&file_type=' + file.type);
		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status === 200) {
					var response = JSON.parse(xhr.responseText);
					uploadFile(file, response.data, response.url);
				} else {
					alert('Could not get signed URL.');
				}
			}
		};
		xhr.send();
	}

	function uploadFile(file, s3Data, url) {
		console.log(s3Data);
		var xhr = new XMLHttpRequest();
		xhr.open('POST', s3Data.url);

		var postData = new FormData();
		for (key in s3Data.fields) {
			postData.append(key, s3Data.fields[key]);
		}
		postData.append('file', file);

		xhr.onreadystatechange = function () {
			if (xhr.readyState === 4) {
				if (xhr.status === 200 || xhr.status === 204) {
					document.getElementById('preview').src = url;
					document.getElementById('avatar-url').value = url;
				} else {
					alert('Could not upload file.');
				}
			}
		};
		xhr.send(postData);
	}
})();