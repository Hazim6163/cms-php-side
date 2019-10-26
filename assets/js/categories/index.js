//get category id from url if founded
const query = new URLSearchParams(window.location.search);
var qCatId = query.get('id');

//get page data
getUserInfo((userInfo) => {
    //get categories:
    getData(qCatId, (data) => {
        //inflate page:
        inflatePage(data, userInfo);
        //codes todo after create the page:
        documentReadyAndThen();
    })
});

//get data:
function getData(catId, nextFun) {
    $.post('./categories.php', { getData: true, id: catId}, (data) => {
        nextFun(data);
    }, 'json')
}

//function will call after the document is ready:
function documentReadyAndThen(){}

//inflate page:
function inflatePage(data, userInfo){
    switch (data.isSingleCat) {
        case true:
            console.log('single')
            break;
        case false:
            console.log('root')
            break;
        default:
            break;
    }
}
