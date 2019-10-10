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


$(document).ready(()=>{
   log('user info', userInfo.id);
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
