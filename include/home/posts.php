<?php
$base = 'http://www.mustafa-dev.website/cms';
$api_base = 'http://ec2-35-158-214-140.eu-central-1.compute.amazonaws.com:3000';
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
        echo('{"user":'.json_encode($_SESSION['userInfo']).', "loggedIn": true}');
        return;
    }
    echo('{"loggedIn": false}');
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
    $url = $api_base . '/posts/replay/like';
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
    $url = $api_base . '/posts/comment/like';
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
    $url = $api_base . '/posts/like';
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
    $url = $api_base . '/posts/likers?postId=' . $postId;
    require('../../classes/utils.php');
    $res = Utils::getRequest($url);

    echo($res);
    return;
}

//comment Likers array:
if(isset($_POST['commentLikers'])){
    $commentId = $_POST['commentId'];
    $url = $api_base . '/posts/comments/likers?commentId=' .$commentId;
    require('../../classes/utils.php');
    $res = Utils::getRequest($url);

    echo($res);
    return;
}

//replay Likers array:
if(isset($_POST['replayLikers'])){
    $replayId = $_POST['replayId'];
    $url = $api_base . '/posts/replays/likers?replayId=' .$replayId;
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
    $url = $api_base . '/posts/comment';
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
    $url = $api_base . '/posts/comment?commentId='.$commentId.'&postId='.$postId;
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
    $url = $api_base . '/posts/comment';
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
    $url = $api_base . '/posts/replay';
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

//delete comment replay:
if(isset($_POST['deleteCommentReplay'])){
    session_start();
    $replayId = $_POST['replayId'];
    $headers = array('Authorization: '.$_SESSION['token']);
    $url = $api_base . '/posts/replay?replayId=' . $replayId;
    require('../../classes/utils.php');
    $res = Utils::deleteRequest($url, $headers);

    echo $res;
    return;
}

//update comment replay request:
if(isset($_POST['updateCommentReplay'])){
    session_start();
    $replayId = $_POST['replayId'];
    $body = $_POST['body'];
    $url = $api_base . '/posts/replay';
    $patchField = array(
        'replayId' => $replayId,
        'replayBody' => $body
    );
    $headers = array(
        'Authorization: '.$_SESSION['token']
    );
    require('../../classes/utils.php');
    $res = Utils::patchRequest($url, $patchField, $headers);

    echo($res);
    return;
}

if(isset($_POST['login'])){
    $requestBody = array(
        'usernameOrEmail' => $_POST['username'],
        'password' => $_POST['password']
    );
    $requestBody = json_encode($requestBody);

   $url = $api_base . '/users/login';
   $options = array(
    CURLOPT_RETURNTRANSFER => TRUE,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => $requestBody,
    CURLOPT_HTTPHEADER => array('Content-type: application/json')
   );
   $ch = curl_init($url);
   curl_setopt_array($ch, $options);

   $result = curl_exec($ch);
   $result = json_decode($result);
   $info = curl_getinfo($ch);
   $responseCode = $info['http_code'];
   curl_close($ch);

   if(!($responseCode == 200)){
        echo('{"loggedIn": false, "errorMsg": '.json_encode($result->error).'}');
        return;
    }else {
        session_start();
        $_SESSION['token'] = $result->token;
        $userInfo = $result->userCard;
        $_SESSION['userInfo'] = $userInfo;
        session_write_close();
        echo('{"user":'.json_encode($_SESSION['userInfo']).', "loggedIn": true}');
        return;
   }
}

?>

<!--html elements-->

<!-- posts container -->
<div class="p_postsContainer" id="p_postsContainer"></div>
