<?php
$base = 'http://www.mustafa-dev.website/cms';
$api_base = 'http://ec2-35-158-214-140.eu-central-1.compute.amazonaws.com:3000';
require('../classes/utils.php');
$code = 100 ;

//delete post request:
if(isset($_POST['deletePost'])){
    session_start();
    $headers = array(
        'Authorization: ' . $_SESSION['token']
    );
    $postData = array(
        'requestFrom' => $_POST['extra']['requestFrom'],
        'authorId' => $_POST['extra']['id']
    );
    $url = $api_base . '/posts/?id=' . $_POST['id'];
    $res = Utils::deleteRequestPost($url, $headers, $postData);
    echo $res;
    return;
}

//toggle post like request:
if(isset($_POST['postLike'])){
    session_start();
    $headers = array(
        'Authorization: ' . $_SESSION['token']
    );
    $postData = array(
        'code' => $code,
        'postId' => $_POST['id']
    );
    $url = $api_base . '/posts/like';
    $res = Utils::postRequest($url, $postData, $headers);
    echo $res;
    return;
}

//add post comment: 
if(isset($_POST['postComment'])){
    session_start();
    $postId = $_POST['postId'];
    $commentBody = $_POST['body'];
    $url = $api_base . '/posts/comment';
    $postData = array(
        'postId' =>  $postId,
        'body' => $commentBody
    );
    $requestHeaders = array(
        'Authorization: '.$_SESSION['token']
    );
    $res = Utils::postRequest($url, $postData, $requestHeaders);
    
    echo($res);
    return;
}

//toggle comment like:
if(isset($_POST['commentLike'])){
    session_start();
    $url = $api_base . '/posts/comment/like';
    $postData = array(
        'postId' =>  $_POST['postId'],
        'commentId' =>  $_POST['id']
    );
    $requestHeaders = array(
        'Authorization: '.$_SESSION['token']
    );
    $res = Utils::toggleLike($url, $postData, $requestHeaders);
    echo($res);
    return;
}

//add replay:
if(isset($_POST['addReplay'])){
    session_start();
    $postId = $_POST['post'];
    $commentId = $_POST['comment'];
    $body = $_POST['body'];
    $url = $api_base . '/posts/replay';
    $postData = array(
        'postId' =>  $postId,
        'body' => $body,
        'commentId' => $commentId
    );
    $requestHeaders = array(
        'Authorization: '.$_SESSION['token']
    );
    $res = Utils::postRequest($url, $postData, $requestHeaders);
    
    echo($res);
    return;
}

//replay like toggle:
if(isset($_POST['replayLike'])){
    session_start();
    $url = $api_base . '/posts/replay/like';
    $postData = array(
        'postId' =>  $_POST['post'],
        'commentId' =>  $_POST['comment'],
        'replayId' =>  $_POST['replay']
    );
    $requestHeaders = array(
        'Authorization: '.$_SESSION['token']
    );
    $res = Utils::toggleLike($url, $postData, $requestHeaders);
    echo($res);
    return;
}

$reqUserId = false;
//check if there is a user id: 
if(isset($_GET['id'])){
    $reqUserId = $_GET['id'];
}

//js requests:
if(isset($_POST['getData'])){
    $data = false;
    if($reqUserId){
        $data = getSpUser($reqUserId);
    }else{
        $data = getAcUser();
    }
    echo $data;
    return;
}

//functions:

//get posts other user
function getSpUser($id){
    session_start();
    $res = Utils::getPostsByUserId($id);
    return $res;
}

//get actual user posts 
function getAcUser(){
    session_start();
    $id = $_SESSION['userInfo']->id;
    $res = Utils::getPostsByUserId($id);
    return $res;
}



$custom_headers = '
<link href="https://fonts.googleapis.com/css?family=Rosarivo&display=swap" rel="stylesheet">
<link rel="stylesheet" href="../assets/css/croppie.css" type="text/css">
<link rel="stylesheet" href="../assets/css/user/profile.css">
';


include('../include/v2/head.php');
include('../include/v2/nav.php');
?>

<div class="pageWrapper" id="pageWrapper">
    <div class="sideNavigate" id="sideNavigate"></div>
    <div class="pageContainer" id="pageContainer"></div>
</div>

<script src="../assets/js/user/profile.js"></script>
<?php include('../include/v2/footer.php'); ?>
