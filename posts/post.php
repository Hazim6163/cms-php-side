<?php
if(!isset($_GET['id'])){
    header('Location: ../index.php');
}
$postId = $_GET['id'];
$url = 'http://localhost:3000/posts/id?id=' . $postId;
require('../classes/utils.php');
    $res = Utils::getRequest($url);
    $res = json_decode($res, true);
    echo($res['body']);
?>