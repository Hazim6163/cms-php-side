/**
 * in this file we will manage the home page exactly the posts section.
 * 
 * User Information:
 * get user information userLoggedIn bool and userInfo content userCard.
 * //TODO fix search problem
 */

//get user information:
var userLoggedIn = false;
var userInfo = getUserInfo();


//urls:
const userImgBase = 'http://localhost:3000/user/profilePhoto?id=';
const postImgBase = 'http://localhost:3000/file/uri?uri=';

//vars:
// to check comment edit Progress
var commentInEditProgress = false;


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
    postComments = getPostComments(post._id, post.commentsCount, post.comments);
    postComments.appendTo(postContainer);

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
    }).html(postDateFormate(post.updatedAt));
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
    });
    onPostLikeIconClick($postLikeIcon, post._id);
    $postLikeIcon.appendTo($postLikes);
    //check if the user logged in.
    var alreadyLiked = false;
    if(userLoggedIn){
        //check if the user has already likes the post:
        alreadyLiked = post.likers.find((liker)=>{
            return liker.id == userInfo.id;
        });
    }
    if(alreadyLiked){
        $postLikeIcon.html('<i class="fas fa-heart alreadyLikedIcon "> </i>');
    }else{
        $postLikeIcon.html('<i class="far fa-thumbs-up"></i>');
    }

    //likes count :
    var $postLikesCount = $("<div>", {
        id: 'postLikesCount'+post._id,
        "class": "postLikesCount"
    });
    onPostLikesCountClick($postLikesCount, post._id);
    $postLikesCount.appendTo($postLikes);
    //check if the post has likes:
    if(post.likesCount > 0){
        $postLikesCount.html(post.likesCount+' Likes');
    }else{
        $postLikesCount.html(' Like');
    }

    //comments replay icon and count:
    var $commentsToggle = $("<div>", {
        id: 'commentsToggle'+post._id,
        "class": "commentsToggle"
    }).css('cursor', 'pointer');
    setOnPostFooterReplayClick($commentsToggle, post._id);
    $commentsToggle.appendTo(postFooter);

    //comment icon
    var $postReplayIcon = $("<div>", {
        id: 'postReplayIcon'+post._id,
        "class": "postReplayIcon"
    }).html('<i class="far fa-comments"></i>');
    $postReplayIcon.appendTo($commentsToggle);

    //comments count:
    var $postCommentsCount = $("<div>", {
        id: 'postCommentsCount'+post._id,
        "class": "postCommentsCount"
    })
    $postCommentsCount.appendTo($commentsToggle);

    //check if post has comments;
    if(post.commentsCount > 0){
        $postCommentsCount.html(post.commentsCount+' Comments');
    }else{
        $postCommentsCount.html(' Comment');
    }

    return postFooter;
}

//create post comments
function getPostComments(postId, commentsCount, PostComments){
    //check if we need to update the section or create from scratch:
    var comments;
    if(!$('#comments'+postId).html()){
        comments = $('<div>',{
            id: 'comments'+postId,
            class: 'comments'
        }).html('Comments: ').hide();
    }else{
        comments = $('#comments'+postId);
        comments.html('');
        comments.show();
    }
    
    //check if the post has comments:
    if(!commentsCount > 0){
        comments.html('there\'s no comments be the first one who comment the post').addClass('postNoComments');
        // add post comment
        addComment = getAddPostComment(postId);
        addComment.appendTo(comments);
        return comments;
    }

    PostComments.forEach((comment)=>{
        comments.append(createComment(comment));
    });

    // add post comment
    addComment = getAddPostComment(postId);
    addComment.appendTo(comments);

    return comments;
}

