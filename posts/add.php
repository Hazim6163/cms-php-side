<?php

/****************** editor requests **********/
//save post:
if(isset($_POST['savePost'])){
    session_start();
    $url = 'http://localhost:3000/posts/add';
    $postData = array(
        'title' => $_POST['title'],
        'des' => $_POST['des'],
        'body' => $_POST['body'],
        'tags' => $_POST['tags'],
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

//get categories:
if(isset($_POST['getCategories'])){
    $url = 'http://localhost:3000/categories';
    require('../classes/utils.php');
    $res = Utils::getRequest($url);
    
    echo($res);
    return;
}

//get tags: 
if(isset($_POST['getTags'])){
    $url = 'http://localhost:3000/tags';
    require('../classes/utils.php');
    $res = Utils::getRequest($url);
    
    echo($res);
    return;
}

//search tag:
if(isset($_POST['searchTag'])){
    $chars = $_POST['word'];
    $url = 'http://localhost:3000/search/tags?chars=' . $chars;
    require('../classes/utils.php');
    $res = Utils::getRequest($url);
    
    echo($res);
    return;  
}

//submit tag:
if(isset($_POST['tagSubmit'])){
    session_start();
    $url = 'http://localhost:3000/tags/';
    $postData = array(
        'name' => $_POST['name']
    );
    $requestHeaders = array(
        'Authorization: '.$_SESSION['token']
    );
    require('../classes/utils.php');
    $res = Utils::postRequest($url, $postData, $requestHeaders);
    echo($res);
    return;
}

//save post copy :
if(isset($_POST['savePostCopy'])){
    session_start();
    $post = array(
        'title'=> $_POST['title'],
        'body'=> $_POST['body'],
        'des'=> $_POST['des'],

    );

    //save post to session:
    $_SESSION['postCopy'] = $post;

    $res = json_encode($post);
    echo $res;
    return;
}

//get post copy: 
if(isset($_POST['getPostCopy'])){
    session_start();
    $copy = false;
    $res;
    if(isset($_SESSION['postCopy'])){
        $copy = true;
        $res = json_encode($_SESSION['postCopy']);
        echo $res;
        return ;
    }
    echo '{"false": false}';
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