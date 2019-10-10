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

?>

<!--html elements-->

<!-- posts container -->
<div class="p_postsContainer" id="p_postsContainer"></div>

<!-- post element -->
<div class="post" id="p_post" hidden>
    <div class="postHeader" id="p_postHeader">
        <div class="userPhoto" id="p_userPhoto"></div>
        <div class="headerContent" id="p_headerContent">
            <div class="postAuthor" id="p_postAuthor"></div>
            <div class="postDate" id="p_postDate"></div>
        </div>
    </div>
    <div class="postBody" id="p_postBody">
        <div class="postPhoto" id="p_postPhoto">
        </div>
        <div class="postContent" id="p_postContent">
            <div class="postTitle" id="p_postTitle"></div>
            <div class="postDes" id="p_postDes"></div>
        </div>
    </div>
    <div class="postFooter" id="p_postFooter">
        <div class="postLikes" id="p_postLikes">
            <div class="postLikeIcon" id="p_postLikeIcon"></div>
            <div class="postLikesCount" id="p_postLikesCount"></div>
        </div>
        <div class="commentsToggle" id="p_commentsToggle">
            <div class="postReplayIcon" id="p_postReplayIcon"></div>
            <div class="postCommentsCount" id="p_postCommentsCount"></div>
        </div>
    </div>
    <div class="comments" id="p_comments" hidden>
        <div class="commentsContainer" id="p_commentsContainer">
            <div class="commentContainer" id="p_commentContainer" hidden>
                <div class="commentHeader" id="p_commentHeader">
                    <div class="commenterPhoto" id="p_commenterPhoto"></div>
                    <div class="commenterName" id="commenterName"></div>
                </div>
                <div class="commentBody" id="p_commentBody"></div>
                <div class="commentFooter" id="p_commentFooter">
                    <div class="commentDate" id="p_commentDate"></div>
                    <div class="commentLikes" id="p_commentLikes">
                        <div class="commentLikeIcon" id="p_commentLikeIcon"></div>
                        <div class="commentLikesCount" id="p_commentLikesCount"></div>
                    </div>
                    <div class="replays" id="p_replays">
                        <div class="commentReplayIcon" id="p_commentReplayIcon"></div>
                        <div class="commentReplaysCount" id="p_commentReplaysCount"></div>
                    </div>
                </div>
                <div class="replaysContainer" id="p_replaysContainer">
                    <div class="replayContainer" id="p_replayContainer">
                        <div class="replayHeader" id="p_replayHeader">
                            <div class="replayerPhoto" id="p_replayerPhoto"></div>
                            <div class="replayerName" id="p_replayerName"></div>
                        </div>
                        <div class="replayBody" id="p_replayBody"></div>
                        <div class="replayFooter" id="p_replayFooter">
                            <div class="replayDate" id="p_replayDate"></div>
                            <div class="replayLikes" id="p_replayLikes">
                                <div class="replayLikeIcon" id="p_replayLikeIcon"></div>
                                <div class="replayLikesCount" id="p_replayLikesCount"></div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>