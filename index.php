<?php

$title = 'Home';
$custom_head = '
<link rel="stylesheet" href="./assets/css/index.css">

<script src="https://kit.fontawesome.com/9b9c3e7d62.js" crossorigin="anonymous"></script>
';

session_start();
echo '<div class="pageWrapper" id="pageWrapper">';
include('./include/header.php');
include('./include/navbar.php');
?>

<!-- main container-->
<div class="container">
    <div class="searchBar">
        <?php include('./include/home/search.php') ?>
    </div>
    <div class="categories">
        <?php include('./include/home/categories.php'); ?>
    </div>
    <div class="lastPosts">
        <div class="lastPostsTitle">
            Last Posts:
        </div>
        <?php include('./include/home/posts.php'); ?>
    </div>
</div><!--container-->
</div><!--page wrapper-->
<script src="./assets/js/home.js"></script>
<?php 
include('./include/footer.php');
?>