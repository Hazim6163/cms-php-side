/**
 * in this file we will manage the home page exactly the posts section.
 * 
 * User Information:
 * get user information userLoggedIn bool and userInfo content userCard.
 * 
 */

//get user information:
var userLoggedIn = false;
var userInfo = getUserInfo();


//urls:
const userImgBase = 'http://localhost:3000/user/profilePhoto?id=';
const postImgBase = 'http://localhost:3000/file/uri?uri=';


//get posts container:
const postsContainer = $('#p_postsContainer');

//attach the post item to posts container:
$.post('./include/home/posts.php', {lastPosts: true}, (lastPosts)=>{
    //loop throw each post
    lastPosts.forEach(post => {
        postsContainer.append(createPost(post));
    });
}, 'json')


/*---------------------- support methods : ---------------------*/

//create post function take post data as parameter:
function createPost(post){
    //create post container:
    var postContainer = $('<div>',{
        id: 'post' + post._id,
        class: 'post'
    });
    // post header
    postHeader = getPostHeader(post);
    postHeader.appendTo(postContainer);
    // post body
    postBody = getPostBody(post);
    postBody.appendTo(postContainer);
    // post footer
    postFooter = getPostFooter(post);
    postFooter.appendTo(postContainer);
    // post comments
    postComments = getPostComments(post);
    postComments.appendTo(postContainer);

    //TODO CREATE INPUT FILES FOR REPLAY

    //create on Actions reactions:
    postContainer = onAction(post, postContainer);

    return postContainer;
}

//create post header
function getPostHeader(post){
    //extract the author info
    const authorInfo = post.authorInfo;

    //create the header container:
    const postHeader = $('<div>',{
        id: 'postHeader'+post._id,
        class: 'postHeader'
    });

    //create the author img container
    var $authorImgContainer = $("<div>", {
        id: 'authorImgContainer'+post._id,
        "class": "authorImgContainer"
    });

    //check if the author has an img
    if(authorInfo.photoUrl){
        var $authorImg = $("<img>", {
        id: 'authorImg'+post._id,
        "class": "authorImg"
        });
        $authorImg.attr('src', userImgBase + authorInfo.photoUrl );
        $authorImg.appendTo($authorImgContainer);
    }else{
        $authorImgContainer.html('<div class="authorIcon"><i class="fas fa-user" style="color:aquamarine;"></i></div>');
    }
    $authorImgContainer.appendTo(postHeader);

    //header content:
    var $headerContent = $("<div>", {
        id: 'headerContent'+post._id,
        "class": "headerContent"
    });
    //author name:
    var $authorName = $("<div>", {
        id: 'authorName'+post._id,
        "class": "authorName"
    });
    $authorName.html(authorInfo.fname+' '+authorInfo.lname);
    $authorName.appendTo($headerContent);
    //post date:
    var $postDate = $("<div>", {
        id: 'postDate'+post._id,
        "class": "postDate"
    }).html(post.updatedAt);
    $postDate.appendTo($headerContent);
    //append header content to post header;
    $headerContent.appendTo(postHeader);


    return postHeader;
}

//create post body
function getPostBody(post) {
    //post body container
    const postBody = $('<div>',{
        id: 'postBody'+post._id,
        class: 'postBody'
    });

    //check if the post has an img: 
    if(post.imgUrl){
        var $postImgContainer = $("<div>", {
            id : 'postImgContainer'+post._id,
            "class": "postImgContainer"
        });
        var $postImg = $("<img>", {
            id : 'postImg'+post._id,
            "class": "postImg"
        });
        $postImg.attr('src', postImgBase+post.imgUrl);
        $postImg.appendTo($postImgContainer);
        $postImgContainer.appendTo(postBody);
    }
    //post content
    var $postContent = $("<div>", {
        id : 'postContent'+post._id,
        "class": "postContent"
    });
    //post title
    var $postTitle = $("<div>", {
        id : 'postTitle'+post._id,
        "class": "postTitle"
    }).html(post.title);
    $postTitle.appendTo($postContent);
    //post description
    var $postDes = $("<div>", {
        id : 'postDes'+post._id,
        "class": "postDes"
    }).html(post.des);
    $postDes.appendTo($postContent);
    //append post content to post body
    $postContent.appendTo(postBody);

    return postBody;
}

