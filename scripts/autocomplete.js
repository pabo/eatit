// brett.schellenberg@gmail.com
//
// DESCRIPTION
// Given an HTML input element (or other element that can accept keypresses), and an HTML container of results,
// AutoComplete creates an auto-complete interface where a user can select an option with arrow keys or the mouse.
//
// intercepts keyup/keydown events on inputElement: some keys like arrow, enter are captured; everything else is passed through to the keyupCallback
//
// requires jquery
// variables that start with $ are jquery collections
//
// KNOWN ISSUES
// none
//
// TYPICAL USAGE
// var AutoCompleter = new AutoComplete({
//   inputElement: $("input#query"),
//   resultsContainer: $("div#results"),
//   resultSelector: "div.result",
//   keyupCallback: function(query) {
//     //what should happen on keyup, like updating the div#results div with new results
//     //query argument is the normalized value of input#query
//   },
// });

function AutoComplete(options) {
	//constructor with "new" clobber protection
	if (!(this instanceof AutoComplete)) {
		return new AutoComplete(options);
	}

	var $inputElement     = options.inputElement,     //jQuery object (required)
		$resultsContainer = options.resultsContainer, //jQuery object (required)
		resultSelector    = options.resultSelector,   //string jQuery selector that describes what a result looks like. example: "div.result" (required)
		keyupCallback     = options.keyupCallback,    //function that will be called on keyup, so long as we decide the keyup event wasn't just meant for us (optional)
		selectedCallback  = options.selectedCallback, //function that will be called on selection (optional)
		selectedClass     = options.selectedClass,    //class that will be applied to the selected result (required)

		$selectedResult = $(),                        //jQuery object representing the currently selected result
		isSticky = false,                             //boolean whether the user made a selection that should persist (via click, or arrow and enter).
		userEnteredValue,                             //what the user actually typed in
		captureKeyCodes = [                           //key codes that represent the user interacting with us, as opposed to entering text
			13, //enter
			16, //shift
			37, //left arrow
			38, //up arrow
			39, //right arrow
			40, //down arrow
		];


	// arrow up key, arrow down key, and enter key are the user trying to make a selection from our list.
	$inputElement.keydown(function(e){
		//don't do anything if shift key is down; user might be trying to (for instance) shift+up arrow to select
		if (e.shiftKey === false) {
			if (e.which === 38) { //arrow up
				if ($selectedResult.length) {
					if ($selectedResult.prev().length){
						$selectedResult = $selectedResult.prev();
					}
					else {
						$selectedResult = $();
					}
				}
				else {
					$selectedResult = $resultsContainer.children().last();
				}

				makeSelection($selectedResult, false);
				e.preventDefault();
			}
			else if (e.which === 40) { //arrow down
				if ($selectedResult.length) {
					if ($selectedResult.next().length){
						$selectedResult = $selectedResult.next();
					}
					else {
						$selectedResult = $();
					}
				}
				else {
					$selectedResult = $resultsContainer.children().first();
				}

				makeSelection($selectedResult, false);
				e.preventDefault();
			}
			else if (e.which === 13) { //enter
				makeSelection($resultsContainer.children(resultSelector + "." + selectedClass), true);
				$resultsContainer.hide();
				e.preventDefault();
			}
		}
	});

	//pass almost all keyup events on through to the keyupCallback
	$inputElement.keyup(function(e){
		if (captureKeyCodes.indexOf(e.which) !== -1) {
			//these keyCodes are the user interacting with the autocompleter itself, so we don't call keyupCallback
		}
		else {
			isSticky = false;
			userEnteredValue = $inputElement.val();

			clearSelection();
			keyupCallback(e); // keyupCallback is something like ajaxGetter.scheduleUpdate
		}
	});

	$resultsContainer.mouseover(function(e){
		makeSelection($(e.target).closest(resultSelector), false);
	});

	$resultsContainer.mouseout(function(e){
		clearSelection();
	});

	//mousedown instead of click so that this event fires before the blur event
	$resultsContainer.on("mousedown touchend", function(e){
		var $selectedResult = $(e.target).closest(resultSelector);

		makeSelection($selectedResult, true);
		$resultsContainer.hide();
	});

	//when the input element loses focus, close the results
	$inputElement.blur(function(e){
		//if the user arrows to a selection, then clicks somewhere else on the page, should we keep the selection or not? For now, don't keep it.
		clearSelection();

		$resultsContainer.hide();
	});

	//when the input element re-gains focus, show the results again, unless the user already selected one manually
	$inputElement.focus(function(e){
		if (! isSticky) {
			$resultsContainer.show();
		}
	});

	function makeSelection($targetResult, sticky) {
		//isSticky is whether the user made a selection that should persist (via click, or arrow and enter).
		//compare to selection that occurs when the user arrows through the list
		isSticky = sticky;
		if (isSticky) {
			$resultsContainer.hide();
		}

		$selectedResult = $targetResult;
		displaySelection();

		selectedCallback($selectedResult, isSticky);

	}

	//display the proper highlighting and selection WITHOUT regard to isSticky
	function displaySelection() {
		if ($selectedResult[0]) {
			$inputElement.val($selectedResult[0].textContent); //textContent will break on IE8 and older. Do we care?
			$resultsContainer.children().removeClass(selectedClass);
			$selectedResult.addClass(selectedClass);
		}
		else {
			//preserve cursor position in the case where the value didn't change
			if ($inputElement.val() !== userEnteredValue) {
				$inputElement.val(userEnteredValue);
			}

			$resultsContainer.children().removeClass(selectedClass);
		}
	}

	function clearSelection() {
		if (! isSticky) {
			$selectedResult = $();
			makeSelection($(), false);
			displaySelection();
		}
	}
}
