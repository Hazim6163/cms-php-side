<?php
require('../classes/utils.php');

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
