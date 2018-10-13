// param: element: a DOM element that should look like this:
//
//     <ssi-ajax>include virtual="included.html"</ssi-ajax>
//
// return: the URL in there
//
function extract_include( element ) {
	var inner_text=element.innerText;                   // 'include virtual="included.html"'
	return( inner_text.replace("include virtual=\"","") // 'included.html'
	                  .replace("\"",""));
}

// https://stackoverflow.com/a/494348 by "Crescent Fresh"
function createElementFromHTML(htmlString) {
	var div = document.createElement('div');
	div.innerHTML = htmlString.trim();

	// Change this to div.childNodes to support multiple top-level nodes
	return div.firstChild; 
}

// the ssi-ajax content will be rendered once fetched
// param: element: a <ssi-ajax> DOM element
function fetch_and_replace(element) {
	var xhttp = new XMLHttpRequest();
	xhttp.onreadystatechange = function() {
		if (this.readyState == 4 && this.status == 200) {
			element.parentNode.replaceChild(
				createElementFromHTML(this.responseText),
				element);
		}
	};
	var url   = extract_include(element);
	xhttp.open("GET", url, true);
	xhttp.send();
}

function load_includes() {
	var includes = document.getElementsByTagName("ssi-ajax");
	for(var i = 0; i < includes.length; i++)
	{
		var element=includes.item(i);
		fetch_and_replace(element);
	}
}
