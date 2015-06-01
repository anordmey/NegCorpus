<?php 
	header('Access-Control-Allow-Origin: https://langcog.stanford.edu');
	$fileNum = $_GET["w1"]; //gets the dynamically created part of the url specifying which list number selected
	$thisFile = glob("turkerTrials/" . "*.csv")[$fileNum]; //grabs the csv specified by filenum
	$csvData = file_get_contents($thisFile); //gets csvData from that file
	$data = array_chunk(str_getcsv($csvData, "\r"), 20);
	echo json_encode($data); //outputs the php var as a javascript var in json format!
?>