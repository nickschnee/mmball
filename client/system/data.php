<?php
// PLEASE DO NOT EDIT / UPDATE THIS FILE ON YOUR OWN.
// PLEASE CONTACT OUR DATA TEAM INSTEAD

// "FINGER WECH SONST LOCH IM KOPP!" - W.BOCK, 2018

include "config.inc.php";
// To connect please add your connection details in config.inc.php or start working on the master server.
// config.inc.php contains your connection details

// connect to db
function get_db_connection()
{
	$db = mysqli_connect(DB_HOST, DB_USER, DB_PASSWORD, DB_NAME);
	if (mysqli_connect_error()) {
		die('Verbindungsfehler (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());
	}
	mysqli_query($db, "SET NAMES 'utf8'");
	return $db;
};

// get result from db
// every function must call this function to work
function get_result($sql)
{
	// remove html tags from input
	$sql = strip_tags ($sql);
	$db = get_db_connection();
	$result = mysqli_query($db, $sql);
	mysqli_close($db);
	return $result;
}

// START USER
// START USER
// START USER
// START USER

// Assign UserID to new one time user from userIdentifier (hash)
function new_oneTimeUser($userIdentifier)
{
	$userRole = 100;
	// actually create the new user
	$sql = "INSERT INTO user (userRole, userIdentifier) VALUES ( '$userRole','$userIdentifier');";

	$db = get_db_connection();
	$result = mysqli_query($db, $sql);

	if ($result){
		// get the last entered userID from database (from the user who was just created)
		$last_id = mysqli_insert_id($db);
		mysqli_close($db);
		// return that ID
		return $last_id;

	} else {
		mysqli_close($db);
		// if something goes wrong return false
		return false;
	}
};

// Register new logged in user
// This function is obsolete as there are no registered users.
function new_user($userPassword, $userEmail, $userFirstname, $userLastname)
{
	$userRole = 200;
	$sql = "INSERT INTO user (userPassword, userEmail, userRole, userFirstname, userLastname) VALUES ('$userPassword', '$userEmail', '$userRole', '$userFirstname', '$userLastname');";
	return get_result($sql);
};

// Register a Moderator
// Moderators can create and edit workshops.
function new_moderator($userPassword, $userEmail, $userFirstname, $userLastname)
{
	$userRole = 300;
	$sql = "INSERT INTO user (userPassword, userEmail, userRole, userFirstname, userLastname) VALUES ('$userPassword', '$userEmail', '$userRole', '$userFirstname', '$userLastname');";
	return get_result($sql);
};

// Get a specific user
function get_user($userID)
{
	$sql = "SELECT * FROM user WHERE userID = $userID;";
	return get_result($sql);
};

// END USER
// END USER
// END USER
// END USER

// LOGIN
// LOGIN
// LOGIN
// LOGIN

// Login Moderator using Email and Password.
function login($userEmail, $userPassword){
	$sql = "SELECT * FROM user WHERE userEmail = '$userEmail'  AND userPassword = '$userPassword' limit 1;";
	return get_result($sql);
}

// END LOGIN
// END LOGIN
// END LOGIN
// END LOGIN

// START WORKSHOP
// START WORKSHOP
// START WORKSHOP
// START WORKSHOP

// Create a new workshop for a specific user
// Get back the Workshop ID of the Workshop you just created.
// Use only this function to create workshops!
function create_workshop($wsName, $wsDescription, $wsWelcome, $wsPhase1, $wsPhase2, $wsPhase3, $userID){
	$wsID = new_workshop($wsName, $wsDescription, $wsWelcome, $wsPhase1, $wsPhase2, $wsPhase3);

	if ($wsID) {
		//echo "new_workshopforuser wird aufgerufen";
		// if you got the wsID from new_workshop function create a new_workshopforuser in workshopUser table
		$result = new_workshopforuser($wsID, $userID);

		if ($result) {
			// Return the wsID of the workshop just created.
			return $wsID;
		} else {
			// Theoretisch müsse man hier den Workshop wieder aus der Tabelle löschen, weils sonst tote Workshops gibt.
			return false;
		}

	} else {
		//echo "Workshop konnte nicht gespeichert werden.";
		return false;
	}
}

// this function is called by create_workshop!
// do not call this function as the workshop will then not have a user_id assigned
function new_workshop($wsName, $wsDescription, $wsWelcome, $wsPhase1, $wsPhase2, $wsPhase3)
{
	// actually create a new workshop
	$sql = "INSERT INTO workshop (wsName, wsDescription, wsWelcome, wsPhase1, wsPhase2, wsPhase3)
	VALUES ('$wsName', '$wsDescription', '$wsWelcome', '$wsPhase1', '$wsPhase2', '$wsPhase3');";

	$db = get_db_connection();
	$result = mysqli_query($db, $sql);

	if ($result){
		// get the last entered wsID from database (from the workshop you just created)
		$last_id = mysqli_insert_id($db);
		mysqli_close($db);
		// return that ID to create_workshop function
		return $last_id;

	} else {
		mysqli_close($db);
		// if something goes wrong return false
		return false;
	}

};

// save wsID and userID in realtion table
// this function is called by create_workshop !!
// do not call this function as there will be no workshop created.
function new_workshopforuser($wsID, $userID){
	// Create connection between workshop and user
	$sql = "INSERT INTO workshopUser (wsID, userID)
	VALUES ($wsID, $userID);";

	return get_result($sql);
}

// Get Workshop by userID
function get_workshop_by_userID($userID){
	$sql = "SELECT workshop.* FROM workshop
	INNER JOIN workshopUser ON workshop.wsID = workshopUser.wsID
	AND workshopUser.userID = '$userID'";
	return get_result($sql);
}

// Get wsID by wsName and wsDescription
function get_wsID_by_wsName_wsDescription($wsName,$wsDescription) {
	$sql = "SELECT wsID FROM workshop WHERE wsName = '$wsName' AND wsDescription = '$wsDescription'";
	return get_result($sql);
}

// Set Workshop status to 1 - inspiration
function status_live_phase1($wsID) {
	$sql = "UPDATE workshop SET wsPhase1 = 1 WHERE wsID = $wsID;";
	return get_result($sql);
}

// Set Workshop status to 2 - compression
function status_live_phase2($wsID) {
	$sql = "UPDATE workshop SET wsPhase2 = 1 WHERE wsID = $wsID;";
	return get_result($sql);
}

// Set Workshop status to 3 - rating
function status_live_phase3($wsID) {
	$sql = "UPDATE workshop SET wsPhase3 = 1 WHERE wsID = $wsID;";
	return get_result($sql);
}

// Get all questions for a specific workshop by wsID only for phase 1.
function get_questions_for_ws_phase1($wsID)
{
	$sql = "SELECT * FROM question WHERE wsID = $wsID AND NOT typeID = 6 AND NOT typeID = 7;";
	return get_result($sql);
};

function get_workshop_by_wsID($wsID){
	$sql = "SELECT * FROM workshop WHERE wsID = '$wsID'";
	return get_result($sql);
}


// END WORKSHOP
// END WORKSHOP
// END WORKSHOP
// END WORKSHOP

// START question
// START question
// START question
// START question

// Create a new question for a specific workshop.
function new_question($questionText, $questionDuration, $questionMaxAnswer, $questionOrder, $questionSkippable, $typeID, $wsID)
{
	$sql = "INSERT INTO question (questionText, questionDuration, questionMaxAnswer, questionOrder, questionSkippable, typeID, wsID) VALUES ('$questionText', '$questionDuration', '$questionMaxAnswer', '$questionOrder', '$questionSkippable', '$typeID', '$wsID');";

	$db = get_db_connection();
	$result = mysqli_query($db, $sql);

	if ($result){
		// get the last entered questionID from database (from the question you just created)
		$last_id = mysqli_insert_id($db);
		mysqli_close($db);
		// return that ID to new_question function
		return $last_id;

	} else {
		mysqli_close($db);
		// if something goes wrong return false
		return false;
	}

};

// Get all questions for a specific workshop.
function get_questions_for_workshop($wsID)
{
	$sql = "SELECT * FROM question WHERE wsID = $wsID;";
	return get_result($sql);
};

// Get specific question from workshop with questionOrder
function next_question($questionOrder, $wsID)
{
	$sql = "SELECT * FROM question WHERE questionOrder=$questionOrder AND wsID=$wsID;";
	return get_result($sql);

}

// Get a specific question by question ID
function get_question($questionID)
{
	$sql = "SELECT * FROM question WHERE questionID = $questionID;";

	return get_result($sql);
};

// Get only the questionText column by questionID
// This could also be done in php using our get_question function.
function get_question_text($questionID){
	$result = get_question($questionID);
	$result = mysqli_fetch_assoc($result);
	echo $result['questionText'];
}

// Get the amount of questions that have so far been created for a specific workshop
function get_amount_of_questions($wsID)
{
	$sql = "SELECT MAX(questionOrder) FROM question WHERE wsID = $wsID;";
	return get_result($sql);
};

//Get all infos for question of Phase 2 - Compression
function get_infos_for_compression($wsID) {

	$sql = "SELECT * FROM question WHERE typeID = 6 AND wsID = '$wsID';";

	return get_result($sql);

};

/**
* @param $workshop_id              current workshop
* @param $completed_question_id    completed question
* @return Array/bool               next question if available | false if workshop is over
*/
function getNextQuestion($workshop_id, $completed_question_id){
	$sql = "SELECT * FROM `question` t1 "
	."INNER JOIN type t2 ON t1.typeID=t2.typeID "
	."WHERE t1.`wsID`=$workshop_id AND t1.questionOrder>"
	."(SELECT questionOrder FROM question WHERE wsID=$workshop_id AND questionID=$completed_question_id)"
	." ORDER BY t1.questionOrder";
	$result = get_result($sql);
	if($result->field_count > 0){
		return mysqli_fetch_assoc($result);
	}else{
		return false;
	}
}

//edit a question
function update_question($questionID, $questionText, $questionDuration, $questionMaxAnswer, $questionOrder, $questionSkippable, $typeID)
{
	$sql = "UPDATE question SET questionText = '$questionText', questionDuration = '$questionDuration', questionMaxAnswer = $questionMaxAnswer, questionOrder = 'questionOrder', questionSkippable = $questionSkippable, typeID = $typeID
	WHERE questionID ='$questionID';";

	return get_result($sql);
};


// END question
// END question
// END question
// END question

// START ANSWER
// START ANSWER
// START ANSWER
// START ANSWER

// Create a new answer
function new_answer($answer, $parentAnswer, $parentAnswerTwo, $wsID, $questionID, $userID)
{
	$sql = "INSERT INTO answer (answer, parentAnswer, parentAnswerTwo, wsID, questionID, userID)
	VALUES ('$answer', $parentAnswer, $parentAnswerTwo, $wsID, $questionID, $userID);";
	return get_result($sql);
};

//Get answer by questionID and userID
function get_answers($questionID, $userID){
	$sql = "SELECT * FROM answer WHERE questionID=$questionID AND userID=$userID;";
	return get_result($sql);
}

// Get only the answer column from all answers to a question and user.
function get_answers_text($questionID, $userID){
	$result = get_answers($questionID, $userID);
	while($answer = mysqli_fetch_assoc($result)){
		echo '<input class="crazy textboxes" disabled readonly value="'.$answer['answer'].'"></input>';
	}
}

// END ANSWER
// END ANSWER
// END ANSWER
// END ANSWER

// START RATING
// START RATING
// START RATING
// START RATING

// Create a new rating
function new_rating($rating, $ideaID, $userID)
{
	$sql = "INSERT INTO rating (ratingID, rating, ideaID, userID) VALUES ('$rating', '$ideaID', '$userID');";

	return get_result($sql);
};

// END RATING
// END RATING
// END RATING
// END RATING

// START idea
// START idea
// START idea
// START idea

// Create a new idea
function new_idea($ideaTitle, $ideaDescription, $wsID)
{
	$sql = "INSERT INTO idea (ideaID, ideaTitle, ideaDescription, wsID) VALUES ('$ideaTitle', '$ideaDescription', '$wsID');";

	return get_result($sql);
};

// Get ID from wsID
function get_idea_from_wsID($wsID) {
	$sql = "SELECT * FROM idea WHERE wsID = $wsID;";
	return get_result($sql);
}

// Get Ratings
function amount_same_rating_same_idea($numRating, $ideaID) {

	$sql = "SELECT `rating`, COUNT(*) AS `count`
	FROM rating
	WHERE `rating`= $numRating AND ideaID = $ideaID;";
	return get_result($sql);
}

// END idea
// END idea
// END idea
// END idea

// START IMAGE
// START IMAGE
// START IMAGE
// START IMAGE

// Upload new image
function new_image($imgURL, $imgAlttext, $questionID){
	$sql = "INSERT INTO images (imgURL, imgAlttext, questionID) VALUES ('$imgURL', '$imgAlttext', '$questionID');";

	return get_result($sql);
};

// Get specific image
function get_image($imgID){
	$sql = "SELECT * FROM images WHERE imgID = $imgID;";

	return get_result($sql);
};

//edit image-entry:
function update_image($imgURL, $imgAlttext, $questionID){
	$sql = "UPDATE images SET imgURL = '$imgURL', imgAlttext = '$imgAlttext', questionID = '$questionID'
	WHERE questionID='$questionID';";

	return get_result($sql);
};

//Get image for a specific question-id
function get_image_by_questionID($imgID){
	$sql = "SELECT * FROM images WHERE questionID = $imgID;";

	return get_result($sql);
};

// END IMAGE
// END IMAGE
// END IMAGE
// END IMAGE

/*function delete()
{
$sql = "DELETE FROM workshop;";

return get_result($sql);
}; */