//add post comment:
function getAddPostComment(postId){
    //create add post comment container
    const addPostCommentContainer = $('<div>',{
        id: 'addPostCommentContainer'+postId,
        class: 'addPostCommentContainer'
    });
    //create add post input field
    const addPostCommentInput = $('<textarea>',{
        id : 'addPostCommentInput'+postId,
        class : 'addPostCommentInput'
    }).attr('rows', 1);
    //append input filed to add comment container
    addPostCommentContainer.append(addPostCommentInput);
    //on comment textarea lines changed:
    autoTextAreaCommentInputHeight(addPostCommentInput, 24);
    //submit comment button
    const addPostCommentInputSubmit = $('<div>', {
        id: 'addPostCommentInputSubmit'+postId,
        class : 'addPostCommentInputSubmit'
    }).css('cursor', 'pointer').html('comment');
    setOnPostCommentSubmitListener(addPostCommentInputSubmit, postId);
    addPostCommentInputSubmit.addClass('addPostCommentInputSubmit');
    //append submit button to add comment container
    addPostCommentContainer.append(addPostCommentInputSubmit);

    return addPostCommentContainer;
}

//create comment function:
function createComment(comment){
    // to show the multi line comments:
    comment.body = comment.body.replace(/\n/g,'<br>');
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
    const commentReplays = getCommentReplays(comment);
    commentContainer.append(commentReplays);

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
    //check if the user logged in:
    if(!userLoggedIn){
        //return the user is not logged in
        return commentHeader;
    }
    //check if the current user is the comment author
    if(!commenter.id == userInfo._id){
        // return the current user is not the comment author
        return commentHeader;
    }

    //create comment author edit icon:
    const tools = $('<div>',{
        id:'commentAuthorTools'+comment._id,
        class: 'commentAuthorTools'
    }).html('<i class="fas fa-ellipsis-v"></i>');
    tools.appendTo(commentHeader);
    //author edit icon on click menu:
    tools.click(()=>{
        // to stop inflate menu when the edit comment in progress
        if(commentInEditProgress){
            return;
        }
        createPostCommentAuthorEditIconMenu(tools, comment._id, comment.postId);
    });
    //return the current user is the comment author
    return commentHeader;
}

//Comment author edit icon menu:
function createPostCommentAuthorEditIconMenu(icon, commentId, postId){
    //check if the modal already created to remove the modal
    if($('#editCommentModal'+commentId).html()){
        //remove close class from the icon
        icon.html('<i class="fas fa-ellipsis-v"></i>');
        $('#editCommentModal'+commentId).remove();
        return;
    }
    //add close class to the icon
    icon.html('<i class="fas fa-times"></i>');

    //get positions:
    const iconX = icon.offset().left;
    const iconY = icon.offset().top;
    //set the modal position:
    const modalX = iconX;
    const modalY = iconY + icon.height();
    //create the modal:
    const editModal = $('<div>',{
        id:'editCommentModal'+commentId,
        class:'editCommentModal'
    });
    //style the modal
    editModal.css({
        'top': modalY,
        'left': modalX
    });
    //animate the modal
    editModal.animate({
        'width': '70px'
    }, 100)
    //edit comment:
    const edit = $('<div>',{
        id:'editCommentButton'+commentId,
        class: 'editCommentButton'
    }).html('Edit').css({'margin':'auto', 'font-size':'13px', 'padding':'4px', 'cursor':'pointer'});
    edit.click(()=>{
        commentInEditProgress = true;
        //close the menu
        createPostCommentAuthorEditIconMenu(icon, commentId, postId);
        //change the menu icon 
        $('#commentAuthorTools'+commentId).html('<i class="fas fa-spinner"></i>');
        $('#commentAuthorTools'+commentId).toggleClass('rotate');
        //send to edit post comment function
        editPostComment(commentId, postId);
    });
    edit.appendTo(editModal);
    //line break:
    const line = $('<div>').addClass('editCommentModalLineBreak');
    line.appendTo(editModal);
    //delete  comment:
    const  deleteComment =  $('<div>',{
        id: 'deleteCommentButton'+commentId,
        class: 'deleteCommentButton'
    }).html('Delete').css({'margin':'auto', 'font-size':'13px', 'padding':'4px', 'cursor':'pointer'});
    deleteComment.click(()=>{
        //to close the menu
        createPostCommentAuthorEditIconMenu(icon, commentId, postId);
        //change the icon to in progress
        $('#commentAuthorTools'+commentId).html('<i class="fas fa-spinner"></i>');
        icon.toggleClass('rotate');
        deletePostComment(commentId, postId);
    })
    deleteComment.appendTo(editModal);
    

    //append to body 
    $('body').append(editModal);
}

