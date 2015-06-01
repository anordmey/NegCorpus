/*---------------- HELPER FUNCTIONS FOR NEGSEARCH_MTURK.JS ------------------*/

/*Function: getQueryVariable
  Usage: var fienum = getQueryVariable(filenum);
  Params: variable, the query string variable
  Returns: query variable
  Gets variable from query string.  
  From https://css-tricks.com/snippets/javascript/get-url-variables/*/
function getQueryVariable(variable)
{
       var query = window.location.search.substring(1);
       var vars = query.split("&");
       for (var i=0;i<vars.length;i++) {
               var pair = vars[i].split("=");
               if(pair[0] == variable){return pair[1];}
       }
       return(false);
}

/*Function: showSlide
  Usage: showSlide("stage");
  Params: id (div ID from HTML)
  Creates slide-like appearance
*/
function showSlide(id) {
	$(".slide").hide(); //jquery - all elements with class of slide - hide
	$("#" + id).show(); //jquery - element with given id - show
	return;
}

/*Function: getCurrentDate
  Usage: var date = getCurrentDate();
  Params: none
  Returns: string representing date
  Gets date for timestamp*/
getCurrentDate = function() {
	var currentDate = new Date();
	var day = currentDate.getDate();
	var month = currentDate.getMonth() + 1;
	var year = currentDate.getFullYear();
	return (month + "/" + day + "/" + year);
}

/*Function: getCurrentTime
  Usage: var time = getCurrentTime();
  Params: none
  Returns: string representing time
  Gets date for timestamp*/
getCurrentTime = function() {
	var currentTime = new Date();
	var hours = currentTime.getHours();
	var minutes = currentTime.getMinutes();
	if (minutes < 10) minutes = "0" + minutes;
	return (hours + ":" + minutes);
}

/*Function: experimentLoad
  Usage: experimentLoad(filenum);
  Params: filenum, the file number from query variable
  Returns: data_capsule, the data array from the csv on server
  Retrieves data from server
*/
function experimentLoad(filenum) {
	var data_capsule = [];
	$.ajaxSetup({
		async: false
	}); //allows php to execute fully before returning to javascript to update condArray
	var php_url = "https://langcog.stanford.edu/cgi-bin/NPM_negsearch_mturk/negsearch_mturk_filereading.php";
	var php_filename = "?w1=" + filenum; //this first php param will tell it which file to look in
	//var php_filesize = "&w2=" + numCSVRows; //this second php param will tell it how many rows to bring back over
	var total_request = php_url + php_filename;
	$.get(total_request, function(data) {
		data_capsule = data;
	}, "json");
	console.log(data_capsule);  //print data to console for debugging purposes
	return data_capsule;
}

/*Function: createDialogue
  Usage: createDialogue(data)
  Params: data, the multidimensional array containing condition info
  trialnum, the value from the conditions array that has been randomly selected as next
  retrieved from the .csv
  Returns: condArray, the array governing the info for this trial
*/
function createDialogue(data, trialnum) {
	var holder = [];
	holder = data[0][trialnum];
	// console.log("holder is " + holder);
	var dialogue = holder.split(","); //[0][0] gives you the header row
	for (var i = 0; i < dialogue.length; i++) {
		dialogue[i] = dialogue[i].replace(/"/g, "");
		dialogue[i] = dialogue[i].replace(/\r/g, "");
	}
	
	var title = "Please mark the type of negation the child is using... &nbsp; &nbsp; &nbsp; &nbsp; &nbsp;" + trialnum + "/20 trials completed </th>";
	$("#title").html(title);
	$("#before_1").html(dialogue[3]);
	$("#before_2").html(dialogue[4]);
	$("#before_3").html(dialogue[5]);
	$("#before_4").html(dialogue[6]);
	$("#before_5").html(dialogue[7]);
	$("#before_6").html(dialogue[8]);
	$("#before_7").html(dialogue[9]);
	$("#before_8").html(dialogue[10]);
	$("#before_9").html(dialogue[11]);
	$("#before_10").html(dialogue[12]);
	$("#utterance").html("******" + dialogue[13] + "******");
	$("#after_1").html(dialogue[14]);
	$("#after_2").html(dialogue[15]);
	$("#after_3").html(dialogue[16]);
	
	return dialogue;
}

/*Function: submitData
  Usage: submitData()
  Params: none
  Returns: none
  Submits post request to results php script and ends the experiment
*/
function submitData(data, demographics) {
	$("#stage").fadeOut(); //fades out the stage slide
	// console.log("input will be: " + inputfile + " and output will be " + outputfile);
	var submiter = $.post("https://langcog.stanford.edu/cgi-bin/NPM_negsearch_mturk/negsearch_mturk_submit.php", {
		result_file_path: "negsearchData_" + subjectID + "_.csv",
		postresult_array: data,
		// old_path: inputfile,
		// new_path: outputfile
	}); //posts the results to the server using php
	// experiment.end(); //calls the experiment's end function
	$.when(submiter).then(function() {
		turk.submit(demographics, true); //submits demo data to turk
	});
	return;
}
