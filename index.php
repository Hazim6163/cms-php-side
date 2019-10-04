<?php
require ('./Classes/Category.php');
require ('./Classes/Post.php');

$costume_head = '
<link rel="stylesheet" href="./assets/css/index.css">
';

//array we need in home page 
$rootCategories = Category::getRootCategories();
$lastPosts = Post::getLastPosts();

session_start();
include('./include/header.php');
include('./include/navbar.php');
//include('/include/home/title');

/**categories access: */
if(!$rootCategories['error']){
    $rootCategories = $rootCategories['result'];
}else{
    session_start();
    $_SESSION['errorCode'] = 600;
    header('Location: ./error.php');
}

echo('
    <h1>Categories</h1><br>
');
foreach ($rootCategories as $category) {
    /**echo('
        title: '.$category['title'].' <br>
        des: '.$category['des'].' <br>
        created: '.$category['createdAt'].' <br>
    ');*/

}

/**last post array */
if (!$lastPosts['error']) {
    $lastPosts = $lastPosts['result'];
}else{
    session_start();
    $_SESSION['errorCode'] = 601;
    session_write_close();
    header('Location: ./error.php');
}
echo('<br><br><h1>Last posts: </h1><br>');
foreach ($lastPosts as $post) {
   /** 
    * echo('
    *    title: '.$post['title'].'<br>
    *    des: '.$post['des'].'<br>
    *    body: '.$post['body'].'
    *    <br><br>');  
    */ 
}
?>


<?php 
include('./include/footer.php');
?>