// I pledge my honor that I have abided by the Stevens Honor System.
//   - Brian Silverman
//   - Nathaniel Blakely
//   - Michael Watson
//
// CS-546 Final Project

function handle_favorite(id, button) {
	var xmlhttp = new XMLHttpRequest();
    xmlhttp.onreadystatechange = function() {
        if (this.readyState == 4 && this.status == 200) {
			button.classList.toggle('selected');
        }
	};
    xmlhttp.open("POST", "/favorites/toggle/"+id, true);
    xmlhttp.send();
}