//edit post comment request
function editPostComment(commentId, postId){
    const commentBody = $('#commentBody'+commentId).html();
    //hide the comment container form comments container
    //hide the add Post Comment Container
    $('#addPostCommentContainer'+postId).hide();
    //create edit comment container
    const editCommentContainer = $('<div>',{
        id: 'editCommentContainer'+commentId,
        class: 'editCommentContainer'
    });
    const editCommentInput = $('<textarea>',{
        id:'editCommentInput'+commentId,
        class: 'editCommentInput'
    }).attr('rows', 1).html(commentBody);
    editCommentInput.appendTo(editCommentContainer);
    //on comment textarea lines changed:
    autoTextAreaCommentInputHeight(editCommentInput, 24);
    //submit update comment button
    const updatePostCommentButton = $('<div>', {
        id: 'updatePostCommentButton'+commentId,
        class : 'updatePostCommentButton'
    }).css('cursor', 'pointer').html('Update');
    //set on confirm update comment click:
    updatePostCommentButton.click(()=>{
        const commentBody = $('#editCommentInput'+commentId).val();
        onPostUpdateComment(commentId, postId, commentBody);
    })
    updatePostCommentButton.appendTo(editCommentContainer);
    //cancel comment update progress:
    const cancelUpdatePostCommentButton =  $('<div>', {
        id: 'cancelUpdatePostCommentButton'+commentId,
        class : 'cancelUpdatePostCommentButton'
    }).css('cursor', 'pointer').html('Cancel');
    // set on cancel update comment click
    cancelUpdatePostCommentButton.click(()=>{
        onUpdateCommentFinish(commentId, postId);
    })
    cancelUpdatePostCommentButton.appendTo(editCommentContainer);


    //append update comment container to the post comments container.
    $('#comments'+postId).append(editCommentContainer);
}

//on confirm update comment click
function onPostUpdateComment(commentId, postId, commentBody){
    //check if the comments are the same:
    if($('#commentBody'+commentId).html() == commentBody){
        onUpdateCommentFinish(commentId, postId);
        return;
    }
    //send update comment request:
    $.post('./include/home/posts.php', {updatePostComment: true, commentId: commentId, commentBody: commentBody}, (res)=>{
        //update the comments container:
        getPostComments(postId, res.commentsCount, res.postComments);
        //update the comments count in the post footer
        //check if there is comments :
        if(res.commentsCount > 0){
            $('#postCommentsCount'+postId).html(res.commentsCount + ' Comments');
        }else{
            $('#postCommentsCount'+postId).html(' Comment');
        }
        //finish the update comment request:
        onUpdateCommentFinish(commentId, postId);
    }, 'json');
}

//on cancel update comment:
function onUpdateCommentFinish(commentId, postId){
    commentInEditProgress = false;
    //show the comment container in comments container
    $('#commentContainer'+commentId).show();
    //show add Post Comment Container
    $('#addPostCommentContainer'+postId).show();
    //remove the update comment container:
    $('#editCommentContainer'+commentId).remove();
    //remove rotate class from the menu icon and set the default icon
    $('#commentAuthorTools'+commentId).html('<i class="fas fa-ellipsis-v"></i>');
    $('#commentAuthorTools'+commentId).removeClass('rotate');
}

