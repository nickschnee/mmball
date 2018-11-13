<?php
/* *******************************************************************************************************
/* data.php regelt die DB-Verbindung und fast den gesammten Datenverkehr der Site.
/* So ist die gesammte Datenorganisation an einem Ort, was den Verwaltungsaufwand erheblich verringert.
/*
/* *******************************************************************************************************/

/* *******************************************************************************************************
/* get_db_connection()
/*
/* liefert als Rückgabewert die Datenbankverbindung
/* hier werden für die gesammte Site die DB-Verbindungsparameter angegeben.
/* 	"SET NAMES 'utf8'"  :	Sorgt dafür, dass alle Zeichen als UTF8 übertragen und gespeichert werden.
/*							http://www.lightseeker.de/wunderwaffe-set-names-set-character-set/
/* *******************************************************************************************************/
function get_db_connection()
{
	$db = mysqli_connect('localhost', 'username', 'password', 'database');
	if (mysqli_connect_error()) {
		die('Verbindungsfehler (' . mysqli_connect_errno() . ') ' . mysqli_connect_error());
	}
	mysqli_query($db, "SET NAMES 'utf8'");
	return $db;
};

function get_result($sql)
{
	$db = get_db_connection();
	// echo $sql ."<br>";
	$result = mysqli_query($db, $sql); // führt die Datenbankabfrage druch
	mysqli_close($db);
	return $result;
}
?>