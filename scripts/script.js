(function () {
	$(document).ready(function() {

		//every 20 seconds, change the lyric displayed
		var elementCycler = elementCycle.animate({
			delay: 20000, //20 seconds
			element: $("div#lyrics"),
			array: [
				"You won't get no dessert til you clean off your plate",
				"Have some more chicken / Have some more pie",
				"Have some more yogurt / Have some more spam",
				"Have a banana / Have a whole bunch",
				"Eat a big dinner / Have a light snack",
				"Get yourself an egg and beat it",
				"You haven't even touched your tuna casserole",
				"You'd better chow down or it's gonna get cold",
				"Open up your mouth and feed it",
				"https://www.youtube.com/watch?v=ZcJjMnHoIBI",
				"https://www.youtube.com/watch?v=ZcJjMnHoIBI", //twice on purpose to weight it
			],
		});

		// create the ajaxGetter
		// ajaxGetter.scheduleUpdate is the function that we will pass as a callback to the autoCompleter.
		// it will then be called when the keyup event passes through the autoCompleter.
		var ajaxGetter = new AjaxGet({
			resultsContainer: $("div#results"),
			rateLimit: 300,
			requestURL: "/cgi/q.php",
			requestData: function(data) { return {query: data}; },
			resultsGenerator: function(query, json) {
				var $resultsObject = $();
				var atLeastOneYelp = false;

				//for each restaurant, generate the visual elements
				$.each(json, function(index, restaurant) {
					var name = wrapContainedSubstring(restaurant.name, query);
					var cuisine = wrapContainedSubstring(restaurant.cuisine, query);

					var $result = $("<div class='result'></div>").append(name + ", " + cuisine);

					if (restaurant.yelpData) {
						atLeastOneYelp = true;
						$result.data("url", restaurant.yelpData.url); //store the url so that the autoCompleter can use it

						if (restaurant.yelpData.rating_img_url) {
							$result.append("<img class='rating' src='" + restaurant.yelpData.rating_img_url + "'>");
						}
					}

					$resultsObject = $resultsObject.add($result);
				});

				//if at least one result contained yelp data, add the yelpLogo
				if (atLeastOneYelp) {
					$resultsObject = $resultsObject.add(
						$("<div class='yelpFooter'></div>")
						.append("<a href='http://www.yelp.com/'></a>")
						.append("<img class='yelpLogo' src='images/Powered_By_Yelp_Red.png'>")
					);
				}

				return $resultsObject;
			},
		});

		// create the AutoCompleter
		// intercepts keyup/keydown events on inputElement: arrow up/down events are stolen; everything else is passed through to the keyupCallback
		// registers mouseover/mouseout/click listeners on resultsContainer to select a child of it and populate inputElement
		var AutoCompleter = new AutoComplete({
			inputElement: $("input#query"),
			resultsContainer: $("div#results"),
			resultSelector: "div.result",
			selectedClass: "selected",
			keyupCallback: ajaxGetter.scheduleUpdate,
			selectedCallback: function($selectedResult, sticky) {
				$('div#rating').empty().append($selectedResult.children("img.rating").clone());
				if (sticky) {
					//go to the url we stored in the ajaxGetter
					if ($selectedResult.data("url")) {
						//FIXME state persist on mobile safari et al
						//$('div#rating').empty(); //TODO need this?
						window.location = $selectedResult.data("url");
						console.log("going");
					}
				}
			},
		});

		// duplicate <input autofocus> for older browsers
		$("input#query").focus();
	});

	// HELPERS

	// wrapContainedSubstring
	// wrap a span around the (front-anchored) matching portion of the text, ignoring punctuation
	// the ignoring punctuation part makes this slightly complex. we simultaneously iterate over both text
	// and substring. if the text character is punctuation, then we blindly add it to the matched
	// section and move on, but -stay at the same place- in the substring
	// if the text character is NOT punctuation, then we try to match it against the substring character.
	function wrapContainedSubstring(text, substring) {
		var returnString = "<span class='highlight'>";
		var textArray = text.split("");
		var textIndex = 0;
		var substringArray = substring.split("");
		var substringIndex = 0;

		while (substringIndex < substring.length && textIndex < text.length) {
			if (textArray[textIndex].match(/[a-z0-9 ]/i)) { //textArray character is not punctuation
				if (substringArray[substringIndex].toLowerCase() === textArray[textIndex].toLowerCase()) {
					returnString = returnString + textArray[textIndex];
				}
				else {
					//the text and the substring don't match at this character. this means the whole substring is
					//not contained in the text; return the original string with no highlighting
					return text;
				}

				substringIndex += 1;
				textIndex += 1;
			}
			else { //textArray character is punctuation: blindly add it to matched section and move on
				returnString = returnString + textArray[textIndex];
				textIndex += 1;
			}
		}
		returnString = returnString + "</span>" + text.substr(textIndex);

		return returnString;
	}

}());