//delete post comment request
function deletePostComment(commentId, postId){
    $.post('./include/home/posts.php', {deletePostComment: true, postId: postId, commentId: commentId}, (res)=>{
        //update the comments container
        getPostComments(postId, res.commentsCount, res.comments);
        //update the comments count in the post footer
        //check if there is comments :
        if(res.commentsCount > 0){
            $('#postCommentsCount'+postId).html(res.commentsCount + ' Comments');
        }else{
            $('#postCommentsCount'+postId).html(' Comment');
        }
    }, 'json');
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
        id: 'commentDate'+comment._id,
        "class": "commentDate"
    }).html(commentDateFormate(comment.updatedAt));
    $commentDate.appendTo(commentFooter);

    // comment like icon count container
    const $commentLikes = $("<div>", {
        id: 'commentLikes'+comment._id,
        "class": "commentLikes"
    }).css('cursor', 'pointer');
    $commentLikes.appendTo(commentFooter);

    //comment like icon
    const $commentLikeIcon = $("<div>", {
        id: 'commentLikeIcon'+comment._id,
        "class": "commentLikeIcon"
    });
    //append comment like icon to the comment likes container
    $commentLikeIcon.appendTo($commentLikes);
    //check if the user logged in:
    var alreadyLiked = false;
    if(userLoggedIn){
        //check if the use has already likes the comment:
        alreadyLiked = comment.likers.find((liker)=>{
            return liker.id == userInfo.id;
        });
    }
    setOnCommentLikeIconClick($commentLikeIcon, comment.postId, comment._id);
    if(alreadyLiked){
        $commentLikeIcon.html('<i class="fas fa-heart alreadyLikedIcon "> </i>');
    }else{
        $commentLikeIcon.html('<i class="far fa-thumbs-up"></i>');
    }
    //likes count
    const $commentLikesCount = $("<div>", {
        id: 'commentLikesCount'+comment._id,
        "class": "commentLikesCount"
    });
    setOnCommentLikesCountClick($commentLikesCount, comment._id);
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
        id: 'replays'+comment._id,
        "class": "replays"
    }).css('cursor', 'pointer');
    setOnCommentFooterReplayClick($replays, comment._id);
    $replays.appendTo(commentFooter);
    //comment replay Icon
    const $commentReplayIcon = $("<div>", {
        id: 'commentReplayIcon'+comment._id,
        "class": "commentReplayIcon"
    }).html('<i class="far fa-comments"></i>');
    $commentReplayIcon.appendTo($replays);
    //comment replays Count:
    const  $commentReplaysCount = $("<div>", {
        id: 'commentReplaysCount'+comment._id,
        "class": "commentReplaysCount"
    });
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
    //check if we need to update the section or create from scratch:
    var commentReplays;
    if(!$('#replaysContainer'+comment._id).html()){
        commentReplays = $('<div>',{
            id: 'replaysContainer'+comment._id,
            class: 'replaysContainer'
        }).hide();
    }else{
        commentReplays = $('#replaysContainer'+comment._id);
        commentReplays.html('');
        commentReplays.show();
    }

    //check if the comment has replays:
    if(!comment.replaysCount > 0){
        commentReplays.html('this comment has no replays be the first one who replay the comment').addClass('postNoComments');
        //add replay
        addReplay = getAddCommentReplay(comment._id, comment.postId);
        addReplay.appendTo(commentReplays);
        return commentReplays;
    }
    //then the comment has replays:
    comment.replays.forEach((replay)=>{
        commentReplays.append(createReplay(replay));
    });

    //add replay
    addReplay = getAddCommentReplay(comment._id, comment.postId);
    addReplay.appendTo(commentReplays);
    

    return commentReplays;
}

//add comment replay
function getAddCommentReplay(commentId, postId){
    //create add replay container
    const addCommentReplayContainer = $('<div>',{
        id:'addCommentReplayContainer'+commentId,
        class: 'addCommentReplayContainer'
    });
    //create add comment input field:
    const addCommentReplayInput = $('<textarea>',{
        id : 'addCommentReplayInput'+commentId,
        class : 'addCommentReplayInput'
    }).attr('rows', 1);
    addCommentReplayInput.appendTo(addCommentReplayContainer);
    //on replay textarea lines changed:
    autoTextAreaCommentInputHeight(addCommentReplayInput, 24);
    //submit replay button
    const addCommentReplaySubmit = $('<div>', {
        id: 'addCommentReplaySubmit'+commentId,
        class : 'addCommentReplaySubmit'
    }).css('cursor', 'pointer').html('Replay');
    setOnReplaySubmitClickListener(addCommentReplaySubmit, commentId, postId);
    //append submit button to add replay container
    addCommentReplayContainer.append(addCommentReplaySubmit);

    return addCommentReplayContainer;
}

