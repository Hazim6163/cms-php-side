<?php

/****************** editor requests **********/
//save post:
if(isset($_POST['savePost'])){
    session_start();
    $url = 'http://localhost:3000/posts/add';
    $postData = array(
        'title' => $_POST['title'],
        'des' => $_POST['des'],
        'des' => $_POST['des'],
        'body' => $_POST['body'],
        'body' => $_POST['body'],
        'parentId' => $_POST['category'],
        'showInActivity' => $_POST['showInActivity'],
    );
    $requestHeaders = array(
        'Authorization: '.$_SESSION['token']
    );
    require('../classes/utils.php');
    $res = Utils::postRequest($url, $postData, $requestHeaders);
    
    echo($res);
    return;
}

session_start();

//check if the user logged in 
if(!isset($_SESSION['token'])){
    header('Location: ../index.php');
}

$title = 'Add Post';
$custom_headers = '
<link href="https://fonts.googleapis.com/css?family=Source+Code+Pro&display=swap" rel="stylesheet"> 
<link rel="stylesheet" href="../assets/css/posts/addPost.css">
<script src="../assets/js/posts/addPost.js"></script>
';

include('../include/v2/head.php');
include('../include/v2/nav.php');
?>

<div class="pageWrapper" id="pageWrapper">
    <div class="sideNavigate" id="sideNavigate"></div>
    <div class="pageContainer" id="pageContainer"></div>
</div>

<?php 
include('../include/v2/footer.php');
?>