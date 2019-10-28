<?php
require('../classes/utils.php');

//logged in status:
global $loggedIn;

$custom_headers = '
<link rel="stylesheet" href="../assets/css/user/index.css">
';


include('../include/v2/head.php');
include('../include/v2/nav.php');
if(!$loggedIn){
    header('Location: ./../index.php');
}
?>

<div class="pageWrapper" id="pageWrapper">
    <div class="sideNavigate" id="sideNavigate"></div>
    <div class="pageContainer" id="pageContainer"></div>
</div>

<script src="../assets/js/user/index.js"></script>
<?php include('../include/v2/footer.php'); ?>
