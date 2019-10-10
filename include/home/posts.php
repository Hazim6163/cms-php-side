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

// start session if not started:
if(!isset($_COOKIE["PHPSESSID"])){
  session_start();
}

//user information request:
if(isset($_POST['userInformation'])){
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
        $_SESSION['errorCode'] = 601;
        session_write_close();
        header('Location: ./error.php');
    }
    echo(json_encode($lastPosts));
    return;
}

//replay like toggle:
if(isset($_POST['replayLike'])){
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

?>

<!--html elements-->

<!-- posts container -->
<div class="p_postsContainer" id="p_postsContainer"></div>

<!-- post element -->
<div class="post" id="post" hidden>
    <div class="postHeader" id="postHeader">
        <div class="userPhoto" id="userPhoto"></div>
        <div class="headerContent" id="headerContent">
            <div class="postAuthor" id="postAuthor"></div>
            <div class="postDate" id="postDate"></div>
        </div>
    </div>
    <div class="postBody" id="postBody">
        <div class="postPhoto" id="postPhoto" hidden>
        </div>
        <div class="postContent" id="postContent">
            <div class="postTitle" id="postTitle"></div>
            <div class="postDes" id="postDes"></div>
        </div>
    </div>
    <div class="postFooter" id="postFooter">
        <div class="postLikes" id="postLikes">
            <div class="postLikeIcon" id="postLikeIcon" hidden></div>
            <div class="postLikesCount" id="postLikesCount"></div>
        </div>
        <div class="commentsToggle" id="commentsToggle">
            <div class="postReplayIcon" id="postReplayIcon"></div>
            <div class="postCommentsCount" id="postCommentsCount"></div>
        </div>
    </div>
    <div class="comments" id="comments">
        <div class="commentsContainer" id="commentContainer">
            <div class="commentHeader" id="commentHeader">
                <div class="commenterPhoto" id="commenterPhoto"></div>
                <div class="commenterName" id="commenterName"></div>
            </div>
            <div class="commentBody" id="commentBody"></div>
            <div class="commentFooter" id="commentFooter">
                <div class="commentDate" id="commentDate"></div>
                <div class="commentLikes" id="commentLikes">
                    <div class="commentLikeIcon" id="commentLikeIcon"></div>
                    <div class="commentLikesCount" id="commentLikesCount"></div>
                </div>
                <div class="replays" id="replays">
                    <div class="commentReplayIcon" id="commentReplayIcon"></div>
                    <div class="commentReplaysCount" id="commentReplaysCount"></div>
                </div>
            </div>
            <div class="replaysContainer" id="replaysContainer">
                <div class="replayContainer" id="replayContainer">
                    <div class="replayHeader" id="replayHeader">
                        <div class="replayerPhoto" id="replayerPhoto" hidden></div>
                        <div class="replayerName" id="replayerName"></div>
                    </div>
                    <div class="replayBody" id="replayBody"></div>
                    <div class="replayFooter" id="replayFooter">
                        <div class="replayDate" id="replayDate"></div>
                        <div class="replayLikes" id="replayLikes">
                            <div class="replayLikeIcon" id="replayLikeIcon"></div>
                            <div class="replayLikesCount" id="replayLikesCount"></div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>