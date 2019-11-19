<?php
$base = 'http://www.mustafa-dev.website/cms';
$api_base = 'http://ec2-35-158-214-140.eu-central-1.compute.amazonaws.com:3000';
if(!isset($_GET['id'])){
    header('Location: ../index.php');
}
$postId = $_GET['id'];
$url = $api_base . '/posts/id?id=' . $postId;
require('../classes/utils.php');
    $res = Utils::getRequest($url);
    $res = json_decode($res, true);
    echo($res['body']);
?>