//create post footer
function getPostFooter(post){
    //create post footer container:
    const postFooter = $('<div>',{
        id: 'postFooter'+post._id,
        class: 'postFooter'
    });

    //post like container
    var $postLikes = $("<div>", {
        id : 'postLikes'+post._id,
        "class": "postLikes"
    }).css('cursor', 'pointer');
    //append post likes to post footer:
    $postLikes.appendTo(postFooter);

    //post Like Icon
    var $postLikeIcon = $("<div>", {
        id : 'postLikeIcon'+post._id,
        "class": "postLikeIcon"
    });//TODO ADD LISTENER ON POST LIKE CLICK
    $postLikeIcon.appendTo($postLikes);
    //check if the user has already likes the post:
    const alreadyLiked = post.likers.find((liker)=>{
        return liker.id == userInfo.id;
    });
    if(alreadyLiked){
        $postLikeIcon.html('<i class="fas fa-heart alreadyLikedIcon "> </i>');
    }else{
        $postLikeIcon.html('<i class="far fa-thumbs-up"></i>');
    }

    //likes count :
    var $postLikesCount = $("<div>", {
        id: 'postLikesCount'+post._id,
        "class": "postLikesCount"
    });//TODO ON LIKES COUNT CLICK LISTENER
    $postLikesCount.appendTo($postLikes);
    //check if the post has likes:
    if(post.likesCount > 0){
        $postLikesCount.html(post.likesCount+' Likes');
    }else{
        $postLikesCount.html(' Like');
    }

    //comments like icon and count:
    var $commentsToggle = $("<div>", {
        id: 'commentsToggle'+post._id,
        "class": "commentsToggle"
    }).css('cursor', 'pointer');
    $commentsToggle.appendTo(postFooter);

    //comment icon
    var $postReplayIcon = $("<div>", {
        id: 'postReplayIcon'+post._id,
        "class": "postReplayIcon"
    }).html('<i class="far fa-comments"></i>');//TODO ADD ON POST COMMENT ICON CLICK LISTENER
    $postReplayIcon.appendTo($commentsToggle);

    //comments count:
    var $postCommentsCount = $("<div>", {
        id: 'postCommentsCount'+post._id,
        "class": "postCommentsCount"
    })
    $postCommentsCount.appendTo($commentsToggle);

    //check if post has comments;
    if(post.commentsCount > 0){
        $postCommentsCount.html(post.commentsCount+' Comments');//TODO ADD ON POST COMMENTS COUNT CLICK LISTENER
    }else{
        $postCommentsCount.html(' Comment');
    }

    return postFooter;
}

//create post comments
function getPostComments(post){
    const comments = $('<div>',{
        id: 'comments'+post._id,
        class: 'comments'
    }).html('Comments: ');//TODO ADD TOGGLE AND HIDE BY DEFAULT
    //check if the post has comments:
    if(!post.commentsCount > 0){
        //TODO NO COMMENTS BE THE FIRST ONE WHO COMMENT THE POST.
        comments.html('there are no comments be the first one who comment the post').addClass('postNoComments');
        return comments;
    }

    post.comments.forEach((comment)=>{
        comments.append(createComment(comment));
    });
    

    return comments;
}


