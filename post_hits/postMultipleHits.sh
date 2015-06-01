echo "Sandbox or Production site?  
Type 'sandbox' or 'production'"
read sandbox
if [[ $sandbox == "sandbox" ]]
	then
	echo "HITs will be posted to the sandbox"
elif [[ $sandbox == "production" ]]
	then
	echo "Are you SURE you want to post a live HIT?
Type yes if you're sure, type no to switch to sandbox mode"
	read checkSandbox
	if [[ $checkSandbox == "yes" ]]
		then 
		echo "HITs will be posted to production site"
	elif [[ $checkSandbox == "no" ]]
		then 
		sandbox="sandbox"
		echo "HITs will be posted to the sandbox"
	else
		echo "Didn't understand response"
		exit 1
	fi
else
	echo "Error: Didn't understand response"
	exit 1
fi

echo "How many HITs do you want to create?"
read numHITs
if [[ $numHITs =~ ^[0-9]+$ ]]
	then echo "$numHITs HITs will be created"
else
	echo "Error: Response must be integer"
	exit 1
fi

echo "How many assignments per HIT?"
read numAssignments
if [[ $numAssignments =~ ^[0-9]+$ ]]
	then echo "$numAssignments assignments per HIT will be created"
else
	echo "Error: Response must be integer"
	exit 1
fi

cd ./HITs
for i in $(eval echo {1..$numHITs})
do 
	cp -R HIT HIT${i}
	cd ./HIT${i}
	jq --arg filenum "$i" '.url=.url+"?filenum="+$filenum' settings.json > tmp.$$.json && mv tmp.$$.json settings.json
	if [[ $sandbox == "production" ]]
		then
		printf 'yes\n2\nyes\n7days\n' | cosub -p create
	else
		printf 'yes\n2\n7days\n' | cosub create
	fi
	cd -
done