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
 * 
 */

//get user information:
var userLoggedIn = false;
var userInfo = getUserInfo();


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
        "comments":[],
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
//get post elements
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
        commentsContainer : $('#p_commentsContainer'),
        commentHeader : $('#p_commentHeader'),
        commenterPhoto : $('#p_commenterPhoto'),
        commenterName : $('#p_commenterName'),
        commentBody : $('#p_commentBody'),
        commentFooter : $('#p_commentFooter'),
        commentDate : $('#p_commentDate'),
        commentLikes : $('#p_commentLikes'),
        commentLikeIcon : $('#p_CommentLikeIcon'),
        commentLikesCount : $('#p_commentLikesCount'),
        commentReplayIcon : $('#p_commentReplayIcon'),
        commentReplaysCount : $('#p_commentReplaysCount'),
        replaysContainer : $('#p_replaysContainer'),
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
    };
    return postElements;
}

// create post :
function fillPostData(postData){
    var root = getPostElements();
    
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
    const userPhotoUrl = 'http://localhost:3000/user/profilePhoto?id=';
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
    const postPhotoUrl = 'http://localhost:3000/file/uri?uri=';
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

