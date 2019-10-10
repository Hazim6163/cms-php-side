/**
 * in this file we will manage the home page exactly the posts section.
 * 
 * User Information:
 * get user information userLoggedIn bool and userInfo content userCard.
 * 
 * Create Post: 
 * we wil create a post element for each post in last posts array:
 * and attach the post element to the last posts div
 *  -create the post header body and footer.
 *  -comments section
 * 
 */

//get user information:
var userLoggedIn = false;
var userInfo = getUserInfo();

//urls:
const userPhotoUrl = 'http://localhost:3000/user/profilePhoto?id=';
const postPhotoUrl = 'http://localhost:3000/file/uri?uri=';


$(document).ready(()=>{
   const dummyPost = {
        _id:"5d9ba3f4c55bd41e20600d08",
        showInActivity: 1,
        parentId:"5d97671b52754d206075e506",
        "title":"title 1",
        "des":"post des 1",
        "body":"post body 1",
        "likesCount": 0,
        "commentsCount": 0,
        "authorInfo":{
            "_id":"5d9b9c91cb3b053190a369cb",
            "fname":"Mustafa",
            "lname":"Hazim",
            "username":"Hazim6163",
            "email":"hazim6163@gmail.com",
            "photoUrl":"1570203401.png",
            "id":"5d97671b52754d206075e506",
            "admin":{"$numberInt":"0"}
        },
        "comments":[
            {
                "likesCount": 1,
                "replaysCount": 2,
                "replays": [
                    {
                        "likesCount": 0,
                        "likers": [],
                        "_id": "5d9bc937ccc3c92570c1ed30",
                        "postId": "5d9ba404c55bd41e20600d0a",
                        "commentId": "5d9bbf338568ca25a85fb8e5",
                        "body": "replay 1 to comment id: 5d9bbf338568ca25a85fb8e5",
                        "authorInfo": {
                            "_id": "5d9b9c91cb3b053190a369cb",
                            "fname": "Mustafa",
                            "lname": "Hazim",
                            "username": "Hazim6163",
                            "email": "hazim6163@gmail.com",
                            "photoUrl": "1570203401.png",
                            "id": "5d97671b52754d206075e506",
                            "admin": 0,
                            "updatedAt": "2019-10-07T23:24:40.043Z",
                            "createdAt": "2019-10-07T20:14:09.472Z",
                            "__v": 0
                        },
                        "updatedAt": "2019-10-08T11:58:09.953Z",
                        "createdAt": "2019-10-07T23:24:39.745Z",
                        "__v": 0
                    },
                    {
                        "likesCount": 0,
                        "likers": [],
                        "_id": "5d9bfae768ee2d56d8364410",
                        "postId": "5d9ba404c55bd41e20600d0a",
                        "commentId": "5d9bbf338568ca25a85fb8e5",
                        "body": "replay 2 to comment id: 5d9bbf338568ca25a85fb8e5",
                        "authorInfo": {
                            "_id": "5d9b9c91cb3b053190a369cb",
                            "fname": "Mustafa",
                            "lname": "Hazim",
                            "username": "Hazim6163",
                            "email": "hazim6163@gmail.com",
                            "photoUrl": "1570203401.png",
                            "id": "5d97671b52754d206075e506",
                            "admin": 0,
                            "updatedAt": "2019-10-08T02:56:39.990Z",
                            "createdAt": "2019-10-07T20:14:09.472Z",
                            "__v": 0
                        },
                        "updatedAt": "2019-10-08T04:03:52.740Z",
                        "createdAt": "2019-10-08T02:56:39.685Z",
                        "__v": 0
                    }
                ],
                "likers": [
                    {
                        "_id": "5d9c0bd71c9d440000638457",
                        "fname": "Ahamd",
                        "lname": "Hazim",
                        "username": "ahmad",
                        "email": "ahmad@gmail.com",
                        "id": "5d9c0b471c9d440000638456",
                        "admin": 0,
                        "updatedAt": "2019-10-08T04:14:48.969Z",
                        "createdAt": "2019-10-08T04:14:48.969Z"
                    }
                ],
                "_id": "5d9bbf338568ca25a85fb8e5",
                "postId": "5d9ba404c55bd41e20600d0a",
                "body": "comment 1 on post id: 5d9ba404c55bd41e20600d0a",
                "authorInfo": {
                    "_id": "5d9b9c91cb3b053190a369cb",
                    "fname": "Mustafa",
                    "lname": "Hazim",
                    "username": "Hazim6163",
                    "email": "hazim6163@gmail.com",
                    "photoUrl": "1570203401.png",
                    "id": "5d97671b52754d206075e506",
                    "admin": 0,
                    "updatedAt": "2019-10-07T22:41:56.153Z",
                    "createdAt": "2019-10-07T20:14:09.472Z",
                    "__v": 0
                },
                "updatedAt": "2019-10-08T12:05:20.677Z",
                "createdAt": "2019-10-07T22:41:55.873Z",
                "__v": 0
            },
            {
                "likesCount": 1,
                "replaysCount": 0,
                "replays": [],
                "likers": [
                    {
                        "_id": "5d9c0bd71c9d440000638457",
                        "fname": "Ahamd",
                        "lname": "Hazim",
                        "username": "ahmad",
                        "email": "ahmad@gmail.com",
                        "id": "5d9c0b471c9d440000638456",
                        "admin": 0,
                        "updatedAt": "2019-10-08T04:12:12.739Z",
                        "createdAt": "2019-10-08T04:12:12.739Z"
                    }
                ],
                "_id": "5d9c0a88193bf459204a831a",
                "postId": "5d9ba404c55bd41e20600d0a",
                "body": "comment 1 on post id: 5d9ba404c55bd41e20600d0a",
                "authorInfo": {
                    "_id": "5d9b9c91cb3b053190a369cb",
                    "fname": "Mustafa",
                    "lname": "Hazim",
                    "username": "Hazim6163",
                    "email": "hazim6163@gmail.com",
                    "photoUrl": "1570203401.png",
                    "id": "5d97671b52754d206075e506",
                    "admin": 0,
                    "updatedAt": "2019-10-08T04:03:21.254Z",
                    "createdAt": "2019-10-07T20:14:09.472Z",
                    "__v": 0
                },
                "updatedAt": "2019-10-08T12:06:11.137Z",
                "createdAt": "2019-10-08T04:03:20.971Z",
                "__v": 0
            }
        ],
        "likers":[
            {
                id:'5d9b9c91cb3b053190a369cb',
                fname: 'mustafa',
                lname: 'hazim',
                email: 'hazim6163@gmail.com',
                username: 'hazim6163',
                admin: 0,
                photoUrl: ''
            },
        ],
        "updatedAt":"1570481140943",
        "createdAt":"1570481140943"
    }
    fillPostData(dummyPost);
});

