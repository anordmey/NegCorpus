//Title: Negsearch MTurk Study
//Authors: Nick Moores & Ann Nordmeyer

/*---------------INTRODUCTION-------------------*/
/* Experiment Notes!
See https://langcog.stanford.edu/expts/NPM/negsearch_mturk/negsearch_mturk.html for the actual experiment.
Raw data resides in cgi-bin/NPM_negsearch_mturk.
Every time the study is completed, a csv file is created with the data for that participant.
*/

/*---------------- PARAMETERS ----------------*/

var numTrials = 20; //governs the number of trials in the experiment
var subjectID = turk.workerId; //requires mmTurkey library
var pauseTime = 500; 
var expData = [];

/****************MAIN EXPERIMENT FUNCTION**********************/

showSlide("welcome"); //shows the instructions slide 
var filenum = getQueryVariable("filenum"); //Gets file number from query string

//Button is disabled if turk is in preview mode
//Button is also disabled if experiment is not done loading
$("#pleaseWait").html("Please wait while the experiment loads...");
$("#startButton").attr("disabled", true);
var data = "wait"; //keep button disabled when data = "wait". 

//if turk is in preview mode, don't load the data
// once turker has accepted HIT, experimentLoad() is run
//Once data is loaded, data contains csv data and the button is disabled
 if (turk.previewMode != true) {
	data = experimentLoad(filenum);
 }

if (data != "wait") { //Once data is loaded, enable button
	$("#startButton").attr("disabled", false);
	$("#pleaseWait").html("");
}

var experiment = { //var containing the experiment, everything is called from within it

	gender: [],
	age: "",
	nativeLanguage: "",
	comments: "",

	/*  Function: training
		Usage: experiment.training()
		Params: data, the csv trial data from the server
		Returns: none
		Calls experiment.next()
	*/
	training: function(data) { 

		$("#loading").fadeOut("fast");
		showSlide("instructions1");

		$('#nextInstructions1').on('click', function(event) {
			showSlide("instructions2");
		});

		$('#nextInstructions2').on('click', function(event) {
			showSlide("training1");
			$("#radioPractice1").buttonset();
		});
		$('#nextTraining1').on('click', function(event) {
			var decision = $('input[name=radioPractice1]:checked', '#radioPractice1').val();
			if (decision == "Directive") {
				alert("That's the correct answer! In this sentence, the child is refusing to do what the mother wants.");
				showSlide("training2");
				$("#radioPractice2").buttonset();
			} else {
				alert("That was actually Type 2 (e.g. refusal). The child is refusing to do what the mother wants. Please select 'Type 2'.");
			}
		});
		$('#nextTraining2').on('click', function(event) {
			var decision = $('input[name=radioPractice2]:checked', '#radioPractice2').val()
			if (decision == "Statement") {
				alert("That's the correct answer! In this sentence, the child is making a statement that the story the mom wants is not good.");
				experiment.next(data);
			} else {
				alert("That was actually Type 1. The child is making a statement that the story the mom wants is not good. Please select 'Type 1'.");
			}
		});
	}, 

	/*Function: next
	  Usage: experiment.next(data)
	  Params: data, the csv trial data from the server
	  Returns none
	  Called when need to get a new trial
	  */
	next: function(data) { //Main display function
		var i = 0; //trial counter
		console.log("trial is " + i);

		var dialogue = createDialogue(data, i); //fill the table with lines of dialogue

		$("#training2").fadeOut("slow");
		$("#ready").fadeIn("fast");
		setTimeout(function() {
			$("#ready").fadeOut("fast");
			$("#stage").fadeIn("fast");
			$("#radioNext").buttonset();
		}, pauseTime * 4); 

		var trialData = []; //initializes result_string variable that will hold the result of each trial

		$('#next').on('click', function(event) {
			$('#next').attr("disabled", true);
			var decision = $('input[name=radioNext]:checked', '#radioNext').val();
			if (decision == undefined) { //user didn't pick anything!
				alert("What type of negation is this child using? Please make a selection!");
			} else { //if the user picked something
				var tag = decision;
				console.log("tag is " + tag);
				dialogue[0] = dialogue[0].replace(/\r/g, ""); //remove hard returns
				dialogue[0] = dialogue[0].replace(/\n/g, ""); //remove new lines
				trialData[0] = dialogue[0]; //line number
				trialData[1] = subjectID; //subject ID
				trialData[2] = dialogue[1]; //.cha file that utterance comes from
				trialData[3] = dialogue[2]; //child's age
				trialData[4] = dialogue[12]; //immediately preceding utterance 
				trialData[5] = dialogue[13]; //utterance that was coded
				trialData[6] = tag; // turker's response
				trialData[7] = getCurrentDate(); 
				trialData[8] = getCurrentTime();
				expData[i] = trialData; //adds this trials results to the overall result array
				i++; //increments the counter (only way the experiment advances, when they click next)
				trialData = []; //resets the trial array holder
			
				if (i === numTrials) { //checks for experiment completion
					setTimeout(function() {
						experiment.background(); //move to background questions
					}, pauseTime);
				} else { //If experiment is not complete, new trial
					$("#stage").fadeOut("slow");
					setTimeout(function() {
						$('#next').attr("disabled", false);
						dialogue = createDialogue(data, i);
						$('#radioNext input').removeAttr('checked');
						$("#radioNext").buttonset('refresh');
						$("#stage").fadeIn("slow");
						console.log("trial is " + i);
					}, pauseTime);
				}
			}
		}); 
	}, 

	/*Function: background
	  Usage: experiment.background()
	  Params: none
	  Returns: none
	  called when all trials are complete */
	background: function() {

		$("#gender").trigger("reset");
		$("#age").trigger("reset");
		$("#language").trigger("reset");
		$("#commentQ").trigger("reset");
		showSlide("askInfo");

		$("#endButton").one('click', function(event) {
			var gen = $("input:radio[name=genderButton]:checked").val();
			var ag = $("#ageRange").val();
			var lan = $("#nativeLanguage").val();
			var comm = $("#commentQ").val();

			if (gen == "" | ag == "" | lan == "") {
				alert("Please answer all of the questions");
			} else {

				experiment.gender = gen;
				experiment.age = ag;
				experiment.nativeLanguage = lan;
				experiment.comments = comm;

				experiment.end();
			}
		})
	},

	/*Function: end
	  Usage: experiment.end()
	  Params: none
	  Returns: none
	  called when background info has been submitted*/
	end: function() { //governs how the experiment will end
		showSlide("finish"); //shows the 'finish' slide from the html file
		console.log(expData);
		submitData(expData, experiment);
	}, 
}