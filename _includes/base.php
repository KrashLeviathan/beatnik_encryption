<?php
// Load up configuration info for connecting to the database

$this_file = str_replace('beatnik_encryption', '', $_SERVER['DOCUMENT_ROOT']);
$sql_file = $this_file.'beatnik_config.txt';

$json = "";
if (file_exists($sql_file))
{
    // Note: You should probably do some more checks
    // on the filetype, size, etc.
    $contents = file_get_contents($sql_file);

    // Note: You should probably implement some kind
    // of check on filetype
    $json = $contents;
}
if($json == ""){
    echo "No file contents";
}
$json = json_decode($json);

$dbHost = $json->{'host'};
$dbName = $json->{'database'};
$dbUser = $json->{'username'};
$dbPass = $json->{'password'};

$port = $json->{'port'};


// Uncomment this section for your local database.
// #############################################
//$dbHost = 'localhost';
// #############################################