/*---------------------- support methods : ---------------------*/

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

/**---------------  post functions --------------- */
//get post  elements
function getPostElements(){
    var postElements = {
        post : $('#p_post'),
        postHeader : $('#p_postHeader'),
        userPhoto : $('#p_userPhoto'),
        headerContent : $('#p_headerContent'),
        postAuthor : $('#p_postAuthor'),
        postDate : $('#p_postDate'),
        postBody : $('#p_postBody'),
        postPhoto : $('#p_postPhoto'),
        postContent : $('#p_postContent'),
        postTitle : $('#p_postTitle'),
        postDes : $('#p_postDes'),
        postFooter : $('#p_postFooter'),
        postLikes : $('#p_postLikes'),
        postLikeIcon : $('#p_postLikeIcon'),
        postLikesCount : $('#p_postLikesCount'),
        commentsToggle : $('#p_commentsToggle'),
        postReplayIcon : $('#p_postReplayIcon'),
        postCommentsCount : $('#p_postCommentsCount'),
        comments : $('#p_comments'),
        commentsContainer : $('#p_commentsContainer')
    };
    return postElements;
}


//get comment elements:
function getCommentElements(){
    var commentElements = {
        commentContainer: $('#p_commentContainer'),
        commentHeader : $('#p_commentHeader'),
        commenterPhoto : $('#p_commenterPhoto'),
        commenterName : $('#p_commenterName'),
        commentBody : $('#p_commentBody'),
        commentFooter : $('#p_commentFooter'),
        commentDate : $('#p_commentDate'),
        commentLikes : $('#p_commentLikes'),
        commentLikeIcon : $('#p_CommentLikeIcon'),
        commentLikesCount : $('#p_commentLikesCount'),
        replays: $('#p_replays'),
        commentReplayIcon : $('#p_commentReplayIcon'),
        commentReplaysCount : $('#p_commentReplaysCount'),
        replaysContainer : $('#p_replaysContainer')
    };
    log('comment Header on get comment elements', commentElements.commentContainer.attr('id'))
    return commentElements;
}

