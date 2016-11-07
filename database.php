<?php
/**
 * Created by PhpStorm.
 * User: adm_gcs
 * Date: 11/3/2016
 * Time: 8:46 AM
 */

include "_includes/base.php";

$letters = array(
    'a' => 1,
    'b' => 3,
    'c' => 3,
    'd' => 2,
    'e' => 1,
    'f' => 4,
    'g' => 2,
    'h' => 4,
    'i' => 1,
    'j' => 8,
    'k' => 5,
    'l' => 1,
    'm' => 3,
    'n' => 1,
    'o' => 1,
    'p' => 3,
    'q' => 10,
    'r' => 1,
    's' => 1,
    't' => 1,
    'u' => 1,
    'v' => 4,
    'w' => 4,
    'x' => 8,
    'y' => 4,
    'z' => 10
);

$conn = mysqli_connect($dbHost,$dbUser,$dbPass,$dbName,$port);
//$conn = mysqli_connect('127.0.0.1','new_user','new_userpw','beatnik_scores','3306');


$action = $_GET['action'];

//+r4ztSyR3qkj

if($action != ''){
    switch($action){
        case 'add_words':
            $words = explode(',',$_GET['words']);
            $words_added = 0;
            foreach($words as $curr_word){
                $scrabble = scrabble_score($curr_word);
                $scrabble = scrabble_score($curr_word);
                $sql = "INSERT INTO words (word, score) VALUES ('".$curr_word."', ".$scrabble.")";
                $query = mysqli_query($conn,$sql);
                if($query){
                    $words_added += 1;
                }
            }

            $json = array('code' => 200, 'words_added' => $words_added);
            echo json_encode($json);
            exit;
            break;

        case 'get_words':
            $sql = "SELECT word, score FROM words";
            $query = mysqli_query($conn, $sql);
            $to_return = array();
            while($result = mysqli_fetch_assoc($query)){
                $word = array('word' => $result['word'], 'score' => $result['score']);
                array_push($to_return, $word);
            }

            $json = array('code' => 200, 'words' => $to_return);
            echo json_encode($json);
            exit;
            break;
    }
}



function scrabble_score($word){
    $score = 0;
    global $letters;
    $word = str_split(strtolower($word));
    foreach($word as $letter){
        $score += $letters[$letter];
    }
    return $score;
}