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
        id: post._id,
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
    const postComments = $('<div>',{
        id: 'postComments'+post._id,
        class: 'postComments'
    });

    return postComments;
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