//create comment function:
function createComment(comment){
    const commentContainer = $('<div>',{
        id: 'commentContainer'+comment._id,
        class: 'commentContainer'
    });

    //comment header
    const commentHeader = getCommentHeader(comment);
    commentContainer.append(commentHeader);
    //comment body
    const commentBody = getCommentBody(comment);
    commentContainer.append(commentBody);
    //comment footer
    const commentFooter = getCommentFooter(comment);
    commentContainer.append(commentFooter);
    //comment Replays
    //check if the comment has replays:
    if(comment.replaysCount > 0){
        const commentReplays = getCommentReplays(comment);
        commentContainer.append(commentReplays);
    }
    //TODO CREATE INPUT FILES FOR REPLAY

    return commentContainer;
}

//get comment header function;
function getCommentHeader(comment){
    //extract the commenter info
    const commenter = comment.authorInfo;

    const commentHeader = $('<div>',{
        id: 'commentHeader'+comment._id,
        class: 'commentHeader'
    });

    const $commenterPhoto = $("<div>", {
        id: 'commenterPhoto'+comment._id,
        "class": "commenterPhoto"
    });
    $commenterPhoto.appendTo(commentHeader);
    //commenter img:
    var $imgCommenterPhoto = $("<img>", {
        id: 'imgCommenterPhoto'+comment._id,
        "class": "imgCommenterPhoto"
    });
    $imgCommenterPhoto.appendTo($commenterPhoto);
    //check if the commenter has an img
    if(commenter.photoUrl){
        $imgCommenterPhoto.attr('src', userImgBase+commenter.photoUrl);
    }else{
        $imgCommenterPhoto.html('<div class="userIcon"><i class="fas fa-user" style="color:aquamarine;"></i></div>');
    }
    var $commenterName = $("<div>", {
        id: 'commenterName'+comment._id,
        "class": "commenterName"
    }).html(commenter.fname+' '+ commenter.lname);
    $commenterName.appendTo(commentHeader);

    return commentHeader;
}

//get comment body function;
function getCommentBody(comment){
    const commentBody = $('<div>',{
        id: 'commentBody'+comment._id,
        class: 'commentBody'
    }).html(comment.body);

    return commentBody;
}
//get comment footer function;
function getCommentFooter(comment){
    const commentFooter = $('<div>',{
        id: 'commentFooter'+comment._id,
        class: 'commentFooter'
    });

    //comment date will show the updated at date:
    const $commentDate = $("<div>", {
        id: 'commentFooter'+comment._id,
        "class": "commentDate"
    }).html(comment.updatedAt);
    $commentDate.appendTo(commentFooter);

    // comment like icon count container
    const $commentLikes = $("<div>", {
        id: 'commentFooter'+comment._id,
        "class": "commentLikes"
    }).css('cursor', 'pointer');
    $commentLikes.appendTo(commentFooter);

    //comment like icon
    const $commentLikeIcon = $("<div>", {
        id: 'commentFooter'+comment._id,
        "class": "commentLikeIcon"
    });
    //append comment like icon to the comment likes container
    $commentLikeIcon.appendTo($commentLikes);
    //check if the use has already likes the comment:
    const alreadyLiked = comment.likers.find((liker)=>{
        return liker.id == userInfo.id;
    });//TODO ON COMMENT LIKE ICON CLICK
    if(alreadyLiked){
        $commentLikeIcon.html('<i class="fas fa-heart alreadyLikedIcon "> </i>');
    }else{
        $commentLikeIcon.html('<i class="far fa-thumbs-up"></i>');
    }
    //likes count
    const $commentLikesCount = $("<div>", {
        id: 'commentFooter'+comment._id,
        "class": "commentLikesCount"
    });
    //append the likes count to the comment likes container
    $commentLikesCount.appendTo($commentLikes);
    //check if the comment has likes:
    if(comment.likesCount > 0){
        $commentLikesCount.html(comment.likesCount+' Likes');
    }else{
        $commentLikesCount.html(' Like');
    }

    //comment replays:
    const $replays = $("<div>", {
        id: 'commentFooter'+comment._id,
        "class": "replays"
    }).css('cursor', 'pointer');
    $replays.appendTo(commentFooter);
    //comment replay Icon
    const $commentReplayIcon = $("<div>", {
        id: 'commentFooter'+comment._id,
        "class": "commentReplayIcon"
    }).html('<i class="far fa-comments"></i>');
    $commentReplayIcon.appendTo($replays);
    //comment replays Count:
    const  $commentReplaysCount = $("<div>", {
        id: 'commentFooter'+comment._id,
        "class": "commentReplaysCount"
    });//TODO ON COMMENT REPLAYS COUNT CLICK
    $commentReplaysCount.appendTo($replays);
    //check if comment has replays;
    if(comment.replaysCount > 0){
        $commentReplaysCount.html(comment.replaysCount+' Replays');
    }else{
        $commentReplaysCount.html(' Replay');
    }

    return commentFooter;
}
//get comment replays function;
function getCommentReplays(comment){
    const commentReplays = $('<div>',{
        id: 'replaysContainer'+comment._id,
        class: 'replaysContainer'
    });

    //check if the comment has replays:
    if(!comment.replays > 0){
        return commentReplays;
    }
    //then the comment has replays:
    comment.replays.forEach((replay)=>{
        commentReplays.append(createReplay(replay));
    });

    return commentReplays;
}