// get replay elements 
function getReplayElements(){
    var replayElements = {
    replayContainer : $('#p_replayContainer'),
        replayHeader : $('#p_replayHeader'),
        replayerPhoto : $('#p_replayerPhoto'),
        replayerName : $('#p_replayerName'),
        replayBody : $('#p_replayBody'),
        replayFooter : $('#p_replayFooter'),
        replayDate : $('#p_replayDate'),
        replayLikes : $('#p_replayLikes'),
        replayLikeIcon : $('#p_replayLikeIcon'),
        replayLikesCount : $('#p_replayLikesCount')
    }
    return replayElements;
}

// create post :
function fillPostData(postData){
    var root = getPostElements();
    var commentE = getCommentElements();

    //clone post elements:
    root = clonePostElements(root);
    //set Id's:
    root = setPostElementsId(root, postData);  

    /**--------------- set post values --------------- */

    // extract post author info
    authorInfo = postData.authorInfo;

    //post header :
    root = postHeader(root, authorInfo, postData);

    //post Body:
    root = postBody(root, postData);

    //post footer:
    root = postFooter(root, postData);

    //post comments
    //root = postComments(root, postData, commentE);

    //append the post to the posts container:
    root.post.attr('hidden', false);
    log('post html', root.post.html())
    $('#p_postsContainer').append(root);

}

//clone post Elements:
function clonePostElements(rootElements){
    const postElementsK = Object.keys(rootElements);
    postElementsK.forEach((element)=>{
        // Original element with attached data
        rootElements[element] = rootElements[element].data( "arr", [ 1 ] ),
        $clone = rootElements[element].clone( true )
        // Deep copy to prevent data sharing
        .data( "arr", $.extend( [], rootElements[element].data( "arr" ) ) );
    })
    return rootElements;
}

//set post elements ids
function setPostElementsId(rootElements, postData){
    const postElements = Object.keys(rootElements);
    postElements.forEach(element => {
        rootElements[element].attr('id', rootElements[element].attr('id')+postData._id);
    });
    return rootElements;
}

//create post header 
function postHeader(root, authorInfo, postData){
    //post author img:
    if(authorInfo.photoUrl){
        //author has img:
        var userImg = $('<img>', {
            class:'imgUserPhoto'
        });
        userImg.attr('src', userPhotoUrl+authorInfo.photoUrl);
        root.userPhoto.append(userImg);
    }else{
        //author didn't had img:
        root.userPhoto.html('<div class="userIcon"><i class="fas fa-user" style="color:aquamarine;"></i></div>');
    }
    //post author name:
    root.postAuthor.html(authorInfo.fname + ' ' +authorInfo.lname);
    //post date:
    root.postDate.html(postData.updatedAt);

    return root;
}

//create post body
function postBody(root, postData){
    //check if the post has img:
    if(postData.imgUrl){
        //post has img:
        var imgPostPhoto = $('<img>', {
            class : 'imgPostPhoto'
        });
        imgPostPhoto.attr('src', postPhotoUrl+post.imgUrl);
        root.postPhoto.append(imgPostPhoto);
    }else{
        //TODO ADD HOLDER POST IMG:
    }
    //post title des
    root.postTitle.html(postData.title);
    root.postDes.html(postData.des);

    return root;
}

//create post footer
function postFooter(root, postData){
    //likes container
    root.postLikes.css('cursor', 'pointer');
    //check if the user loggedIn and already liked the post:
    alreadyLiked = false;
    if(userLoggedIn){
        alreadyLiked = postData.likers.find((liker)=>{
            return liker.id == userInfo.id;
        });
    }
    if(alreadyLiked){
        root.postLikeIcon.html('<i class="fas fa-heart alreadyLikedIcon "> </i>');
    }else{
        root.postLikeIcon.html('<i class="far fa-thumbs-up"></i>');
    }
    //check if the post has likes:
    if(postData.likesCount > 0){
        root.postLikesCount.html(postData.likesCount+' Likes');
    }else{
        root.postLikesCount.html(' Like');
    }

    //comments Toggle in post footer:
    //TODO COMMENTS TOGGLE ON CLICK LISTENER
    root.commentsToggle.css('cursor', 'pointer');
    root.postReplayIcon.html('<i class="far fa-comments"></i>');
    //check if the post has comments:
    if(postData.commentsCount > 0){
        root.postCommentsCount.html(post['commentsCount']+' Comments');
    }else{
        root.postCommentsCount.html('Comment');
    }

    return root;
}

