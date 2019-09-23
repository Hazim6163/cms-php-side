<?php

// check if the token is available :
session_start();
if(!isset($_SESSION['token'])){
    header('Location: ../login.php');
}

//check if the user already confirmed the account: 
if($_SESSION['verified'] == 1){ //TODO: set the verified to 1 after login and after conformation
    header('Location: ../index.php');
}

//the user need to confirm the account :

//extract the data from the session:
$token = $_SESSION['token'];

$postFields = array(
    'token' => $token
);

if(isset($_POST['submit'])){

    //get the vKey from the user: 
        $uVKey = $_POST['vKey'];

    //send the post request to the server ->
        $url = 'localhost:3000/users/getVKey';
        $options = array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POST => 1,
            CURLOPT_POSTFIELDS => $postFields
        );
        $ch = curl_init($url);
        curl_setopt_array($ch, $options);

        $result = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);

        $responseCode = $info['http_code'];
        $result = json_decode($result);

    if($responseCode != 200){
        //echo('there is an error');
    }

    //catch the vKey and Email from the server 
    //$vKey = $result->vKey;
    //$email = $result->email;
    //$fname = $result->fname;
    $vKey = 123456;

    //compare the vKeys:
    if($vKey == $uVKey){
        //conformation successfully: 
            $_SESSION['verified'] = 1 ;
            header('Location: ../index.php');
    }else {
        //confirmation failed:
            $_SESSION['error'] = 'Wrong confirmation Code';
    }
}


include('../include/header.php');
include('../include/navbar.php');
?>

<!-- create confirmation form -->