//on comment replay submit
function setOnReplaySubmitClickListener(button, commentId, postId){
    button.click(()=>{
        //check if the user logged in:
        if(!userLoggedIn){
            alert('please login before leave a Replay');
            //TODO add login modal
            return;
        }
        //extract the replay body
        const replayBody = $('#addCommentReplayInput'+commentId).val();
        if(replayBody == '' || replayBody == null){
            alert('replay cannot be empty');
            //TODO add alert modal
            return;
        }
        //send add comment replay request to php
        $.post('./include/home/posts.php', {addCommentReplay: true, postId: postId, replayBody: replayBody, commentId: commentId}, (res)=>{
            getCommentReplays(res.comment);
        }, 'json');
    })
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

    //replay extract the replay author info
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
    const replayLikeIconId = 'replayLikeIcon'+replay._id;
    const replayLikesCount = 'replayLikesCount'+ replay._id;

    const replayFooter = $('<div>',{
        id: 'replayFooter'+replay._id,
        class: 'replayFooter'
    });
    //replay date
    const $replayDate = $("<div>", {
        id: 'replayDate'+replay._id,
        "class": "replayDate"
    }).html(replay.updatedAt);
    replayFooter.append($replayDate);
    var $replayLikes = $("<div>", {
        id: 'replayLikes'+replay._id,
        "class": "replayLikes"
    }).css('cursor', 'pointer');
    replayFooter.append($replayLikes);
    //check if the use logged in:
    var alreadyLiked = false;
    if(userLoggedIn){
        //check if the user already liked the replay:
        alreadyLiked = replay.likers.find((liker)=>{
            return liker.id == userInfo.id;
        });
    }
    const $replayLikeIcon = $("<div>", {
        id: replayLikeIconId,
        "class": "replayLikeIcon"
    });
    setOnReplayLikeIconClick($replayLikeIcon, replay._id, replay.commentId, replay.postId);
    $replayLikes.append($replayLikeIcon);
    if(alreadyLiked){
        $replayLikeIcon.html('<i class="fas fa-heart alreadyLikedIcon "> </i>');
    }else{
        $replayLikeIcon.html('<i class="far fa-thumbs-up"></i>');
    }

    //replay Likes count:
    var $replayLikesCount = $("<div>", {
        id: replayLikesCount,
        "class": "replayLikesCount"
    });
    setOnReplayLikesCountClick($replayLikesCount, replay._id);
    $replayLikes.append($replayLikesCount);
    //check if the comment has likes:
    if(replay.likesCount > 0){
        $replayLikesCount.html(replay.likesCount+' Likes');
    }else{
        $replayLikesCount.html(' Like');
    }
    

    return replayFooter;
}