//create post comments section:
function postComments(root, postData, OriginalCommentElements){
    //check if there is a comments:
    if(postData.comments.length > 0){
        //comments container
        root.comments.html('comments'); // add .hide() to hide the section in the future
        // extract the comments array:
        commentsArr = postData.comments
        //loop throw each comment
        commentsArr.forEach((comment)=>{
            //extract the commenter data:
            const commenter = comment.authorInfo;
            //clone elements:
            var commentE = cloneCommentElements(OriginalCommentElements);
            // set  comment elements ids 
            commentE = setCommentElementsIds(commentE, comment);
            log('commentE',commentE.commentHeader.attr('id'));
            //comment Header:
            commentE = commentHeader(commentE, commenter);
            //set comment body:
            commentE.commentBody.html(comment.body);
            //comment footer:
            commentE = commentFooter(commentE, comment);
            //comment  replays  :
            commentE = commentReplays(commentE, comment);

            commentE.commentContainer.attr('hidden', false)
            root.commentsContainer.append(commentE);
        });
    }
    root.comments.append(root.commentsContainer);
    root.comments.attr('hidden', false);
    return root;
}

//clone comment elements:
function cloneCommentElements(commentE){
    const commentEKeys = Object.keys(commentE);
    commentEKeys.forEach((element)=>{
        // Original element with attached data
        commentE[element] = commentE[element].data( "arr", [ 1 ] ),
        $clone = commentE[element].clone( true )
        // Deep copy to prevent data sharing
        .data( "arr", $.extend( [], commentE[element].data( "arr" ) ) );
    })
    return commentE;
}

//commentHeader
function commentHeader(commentE, commenter){
    //check if the commenter has img:
    if(commenter.photoUrl){
        imgCommenterPhoto = $('<img>',{
            class: 'imgCommenterPhoto'
        });
        imgCommenterPhoto.attr('src', userPhotoUrl+commenter.photoUrl);
        commentE.commenterPhoto.append(imgCommenterPhoto);
    }else{
        commentE.commenterPhoto.html('<div class="userIcon"><i class="fas fa-user" style="color:aquamarine;"></i></div>');
    }
    //set commenter Name:
    commentE.commenterName.html(commenter.fname + ' ' + commenter.lname);

    return commentE;
}

//comment footer:
function commentFooter(commentE, comment){
    //check if the user logged in and already liked the comment:
    if(userLoggedIn){
        const alreadyLiked = comment.likers.find((liker)=>{
        return liker.id == userInfo.id;
        });
        if(alreadyLiked){
            commentE.commentLikeIcon.html('<i class="fas fa-heart alreadyLikedIcon "> </i>');
        }
        else{
            commentE.commentLikeIcon.html('<i class="far fa-thumbs-up"></i>');
        }
    }else{
        commentE.commentLikeIcon.html('<i class="far fa-thumbs-up"></i>');
    }
    //TODO ADD ON COMMENT LIKE CLICK LISTENER
    //check if the comment has likes:
    if(comment.likesCount > 0){
        commentE.commentLikesCount.html(comment.likesCount + ' Likes');
    }else{
        commentE.commentLikesCount.html(' Like');
    }

    //comment footer replays:
    commentE.replays.css('cursor', 'pointer');
    //TODO ON REPLAYS CLICK:
    //check if the comment has replays:
    if(comment.replaysCount > 0){
        commentE.commentReplaysCount.html(comment.replaysCount + ' Replays');
    }else{
        commentE.commentReplaysCount.html(' Replay');
    }

    return commentE;
}

//set comment elements ids:
function setCommentElementsIds(commentElements, commentData){
    const commentE = Object.keys(commentElements);
    commentE.forEach(element => {
        commentElements[element].attr('id', commentElements[element].attr('id')+commentData._id);
    });
    return commentElements;
}

//commentReplays
function commentReplays(commentE, comment){
    //TODO COMPLETE THE FUNCTION
    return commentE;
}

