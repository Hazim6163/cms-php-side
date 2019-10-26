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
    data.isSingleCat ? inflateCPage(data, userInfo) : inflateRPage(data, userInfo);
}

//inflate root categories page:
function inflateRPage(data, userInfo){
    const pageContainer = $('#pageContainer');

    const wrapper = $('<div>',{
        class: 'rootCatWrapper',
        id: 'rootCatWrapper'
    }).appendTo(pageContainer);

    //append categories to wrapper:
    appendRCatsW(data).appendTo(wrapper);
}

//append root categories to root categories wrapper:
function appendRCatsW(data){
    const container = $('<div>',{
        class: 'rootCatContainer',
        id: 'rootCatContainer'
    });

    //append root categories to root categories container
    appendRCatC(data.rootCats, container);

    return container;
}

//append root categories to root categories container.
function appendRCatC(categories, container){
    categories.forEach(category => {
        //create category container
        const catContainer = htmlE({
            type: 'div', classes: 'catContainer', id: category._id, container: container, onClick: catClick, params: [category]
        });
        //category img container
        if(category.imgUrl){
            const CatImg = htmlE({
                type: 'div', classes: 'catImgContainer', container: 'catContainer'
            });
            catContainer.append(CatImg);
            //create category img:
            createCatImg(category, CatImg);
        }
        //category info container behind the img container
        const catInfo = htmlE({
            type: 'div', classes: 'catInfo', container: catContainer
        });
        catContainer.append(catInfo);
        //create category title:
        createCatTitle(category, catInfo);
        //create category des:
        createCatDes(category, catInfo);
        //create category posts count:
        createCatPostsCount(category, catInfo);
    });
}

//create category title:
/// container : to append to
function createCatTitle(cat, container){
    const data ={
        type: 'div',
        classes: 'catTitle',
        container: container,
        html: cat.title
    };
    const title = htmlE(data);
    return title;
}

//create category img:
/// container : to append to
function createCatImg(cat, container){
    const data ={
        type: 'img',
        classes: 'catImg',
        container: container
    };
    const img = htmlE(data);
    const src = 'http://localhost:3000/file/uri?uri=' + cat.imgUrl
    img.attr('src', src)
    img.attr('width', '300px')
    return img;
}

//create category des:
/// container : to append to
function createCatDes(cat, container){
    const data ={
        type: 'div',
        classes: 'catDes',
        container: container,
        html: cat.des
    };
    const des = htmlE(data);
    return des;
}

//create category posts count:
/// container : to append to
function createCatPostsCount(cat, container){
    const data ={
        type: 'div',
        classes: 'catPostsCount',
        container: container,
        html: 'Posts Count : ' + cat.postsCount
    };
    const pCount = htmlE(data);
    return pCount;
}

//create html element:
function htmlE(data){
    const e = $('<'+ data.type +'>')

    if(data.classes){
        e.addClass(data.classes);
    }
    
    if(data.id){
        e.attr('id', data.id);
    }

    if(data.html){
        e.html(data.html);
    }

    if(data.text){
        e.text(data.text);
    }

    if(data.container){
        e.appendTo(data.container);
    }

    if(data.onClick){
        e.click(()=>{
            data.onClick(data.params)
        });
    }

    return e;
}

//on category click
function catClick(params){
    const cat = params[0];
    console.log(cat._id)
}