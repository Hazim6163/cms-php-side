<?php 
$errorCodes = array(
    600 => 
    'server error: can not fetch the root categories array from the server',
    601 =>
    'server error: can\'t get the last posts data from the server',

);

//check if there is an error: 
session_start();
if(isset($_SESSION['errorCode'])){
    //get the error code from the session:
    $errorCode = $_SESSION['errorCode'];
    unset($_SESSION['errorCode']);
    include('./include/header.php');
    echo('
        <h1>Error</h1>
        <p>' . $errorCodes[$errorCode] . '</p>
    ');
}

?>