//create replay function
function createReplay(replay){
    //create replay Container
    const replayContainer = $('<div>', {
        id: 'replayContainer'+replay._id,
        class:'replayContainer'
    });

    //replay header
    const replayHeader = getReplayHeader(replay);
    replayContainer.append(replayHeader);
    //replay body
    const replayBody = getReplayBody(replay);
    replayContainer.append(replayBody);
    //replay footer
    const replayFooter = getReplayFooter(replay);
    replayContainer.append(replayFooter);

    return replayContainer;

}

//create replay header
function getReplayHeader(replay){
    const replayHeader = $('<div>',{
        id: 'replayHeader'+replay._id,
        class: 'replayHeader'
    });

    //replay like icon id, likes count id and extract the replay author info
    const replayLikeIconId = 'replayLikeIcon'+replay._id;
    const replayLikesCount = 'replaysLikesCount'+ replay._id;
    const replayer = replay.authorInfo;

    //replay author img
    const $replayerPhoto = $("<div>", {
        id: 'replayerPhoto'+replay._id,
        "class": "replayerPhoto"
    });
    $replayerPhoto.appendTo(replayHeader);
    const $imgReplayerPhoto = $("<img>", {
        id: 'imgReplayerPhoto'+replay._id,
        "class": "imgReplayerPhoto"
    }).attr('src',userImgBase+replayer.photoUrl);
    $imgReplayerPhoto.appendTo($replayerPhoto);

    //replay author name
    const $replayerName = $("<div>", {
        id: 'replayerName'+replay._id,
        "class": "replayerName"
    }).html(replayer.fname+ ' ' +replayer.lname);
    $replayerName.appendTo(replayHeader);


    return replayHeader;
}

//create replay body
function getReplayBody(replay){
    const replayBody = $('<div>',{
        id: 'replayBody'+replay._id,
        class: 'replayBody'
    }).html(replay.body);

    return replayBody;
}

//create replay footer
function getReplayFooter(replay){
    const replayFooter = $('<div>',{
        id: 'replayFooter'+replay._id,
        class: 'replayFooter'
    });

    return replayFooter;
}

//reactions ...
function onAction(post, postContainer){
    return postContainer;
}

//log message:
function log(des, msg) {
    console.log(
        '--------------------------\n' +
        des +
        '\n--------------------------\n' +
        msg +
        '\n--------------------------'
    );
}

//get User Information:
function getUserInfo(){
    var userInfo;
    $.ajax({
        async: false,
        type:'POST',
        url: './include/home/posts.php',
        data: {userInformation: true},
        success: (res)=>{
            userInfo = res;
            userLoggedIn = true;
        },
        dataType: 'json'
    });
    return userInfo;
}
