<?php
/**
 * Created by PhpStorm.
 * User: adm_gcs
 * Date: 11/3/2016
 * Time: 8:46 AM
 */

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
//TODO get this to connect or make a db that is CAN connect to.
$conn = mysqli_connect('127.0.0.1','new_user','new_userpw','beatnik_scores','3006');

$action = $_GET['action'];

if($action != ''){
    switch($action){
        case 'add_words':
            $words = explode(',',$_GET['words']);
            $to_return = array();
            foreach($words as $curr_word){
                $scrabble = scrabble_score($curr_word);
                $this_word = array('word' => $curr_word, 'score' => $scrabble);
                array_push($to_return, $this_word);
                $sql = "SELECT * FROM words WHERE word = '".$curr_word."'";
                $query = mysqli_query($conn,$sql);
                if(mysqli_num_rows($query) == 0){
                    $scrabble = scrabble_score($curr_word);
                    $sql = "INSERT INTO words (word, score) VALUES ('".$curr_word."', ".$scrabble.")";
                    $query = mysqli_query($conn,$sql);
                    if(!$query){
                        $json = array('code' => 404, 'error' => mysqli_error($conn));
                        echo json_encode($json);
                        exit;
                    }
                }
            }
            $json = array('code' => 200, 'words' => $to_return);
            echo json_encode($json);
            exit;
            break;
        case 'get_words':

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