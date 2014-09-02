<?php
# brett.schellenberg@gmail.com
# JSON service that performs a row by row search on a given csv file and returns the appropriate matching rows.
#  - search string is passed via the "query" get variable
#  - we search on both columns of the csv: front-anchored and ignoring case and punctuation
#  - we return a maximum of $maxResults results, in the same order as in the csv
#
# given this csv:
# restaurant_name,cuisine_type
# Spicy City,Chinese
# Tajima,Ramen
# Super Sergio's,Tacos
# Korea House,Korean
#
# query "ta" would respond with this json:
# [{"name":"Tajima","cuisine":"Ramen"},{"name":"Super Sergio's","cuisine":"Tacos"}]

#simulate some network traffic for testing
#sleep a random amount of time between 0 and 2 second
#sleep(2* mt_rand(0, mt_getrandmax()) / mt_getrandmax());

$maxResults = 5;
$csvFile = "../db.csv";

$query = $_GET["query"];

#normalize search term
$query = normalize($query);

# empty search requests get empty results
if (!$query) {
	print json_encode("");
	return;
}
$results = [];

if (($handle = fopen($csvFile, "r")) !== FALSE) {
	while (($data = fgetcsv($handle, 0, ",")) !== FALSE) {
		#skip header row
		if ($data[0] === "restaurant_name") {
			continue;
		}

		#normalize this row
		$normalizedName = normalize($data[0]);
		$normalizedCuisine = normalize($data[1]);

		#if this row is a match, add it to $results
		if (preg_match("/^$query/i", $normalizedName) || preg_match("/^$query/i", $normalizedCuisine)) {
			array_push($results, [ "name" => $data[0], "cuisine" => $data[1] ]);
		}
	}
	fclose($handle);
}
else {
	#error opening file, fail silently and return empty result set
	print json_encode("");
	return;
}

$truncatedResults = array_slice($results, 0, $maxResults);
print json_encode($truncatedResults);

# HELPERS
function normalize($text) {
	#strip everything but letters, numbers, and spaces
	return preg_replace('/[^a-z0-9 ]+/i', '', $text);
}


?>