/** --------------------------- posts reactions: ---------------------------------------*/
// on post replay Icon click
function setOnPostFooterReplayClick(icon, postId){
    icon.click(()=>{
        $('#comments'+postId).toggle('slow');
    });
}
// on post like icon click
function onPostLikeIconClick(icon, postId){
    icon.click(()=>{
        //check if the user logged in
        if(!userLoggedIn){
            alert('please Login before try to like the post');
            //TODO CREATE A LOGIN MODEL
            return;
        }
        //animate the like icon:
        $('#postLikeIcon'+postId).toggleClass('rotate');
        $.post('./include/home/posts.php',{postLike: true, postId: postId}, (response)=>{
            var likesCount = response.likesCount;
            var action = response.action;
            var likersRes = response.likers;
            //check if like or dislike
            if(action > 0){
                $('#postLikeIcon'+postId).html('<i class="fas fa-heart alreadyLikedIcon "> </i>');
            }else{
                $('#postLikeIcon'+postId).html('<i class="far fa-thumbs-up"></i>');
            }
            if(likesCount > 0){
                $('#postLikesCount'+postId).html(likesCount+' Likes');
            }else{
                $('#postLikesCount'+postId).html('Like');
            }
            $('#postLikeIcon'+postId).toggleClass('rotate');

            likers = likersRes;

        }, 'json');
    });
}
//on post likes count click 
function onPostLikesCountClick(component, postId){
    component.click(()=>{
        //send to php server ger likers and like count request 
        $.post('./include/home/posts.php', {postLikers: true, postId: postId}, (res)=>{
            //likers name list to show it in the alert for this time
            likersNameList='';
            res.likers.forEach((liker)=>{
                likersNameList += (liker.fname +' '+liker.lname+'\n')
            })
            //alert to show the name list:
            alert(likersNameList);
            //update the likes count
            if(res.likesCount > 0){
                $('#postLikesCount'+postId).html(res.likesCount+' Likes');
            }else{
                $('#postLikersCount'+postId).html(' Like');
            }
        }, 'json');
        //TODO CREATE LIKERS LIST MODEL INSTEAD OF ALERT
    });
}
//on comment textarea lines changed:
function autoTextAreaCommentInputHeight(textarea, defaultHeight){
    //create on new line event 
    textarea.keyup(()=>{
        textarea.height(defaultHeight);
        textarea.height(textarea.prop('scrollHeight')-8);
    });
}
//on post comment submit
function setOnPostCommentSubmitListener(button, postId){
    button.click(()=>{
        //check if the user logged in:
        if(!userLoggedIn){
            alert('please login before comment');
            //TODO add login modal
            return;
        }
        //extract the comment body
        const commentBody = $('#addPostCommentInput'+postId).val();
        if(commentBody == '' || commentBody == null){
            alert('comment cannot be empty');
            //TODO add alert modal
            return;
        }
        //send add post comment request to php
        $.post('./include/home/posts.php', {addPostComment: true, postId: postId, commentBody: commentBody}, (res)=>{
            //recreate the post comments container:
            getPostComments(postId, res.commentsCount, res.comments);
        }, 'json');
    })
}

/** --------------------------- comments reactions: ---------------------------------------*/
//set on comment footer replays click
function setOnCommentFooterReplayClick(icon, commentId){
    icon.click(()=>{
        $('#replaysContainer'+commentId).toggle('slow');
    });
}
//set on comment like icon click
function setOnCommentLikeIconClick(icon, postId, commentId){
    icon.click(()=>{
        //check if the user logged in
        if(!userLoggedIn){
            alert('please Login before try to like the comment');
            //TODO CREATE A LOGIN MODEL
            return;
        }
        //animate the like icon:
        $('#commentLikeIcon'+commentId).toggleClass('rotate');
        $.post('./include/home/posts.php',{commentLike: true, commentId: commentId, postId: postId}, (response)=>{
            var likesCount = response.likesCount;
            var action = response.action;
            var likersRes = response.likers;
            //check if like or dislike
            if(action > 0){
                $('#commentLikeIcon'+commentId).html('<i class="fas fa-heart alreadyLikedIcon "> </i>');
            }else{
                $('#commentLikeIcon'+commentId).html('<i class="far fa-thumbs-up"></i>');
            }
            if(likesCount > 0){
                $('#commentLikesCount'+commentId).html(likesCount+' Likes');
            }else{
                $('#commentLikesCount'+commentId).html('Like');
            }
            $('#commentLikeIcon'+commentId).toggleClass('rotate');
        }, 'json');
    });
}
//set on comments likes count click
function setOnCommentLikesCountClick(icon, commentId){
    icon.click(()=>{
        //send to php server the likers and like count request 
        $.post('./include/home/posts.php', {commentLikers: true, commentId: commentId}, (res)=>{
            //likers name list to show it in the alert for this time
            likersNameList='';
            res.likers.forEach((liker)=>{
                likersNameList += (liker.fname +' '+liker.lname+'\n')
            })
            //alert to show the name list:
            alert(likersNameList);
            //update the likes count
            if(res.likesCount > 0){
                $('#commentLikesCount'+commentId).html(res.likesCount+' Likes');
            }else{
                $('#commentLikesCount'+commentId).html(' Like');
            }
        }, 'json');
        //TODO CREATE LIKERS LIST MODEL INSTEAD OF ALERT
    });
}

