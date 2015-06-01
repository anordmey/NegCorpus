##NegCorpus
Negation corpus analysis

Created in collaboration with Michael Frank and Nicholas Moores.

**Under development**

Creates and posts external HITs on Amazon's Mechanical Turk.  Each HIT gives turkers 20 utterances in context to code.  Each HIT presents a new set of utterances; turkers can complete multiple HITs but each set of utterances is coded by two unique turkers.

###experiment
Experiment files for external HIT.  The experiment can be viewed at https://langcog.stanford.edu/expts/NPM/negsearch_mturk/negsearch_mturk.html?filenum=1.  

Each HIT presents data from a different .csv file that lives on the server.  The query string creates a variable, filenum, that indexes which file to get data from.  Each .csv file contains a list of 20 utterances in context; see data_tocode/negcorpus_example.csv for an example of one of these files.  

negsearch_mturk_filereading.php pulls the data to code from a .csv file that lives on the server.  
negsearch_mturk_submit.php submits coded data back to server. 


###post_hits
postMultipleHITs.sh allows you to post multiple external HITs in a batch so that turkers can code multiple sets of utterances (i.e. multiple HITs) without coding the same set of utterances twice. You will need to download [jq](http://stedolan.github.io/jq/) and Long Ouyang's [cosub](https://github.com/longouyang/cosub) to run this script.

You must have a subdirectory HITs/HIT which contains the auth.json and settings.json with the parameters you want for each HIT.  The script duplicates the HIT directory, alters the URL line in settings.json (to add the query string variable "filenum"), and then posts the resulting HIT on Mechanical Turk.

When you run postMultipleHITs.sh, you will be prompted for some information (Do you want to post on the sandbox or production site?  How many HITs do you want/how many assignments per HIT?).  Other information is hard-coded in as default (e.g. Collect data for 7 days).  The script does NOT stop and ask you to verify the information as each HIT is posted, so double check everything and pilot on the sandbox before you post a live HIT!




