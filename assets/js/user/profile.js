/**
 * page will show the user posts
 * page would be divided by date year month  
 * 
 * todo: 
 * get data from php that's include the user posts
 * post expected data:
 *  authorInfo 
 *  post body, title, des, likes, comments, replays, date, categories to the parent cat, tags
 *  
 * create the custom post card put it inside user posts date range
 * 
 * */

 //get data: 
 const getData = (nextFun) =>{
   $.post('./profile.php', {getData: true}, (data) => {
        nextFun(data);
   }, 'json')
}

getData(createPage);

function createPage(data){
    console.log(data);
}