/** --------------------------- replays reactions: ---------------------------------------*/
//set on replay like icon click:
function setOnReplayLikeIconClick(icon, replayId, commentId, postId){
    icon.click(()=>{
        //check if the user logged in
        if(!userLoggedIn){
            alert('please Login before try to like the replay');
            //TODO CREATE A LOGIN MODEL
            return;
        }
        //animate the like icon:
        $('#replayLikeIcon'+replayId).toggleClass('rotate');
        $.post('./include/home/posts.php',{replayLike: true,replayId: replayId, commentId: commentId, postId: postId}, (response)=>{
            var likesCount = response.likesCount;
            var action = response.action;
            //check if like or dislike
            if(action > 0){
                $('#replayLikeIcon'+replayId).html('<i class="fas fa-heart alreadyLikedIcon "> </i>');
            }else{
                $('#replayLikeIcon'+replayId).html('<i class="far fa-thumbs-up"></i>');
            }
            if(likesCount > 0){
                $('#replayLikesCount'+replayId).html(likesCount+' Likes');
            }else{
                $('#replayLikesCount'+replayId).html('Like');
            }
            $('#replayLikeIcon'+replayId).toggleClass('rotate');
        }, 'json');
    });
}
// set on replay likes count click
function setOnReplayLikesCountClick(icon, replayId){
    icon.click(()=>{
        //send to php server the likers and like count request 
        $.post('./include/home/posts.php', {replayLikers: true, replayId: replayId}, (res)=>{
            //likers name list to show it in the alert for this time
            likersNameList='';
            res.likers.forEach((liker)=>{
                likersNameList += (liker.fname +' '+liker.lname+'\n')
            })
            //alert to show the name list:
            alert(likersNameList);
            //update the likes count
            if(res.likesCount > 0){
                $('#replayLikesCount'+replayId).html(res.likesCount+' Likes');
            }else{
                $('#replayLikesCount'+replayId).html(' Like');
            }
        }, 'json');
        //TODO CREATE LIKERS LIST MODEL INSTEAD OF ALERT
    });
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

function postDateFormate(date){
    date = new Date(date);
    var day  = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();

    return day+'.'+month+'.'+year;
}

function commentDateFormate(date){
    date = new Date(date);
    var day  = date.getDate();
    var month = date.getMonth()+1;
    var year = date.getFullYear();
    var minute = date.getMinutes();
    var hour = date.getHours();


    if(hour<10){
        hour = 0+''+hour;
    }
    if(minute< 10){
        minute = 0+''+minute;
    }

    switch(date.getMonth()){
        case 0 :
            month = 'January';
            break;
        case 1 :
            month = 'February';
            break;
        case 2 :
            month = 'March';
            break;
        case 3 :
            month = 'April';
            break;
        case 4 :
            month = 'May';
            break;
        case 5 :
            month = 'June';
            break;
        case 6 :
            month = 'July';
            break;
        case 7 :
            month = 'August';
            break;
        case 8 :
            month = 'September';
            break;
        case 9 :
            month = 'October';
            break;
        case 10 :
            month = 'November';
            break;
        case 11 :
            month = 'December';
            break;
    }
    // 15:30 01.October.20118

    return day+'.'+month+'.'+year+'&nbsp;&nbsp;&nbsp;'+hour+':'+minute+'&nbsp;&nbsp;&nbsp;';
}
