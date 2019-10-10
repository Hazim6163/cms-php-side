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
    const postHeader = $('<div>',{
        id: 'postHeader'+post._id,
        class: 'postHeader'
    });

    return postHeader;
}

//create post body
function getPostBody(post) {
    const postBody = $('<div>',{
        id: 'postBody'+post._id,
        class: 'postBody'
    });

    return postBody;
}

//create post footer
function getPostFooter(post){
    const postFooter = $('<div>',{
        id: 'postFooter'+post._id,
        class: 'postFooter'
    });

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
        async: true,
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
