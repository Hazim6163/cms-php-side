<?php
//include/home/posts.php
/**
 * information about this file:
 * we will manage the html page throw the home.js file.
 * this file will provide a main functions to contact to the api server like:
 *      - send the user information to the js when requested
 *      - send the last posts array to the js when requested.
 *      - receive the like request on the post, comment and replay
 * will content html elements:
 *      - posts Container
*/


//user information request:
if(isset($_POST['userInformation'])){
    session_start();
    //check if the user logged in
    if(isset($_SESSION['token'])){
        global $userInfo; 
        $userInfo = $_SESSION['userInfo'];
        echo(json_encode($_SESSION['userInfo']));
    }
    return;
}

//posts array request:
if(isset($_POST['lastPosts'])){
    require ('../../Classes/Post.php');
    $lastPosts = Post::getLastPosts();
    /**last post array */
    if (!$lastPosts['error']) {
        $lastPosts = $lastPosts['result'];
    }else{
        session_start();
        $_SESSION['errorCode'] = 601;
        session_write_close();
        header('Location: ./error.php');
    }
    echo(json_encode($lastPosts));
    return;
}

//replay like toggle:
if(isset($_POST['replayLike'])){
    session_start();
    //will return true if the user liked and false if disliked
    require ('../../classes/utils.php');
    $url = 'http://localhost:3000/posts/replay/like';
    $postData = array(
        'postId' =>  $_POST['postId'],
        'commentId' =>  $_POST['commentId'],
        'replayId' =>  $_POST['replayId']
    );
    $requestHeaders = array(
        'Authorization: '.$_SESSION['token']
    );
    $res = Utils::toggleLike($url, $postData, $requestHeaders);
    echo($res);
    return;
}

//comment like toggle:
if(isset($_POST['commentLike'])){
    session_start();
    //will return true if the user liked and false if disliked
    require ('../../classes/utils.php');
    $url = 'http://localhost:3000/posts/comment/like';
    $postData = array(
        'postId' =>  $_POST['postId'],
        'commentId' =>  $_POST['commentId']
    );
    $requestHeaders = array(
        'Authorization: '.$_SESSION['token']
    );
    $res = Utils::toggleLike($url, $postData, $requestHeaders);
    echo($res);
    return;
}

//post Like:
if(isset($_POST['postLike'])){
    session_start();
    //will return true if the user liked and false if disliked
    require ('../../classes/utils.php');
    $url = 'http://localhost:3000/posts/like';
    $postData = array(
        'postId' =>  $_POST['postId']
    );
    $requestHeaders = array(
        'Authorization: '.$_SESSION['token']
    );
    $res = Utils::toggleLike($url, $postData, $requestHeaders);
    echo($res);
    return;
}

//post likers array:
if(isset($_POST['postLikers'])){
    $postId = $_POST['postId'];
    $url = 'http://localhost:3000/posts/likers?postId=' . $postId;
    require('../../classes/utils.php');
    $res = Utils::getRequest($url);

    echo($res);
    return;
}

//comment Likers array:
if(isset($_POST['commentLikers'])){
    $commentId = $_POST['commentId'];
    $url = 'http://localhost:3000/posts/comments/likers?commentId=' .$commentId;
    require('../../classes/utils.php');
    $res = Utils::getRequest($url);

    echo($res);
    return;
}

//replay Likers array:
if(isset($_POST['replayLikers'])){
    $replayId = $_POST['replayId'];
    $url = 'http://localhost:3000/posts/replays/likers?replayId=' .$replayId;
    require('../../classes/utils.php');
    $res = Utils::getRequest($url);

    echo($res);
    return;
}

//send add post comment request :
if(isset($_POST['addPostComment'])){
    session_start();
    $postId = $_POST['postId'];
    $commentBody = $_POST['commentBody'];
    $url = 'http://localhost:3000/posts/comment';
    $postData = array(
        'postId' =>  $postId,
        'body' => $commentBody
    );
    $requestHeaders = array(
        'Authorization: '.$_SESSION['token']
    );
    require('../../classes/utils.php');
    $res = Utils::postRequest($url, $postData, $requestHeaders);
    
    echo($res);
    return;
}

//delete post comment request:
if(isset($_POST['deletePostComment'])){
    session_start();
    $postId = $_POST['postId'];
    $commentId = $_POST['commentId'];
    $url = 'http://localhost:3000/posts/comment?commentId='.$commentId.'&postId='.$postId;
    $requestHeaders = array(
        'Authorization: '.$_SESSION['token']
    );
    require('../../classes/utils.php');
    $res = Utils::deleteRequest($url, $requestHeaders);

    echo($res);
    return;
}

//update post comment request:
if(isset($_POST['updatePostComment'])){
    session_start();
    $commentId = $_POST['commentId'];
    $commentBody = $_POST['commentBody'];
    $url = 'http://localhost:3000/posts/comment';
    $patchField = array(
        'commentId' => $commentId,
        'commentBody' => $commentBody
    );
    $headers = array(
        'Authorization: '.$_SESSION['token']
    );
    require('../../classes/utils.php');
    $res = Utils::patchRequest($url, $patchField, $headers);

    echo($res);
    return;
}

//add replay:
if(isset($_POST['addCommentReplay'])){
    session_start();
    $postId = $_POST['postId'];
    $commentId = $_POST['commentId'];
    $body = $_POST['replayBody'];
    $url = 'http://localhost:3000/posts/replay';
    $postData = array(
        'postId' =>  $postId,
        'body' => $body,
        'commentId' => $commentId
    );
    $requestHeaders = array(
        'Authorization: '.$_SESSION['token']
    );
    require('../../classes/utils.php');
    $res = Utils::postRequest($url, $postData, $requestHeaders);
    
    echo($res);
    return;
}

?>

<!--html elements-->

<!-- posts container -->
<div class="p_postsContainer" id="p_postsContainer"></div>
