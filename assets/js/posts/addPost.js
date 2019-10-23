//get data:
var data;
function getData(nextFun){
    $.post('./add.php', {getData: true}, (data)=>{
        nextFun(data);
    }, 'json')
}

//get user info:
getUserInfo((userInfo) => {
    //get categories:
    getData((data)=>{
        if(!data.postCopy.false){
            //create main page:
            createPage(userInfo, data.categories, data.tags, data.postCopy)
        }else{
            //create main page:
            createPage(userInfo, data.categories, data.tags, undefined)
        }
    })
    
});



//post body editor vars:
var fontColor = '#000000';
var fontSize = '20';
var backgroundColor = '#ffffff';
var type = 'span';
var bold = false;
var italic = false;
var header = false;
var headerLevel = 1;
var textAlign = 'left';
var customizeMenuInflaterOpened = false;
var openedCustomizeMenuType = 'none';
//change the menu position on drag
var menuIsClicked = false;
var mousedown = false;
var mousedown_timer = '';
//version controller:
var docHistory = new Array();
var historyPosition = 0;
var changesArray = new Array();
var changesArrayCurrentPosition = -1;
var currentInChange = false;
var alreadyChangesSaved = false;
var redoArray = new Array();
var redoCurrentPosition = 0;
var isPostCopy = false;
//cursor vars:
var lastSelection;
//html modal:
var htmlModalOpened = false;
//embed modal:
var embedModalOpened = false;
//post tags:
var postTagsArr = new Array();
var lastTagsSearch = new Array();
//toolbar vars:
var toolbarOpened = true;
var toolbarOnRight = false;
//headers :
//headers ids array:
var headersArr = new Array();

/******************* functions  *************/

//main page:
const createPage = (userInfo, categories, tags, postC) => {
    //check if there is post copy : 
    if(postC){
        isPostCopy = true;
        //set the doc history array: //TODO FIX UNDO REDO ISSUE REBUILD SYSTEM
        docHistory = postC.docHistory;
    }
    //page
    const page = $('#pageContainer');

    const postBody = createPostBody(postC);
    //createToolBar
    createToolbar(postBody).appendTo(page);
    //post container
    const postContainer = $('<div>', {
        class: 'postContainer',
        id: 'postContainer'
    }).appendTo(page);
    //create post header 
    postContainer.append(postHeader(postC));
    //post Body:
    postBody.appendTo(postContainer);
    //post body navigation append headers links:
    extractHeadersLinks();
    //editor footer:
    createEditorFooter(categories, tags, userInfo).appendTo(page);
}

//post headers navigation:
function postNav(){
    const navigationContainer = $('<div>',{
        class: 'navigationContainer',
        id: 'navigationContainer'
    }).hide().attr('contenteditable', 'false');

    return navigationContainer;
}



//extract headers containers :
function extractHeadersLinks(){
    const navContainer = $('#navigationContainer');
    //check if there is post headers navigator not appended
    if(navContainer.html() == undefined){
        const postBody = $('#postBody');
        //create post headers navigation:
        postBody.prepend(postNav());
    }

    //clean up the navContainer:
    navContainer.empty();
    
    //get post headers
    const headersArr = $('#postBody h1, h2, h3, h4, h5, h6').toArray();

    const title = $('<div>',{
        class: 'headersNavContainerTitle'
    }).html('Post Navigation:').appendTo(navContainer);

    const container = $('<div>', {
        class: 'headersContainer'
    }).appendTo(navContainer);

    headersArr.forEach((header)=>{
        //scroll position:
        //get page wrapper margin top
        const pageWrapperMargin = $('#pageWrapper').css('margin-top');
        // add to page wrapper margin top the page container padding top
        const topSpace = parseInt(pageWrapperMargin) + 84;
        //get link text:
        const text = header.textContent.replace(':', '');
        //create header link element:
        const hLink = $('<a>', {
            class: 'headerContainer'
        }).text(text).appendTo(container).attr('href', '#'+header.id).click((e)=>{
            e.preventDefault();
            //check if the header in the post body or not:
            const temp = $("#"+header.id);
            if(!temp.html()){
                //header in the post body cant be found:
                //remove header link:
                hLink.remove();
                return;
            }
            //animate scroll to header position + space top margin page wrapper and the page padding top:
            $([document.documentElement, document.body]).animate({
                scrollTop: $("#"+header.id).offset().top - topSpace
            }, 1000);
        });
    })
    //toggle header navigator on links count >< 0 
    if(headersArr.length == 0 ){
        navContainer.hide('fast');
    }else{
        navContainer.show('fast');
    }
}



//TODO FIX CHANGE MENU PLACE ISSUE

//create post header
function postHeader(postC) {
    const pageHeader = $('<div>', {
        class: 'pageHeader',
        id: 'pageHeader'
    });

    //TODO  CREATE POST IMG SECTION

    //post title section
    createPostTitle(postC).appendTo(pageHeader);
    //post description section:
    createPostDes(postC).appendTo(pageHeader);

    return pageHeader;
}

//create post title section;
function createPostTitle(postC) {
    const postTitleContainer = $('<div>', {
        class: 'postTitleSectionContainer',
        id: 'postTitleSectionContainer'
    });

    const postTitle = $('<div>', {
        class: 'postTitle',
        id: 'postTitle'
    }).html('Post Title').appendTo(postTitleContainer).attr('contenteditable', 'true');
    if(isPostCopy){
        if(postC.title != ''){
            postTitle.html(postC.title);
        }
    }

    //create on key up listener to set the place holder:
    postTitle.on('keyup', () => {
        //check if the div is clear:
        if (postTitle.html() === '<br>') {
            postTitle.html('Post Title');

            const range = new Range();
            range.setStart(postTitle.get(0).firstChild, 0);
            range.setEnd(postTitle.get(0).firstChild, 10);

            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }
    });

    //on focus remove default text:
    postTitle.on('focus', () => {
        if (postTitle.html() === 'Post Title') {
            postTitle.html('');
        }

    });
    //set default place holder:
    postTitle.on('focusout', () => {
        if (postTitle.html() === '') {
            postTitle.html('Post Title');
        }

    });


    return postTitleContainer;
}

//create post Description section
function createPostDes(postC) {
    const postDesContainer = $('<div>', {
        class: 'postDesContainer',
        id: 'postDesContainer'
    });

    const postDes = $('<div>', {
        class: 'postDes',
        id: 'postDes'
    }).html('Add Post Description').appendTo(postDesContainer).attr('contenteditable', 'true');
    //check if there is post copy
    if(isPostCopy){
        if(postC.des != ''){
            postDes.html(postC.des);
        }
    }
    //create on key up listener to set the place holder
    postDes.on('keyup', () => {
        if (postDes.html() === '<br>') {
            postDes.html('Add Post Description');

            const range = new Range();
            range.setStart(postDes.get(0).firstChild, 0);
            range.setEnd(postDes.get(0).firstChild, 20);

            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
        }
    });

    //on focus remove default text:
    postDes.on('focus', () => {
        if (postDes.html() === 'Add Post Description') {
            postDes.html('');
        }

    })
    //set default place holder:
    postDes.on('focusout', () => {
        if (postDes.html() === '') {
            postDes.html('Add Post Description');
        }

    })

    return postDesContainer;
}

//create Post Body:
function createPostBody(postC) {
    //version control tool
    docSaver();
    const postBody = $('<div>', {
        class: 'postBody',
        id: 'postBody'
    }).attr('contenteditable', 'true').html('Add Post Body');
    //check if there is post copy
    if(isPostCopy){
        if(postC.body != ''){
            postBody.html(postC.body);
        }
    }

    //create on key up listener to set the place holder
    postBody.on('keyup', (e) => {
        if (postBody.html() === '<br>' || postBody.html() == '') {
            postBody.html('Add Post Body');

            const range = new Range();
            range.setStart(postBody.get(0).firstChild, 0);
            range.setEnd(postBody.get(0).firstChild, 13);

            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            return;
        }
        currentInChange = true;
        alreadyChangesSaved = false;
        $('#toolbarSaveDocTool').removeClass('changesSaved').addClass('rotate');

        //save current cursor position:
        lastSelection = document.getSelection().getRangeAt(0);

        //check for anchors 
        checkBodyAnchors(postBody);

        /*********** auto close () [] {} ************/
        //check parenthesis:
        autoCloseParenthesis();
        //check brackets:
        autoCloseBrackets();
        //check braces:
        autoCloseBraces();

        //handle shift tab:
        if(e.shiftKey && e.keyCode == 9){
            handleShiftTabBodyClick();
        }//on tab key click inside post body:
        else if( e.which == 9 ) {
            handlePostBodyTabClick();
        }

        //check post headers to nav link:
        extractHeadersLinks();

        /******************** colors font shortcuts *********************/
        //check color shortcut:
        checkBodyColorShortcut(postBody);
        //check font size shortcut:
        checkBodyFontSizeShortcut(postBody);
        //check font size color shortcuts::
        checkBodySizeColorShortcut(postBody);
        //background-color shortcut:
        checkBkShortcut(postBody);
    });

    //on focus remove default text:
    postBody.on('focus', () => {
        if (postBody.html() === 'Add Post Body') {
            postBody.html('');
        }
        //save current cursor position:
        lastSelection = document.getSelection().getRangeAt(0);
    })
    //set default place holder
    postBody.on('focusout', () => {
        if (postBody.html() === '') {
            postBody.html('Add Post Body');
        }
    })

    return postBody;
}

//handle shift tab click:
function handleShiftTabBodyClick(){
    const endContainer = lastSelection.endContainer;
    var text = endContainer.textContent;
    //text need to append
    const req = '';
    //get start end cursor index 
    const start = lastSelection.endOffset - 4;
    const end = lastSelection.endOffset;
    try {
        //get last 4 chars:
        target = text.substring(start, end);
        //check if the first 2 chars not spaces then return
        if(target.charAt(0) != ' ' || target.charAt(1) != ' '){
            return;
        }
        //get the white space in this section:
        const regex = new RegExp(/\s/,'g');
        text1 = target.replace(regex, '')
        //push the new text to old text and remove the target section
        const part1 = text.slice(0, start);
        const part2 = text.slice(end, text.length);
        //set end container new text:
        endContainer.textContent = part1 + text1 + part2;
        //focus the end container
        const e = $(endContainer);
        e.trigger('focus');
        //set cursor:
        cursorAtEndElement(e, -part2.length);
    } catch (error) {
        console.log('error\n'+error)
    }
    
}

//handle tab click inside post body
function handlePostBodyTabClick(){
    const endContainer = lastSelection.endContainer;
    var text = endContainer.textContent;
    //text need to append
    const req = '    ';
    //part 1 text before append
    const part1 = text.slice(0, lastSelection.endOffset);
    //part 2 text after append
    const part2 = text.slice(lastSelection.endOffset, text.length);
    //full new text
    text = part1 + req + part2;
    //get end container jquery obj:
    const e = $(endContainer)
    //set end container new text
    endContainer.textContent = text;
    //focus the end container
    e.trigger('focus');
    //set cursor:
    cursorAtEndElement(e, -part2.length);
}

//remove default behavior on tab click
$(document).keydown(function (e) 
{
    var keycode1 = (e.keyCode ? e.keyCode : e.which);
    if (keycode1 == 0 || keycode1 == 9) {
        e.preventDefault();
        e.stopPropagation();
    }
});


//background color shortcut:
//EX: !r:bk background-color: red
//Ex: !1717:bk background-color: #1717
function checkBkShortcut(postBody){
    const pattern = new RegExp(/\!+([a-zA-z0-9]+)+:bk/, 'im');
    var body = postBody.html();
    const match = pattern.exec(body);
    if(!match){
        return;
    }
    //get color part:
    const c = match[1];
    const style = 'background-color: '+extractShortcutColor(c)+'; ';
    const id = getUniqueId();
    
    const req = '<span style="'+style+'" id="'+id+'"> </span>'
    body = body.replace(pattern, req);
    //update post body
    postBody.html(body);
    const e = $('#'+id);
    e.trigger('focus');
    cursorAtEndElement(e);
}

//font size color shortcut: 
//Ex: !r-50:2cz -> color:red, font size: 50px 
//Ex: !171717-20:2cz -> color:#171717, font size: 20px
function checkBodySizeColorShortcut(postBody){
    const pattern = new RegExp(/\!+([a-zA-z0-9]+)+\-+([0-9]+)+:2cz/, 'im');
    var body = postBody.html();
    const match = pattern.exec(body);
    if(!match){
        return;
    }
    //get color part:
    const c = match[1];
    const z = match[2];
    var style = 'font-size: '+z+'px; ';
    style = style + getShortCutSpanStyle(c);
    const id = getUniqueId();
    
    const req = '<span style="'+style+'" id="'+id+'"> </span>'
    body = body.replace(pattern, req);
    //update post body
    postBody.html(body);
    const e = $('#'+id);
    e.trigger('focus');
    cursorAtEndElement(e);
}

//font size body shortcut: !15:z 15px font size
function checkBodyFontSizeShortcut(postBody){
    const pattern = new RegExp(/\!+([0-9]+)+:z/, 'im');
    var body = postBody.html();
    const match = pattern.exec(body);
    if(!match){
        return;
    }
    //get color part:
    const z = match[1];
    const style = 'font-size: '+z+'px;';
    const id = getUniqueId();
    
    const req = '<span style="'+style+'" id="'+id+'"> </span>'
    body = body.replace(pattern, req);
    //update post body
    postBody.html(body);
    const e = $('#'+id);
    e.trigger('focus');
    cursorAtEndElement(e);
}

//colors body shortcuts: !(r - b - g - y- 0 - 171717):c
function checkBodyColorShortcut(postBody){
    const pattern = new RegExp(/\!+([a-zA-z0-9]+)+:c/, 'im');
    var body = postBody.html();
    const match = pattern.exec(body);
    if(!match){
        return;
    }
    //get color part:
    const c = match[1];
    const style = getShortCutSpanStyle(c);
    const id = getUniqueId();
    
    const req = '<span style="'+style+'" id="'+id+'"> </span>'
    body = body.replace(pattern, req);
    //update post body
    postBody.html(body);
    const e = $('#'+id);
    e.trigger('focus');
    cursorAtEndElement(e);
}

//get shortcut span style:
// c : short cut color val
function getShortCutSpanStyle(c){
    var color = extractShortcutColor(c);
    const style = 'color: '+color+';';
    return style;
}

//extract shortcut color:
function extractShortcutColor(c){
    var color;
    switch (c) {
        case 'r':
            color = 'red';
            break;
        case 'b':
            color = 'blue'
            break;
        case 'g':
            color = 'green'
            break;
        case '0':
            color = 'black'
            break;
        case 'y':
            color = 'yellow'
            break;
        default:
            color = '#'+c;
            break;
    }
    return color;
}

//unique string id creator:
function getUniqueId(){
    //get time in millisecond
    var d = new Date();
    d = d.getTime();
    //create chars array
    const chars = new Array();
    chars.push(
        "A","a","B","b","C","c","D","d","E","e","F","f","G","g","H","h","I","i","J","j","K","k","L","l","M","m","N","n","O","o","P","p","Q","q","R","r","S","s","T","t","U","u","V","v","W","w","X","x","Y","y","Z","z"
    );
    //scuffle the datetime with chars
    d = JSON.stringify(d);
    //create id array:
    var id = new Array();
    for (let i = 0; i < d.length; i++) {
        const num = d[i];
        //get divided by 2 numbers:
        if(i%2 == 0){
            id.push(num+1);
            id.push(num+5);
            id.push(num+10);
            var randChar = chars[Math.floor(Math.random()*chars.length)];
            var randChar2 = chars[Math.floor(Math.random()*chars.length)];
            id.push(randChar, randChar2);
        }
        id.push(num);
    }
    //convert id to string:
    var temp = '';
    id.forEach((c)=>{
        temp = temp + c;
    })
    id = temp

    return id;
}

//auto close Braces:
function autoCloseBraces(){
    const pattern = new RegExp(/\{$/, 'im');
    //get current text obj
    const endContainer = lastSelection.endContainer;
    var text = endContainer.textContent;
    const match = pattern.exec(text);
    if(!match){
        return;
    }
    req = '{}';
    text = text.replace(pattern, req);
    endContainer.textContent = text;
    const e = $(endContainer)
    e.trigger('focus');
    cursorAtEndElement(e, -1);
}

//auto close brackets:
function autoCloseBrackets(){
    const pattern = new RegExp(/\[$/, 'im');
    //get current text obj
    const endContainer = lastSelection.endContainer;
    var text = endContainer.textContent;
    const match = pattern.exec(text);
    if(!match){
        return;
    }
    req = '[]';
    text = text.replace(pattern, req);
    endContainer.textContent = text;
    const e = $(endContainer)
    e.trigger('focus');
    cursorAtEndElement(e, -1);
}

//auto close parenthesis:
function autoCloseParenthesis(){
    const pattern = new RegExp(/\($/, 'im');
    //get current text obj
    const endContainer = lastSelection.endContainer;
    var text = endContainer.textContent;
    const match = pattern.exec(text);
    if(!match){
        return;
    }
    req = '()';
    text = text.replace(pattern, req);
    endContainer.textContent = text;
    const e = $(endContainer)
    e.trigger('focus');
    cursorAtEndElement(e, -1);
}

//to match the pattern (link name)[link in the post body]
function checkBodyAnchors(postBody){
    const pattern = new RegExp(/\(([^)]+)\)+\[([^)]+)\]/, 'im')

    var body = postBody.html();
    const match = pattern.exec(body);
    if(!match){
        return;
    }
    //get first part name part:
    const name = match[1];
    //get link part :
    const link = match[2];

    const req = '<a href="'+link+'">'+name+'&nbsp;</a><span id="afterAnchor'+name+link+'"> </span>'
    body = body.replace(pattern, req);
    //update post body
    postBody.html(body);
    const e = $('#afterAnchor'+name+link)
    e.trigger('focus');
    cursorAtEndElement(e);
    
}

//create editor footer:
function createEditorFooter(categories, tags, userInfo){
    const editorFooterContainer = $('<div>',{
        class: 'editorFooterContainer',
        id: 'editorFooterContainer'
    });

    //categories container:
    const chooseCategoryContainer = $('<div>',{
        class: 'chooseCategoryContainer',
        id: 'chooseCategoryContainer'
    }).appendTo(editorFooterContainer).html('Post Category:<br>');
    extractCategories(categories).appendTo(chooseCategoryContainer);

    //tags container:
    const chooseTagsContainer = $('<div>',{
        class: 'chooseTagsContainer',
        id: 'chooseTagsContainer'
    }).appendTo(editorFooterContainer).html('Tags:<br>');
    createTagsContainer(tags).appendTo(chooseTagsContainer);

    const saveButton = $('<div>',{
        class: 'eFSaveBtn',
        id: 'eFSaveBtn'
    }).html('Save').appendTo(editorFooterContainer).click(()=>{
        savePostToServer();
    });


    return editorFooterContainer;
}

//create tags input container:
function createTagsContainer(tags){
    const container = $('<div>',{
        class: 'tagsInputContainer',
        id: 'tagsInputContainer'
    });

    const tagsContainer = $('<div>',{
        class: 'tagsContainer',
        id: 'postTagsContainer'
    }).appendTo(container);

    //add tags form
    const tagsForm = $('<form>',{
        class: 'inputForm'
    }).appendTo(container).attr('autocomplete', 'off');
    //input 
    const tagInput = $('<input>',{
        class: 'tagInput',
        id: 'tagInput'
    }).attr({'type':'text', 'name': 'name'}).appendTo(tagsForm);
    //to get suggests:
    tagInput.on('keyup', ()=>{
        getTagsSuggests(tagInput.val());
    })
    //submit
    const tagSubmit = $('<input>',{
        class: 'tagSubmit'
    }).attr({'type':'submit', 'value': 'Add', 'autocomplete': 'off'}).appendTo(tagsForm);
    //on form submit
    tagsForm.on('submit', (e)=>{
        e.preventDefault();
        //send post request to add tag:
        $.post('./add.php', {tagSubmit: true, name: tagInput.val()}, (tag)=>{
            if(!tag._id){
                //TODO error modal
                return;
            }
            addTag(tag, false);
            tagInput.val('');
        }, 'json')
    })
    //const suggests:
    const suggests = $('<div>',{
        class: 'tagInputSuggests',
        id: 'tagInputSuggests'
    }).appendTo(container).hide();
    tagInput.on('focus', ()=>{
        suggests.show('fast');
    });
    tagInput.on('focusout', ()=>{
        suggests.hide('fast');
    })

    return container;
}

//get tags suggests:
function getTagsSuggests(word){
    //clean up the suggests container:
    const suggests = $('#tagInputSuggests');
    const input = $('#tagInput')
    //check if the word not empty 
    if(!word || word == ''){
        suggests.html('');
        return;
    }
    //replace space with +:
    word = encodeURIComponent(word)
    //send search request:
    $.post('./add.php', {searchTag: true, word: word}, (tags)=>{
        // check if the last result is the same:
        if(JSON.stringify(tags) == JSON.stringify(lastTagsSearch)){
            return;
        }
        //save search result:
        lastTagsSearch = tags;
        //clean up search suggests container:
        suggests.html('');
        //loop throw each tag:
        for (let i = 0; i < tags.length; i++) {
            const tag = tags[i];
            //check if the tag already added:
            var added = false;
            for (let i = 0; i < postTagsArr.length; i++) {
                const at = postTagsArr[i];
                if (tag.name === at){
                    added = true;
                }
            }
            if(added){
                continue;
            }
            //create tag result container
            const tagResult = $('<div>',{
                class: 'tagResultContainer',
                id: tag._id
            }).appendTo(suggests);
            //on tag result click
            tagResult.click(()=>{
                addTag(tag, true);
                input.val('');
                input.trigger('focus');
            })
            tagResult.on('focus', ()=>{
                suggests.show('fast');
            })
            // tag result icon
            const icon = $('<div>', {
                class: 'searchTagResultIcon'
            }).html('<i class="fas fa-tag searchTagIcon"></i>').appendTo(tagResult);
            // tag result name
            const name = $('<div>',{
                class: 'tagResultName'
            }).appendTo(tagResult).html(tag.name);
            // tag result posts count
            const postsCount = $('<div>',{
                class: 'tagResultPostsCount'
            }).appendTo(tagResult).html(tag.postsCount + ' Posts');
        }
    }, 'json')
}

//add tag by search:
function addTag(tag, bySearch){
    //add the tag to post tags array: 
    postTagsArr.push(tag.name);
    //add tag to post tags container:
    const container = $('#postTagsContainer');
    //create tag container
    const tagContainer = $('<div>',{
        class: 'tagContainer'
    }).appendTo(container).click(()=>{
        //on click remove tag from container
        tagContainer.remove();
        //on click remove tag from post array tags:
        postTagsArr = postTagsArr.filter((t)=>{
            return t != tag.name
        });
    });
    //tag icon : 
    const icon = $('<div>', {
        class: 'tagIcon'
    }).html('<i class="fas fa-tag searchTagIcon"></i>').appendTo(tagContainer);
    // tag name
    const name = $('<div>',{
        class: 'tagName'
    }).appendTo(tagContainer).html(tag.name);

    if(bySearch){
        //if by search remove tag from the search result:
        $('#'+tag._id).remove();
    }
}

//extract categories and nested categories:
function extractCategories(categories, nested = false, parentContainer){
    //check if nested: 
    if(nested){
        parentContainer.append(extractCategories(categories));
        return;
    }
    const categoriesGroupContainer = $('<div>',{
        class: 'categoriesGroupContainer'
    });
    categories.forEach((category)=>{
        //filter root categories
        if(!category.parentId){
            //create category container
            const categoryContainer = $('<div>',{
                class: 'rootCategoryContainer',
                id: 'rootCategoryContainer' + category._id
            }).appendTo(categoriesGroupContainer).css('margin-left', '30px');
            //category radio
            const categoryRadio = $('<input type="radio" name="category" value="'+category._id+'">',{
                class: 'categoryRadio',
                id: 'categoryRadio'+category._id
            }).appendTo(categoryContainer);
            //category label
            const label = $('<span>').html(category.title+'<br>');
            categoryContainer.append(label);
            //check if the category has nested categories:
            if(category.nestedCategories.length > 0){
                // edit label
                label.html(category.title);
                // create dropdown;
                const dropDown = $('<span>', {
                    class: 'dropDownIcon'
                }).html('<i class="fas fa-chevron-circle-down"></i><br>');
                categoryContainer.append(dropDown);
                //nested container:
                const nestedCatContainer = $('<div>',{
                    class: 'nestedCatContainer',
                    id: 'nestedCatContainer' + category._id
                }).appendTo(categoryContainer).hide();
                dropDown.click(()=>{
                    nestedCatContainer.toggle('fast');
                });
                //extract nested categories:
                extractNestedCategories(category, nestedCatContainer);
            }
        }
        
    });

    return categoriesGroupContainer;
}

//extract nested categories:
function extractNestedCategories(_category, categoryContainer){
    _category.nestedCategories.forEach((category)=>{
        const container = $('<div>',{
            class: 'categoryContainer',
            id: 'categoryContainer' + category._id
        }).css('margin-left', '30px');
        const categoryRadio = $('<input type="radio" name="category" value="'+category._id+'">',{
            class: 'categoryRadio',
            id: 'categoryRadio'+category._id
        }).appendTo(container);
        const label = $('<span>').html(category.title+'<br>');
        container.append(label);
        categoryContainer.append(container);
        if(category.nestedCategories.length > 0){
            // edit label
            label.html(category.title);
            // create dropdown;
            const dropDown = $('<span>', {
                class: 'dropDownIcon'
            }).html('<i class="fas fa-chevron-circle-down"></i><br>');
            container.append(dropDown);
            //nested container:
            const nestedCatContainer = $('<div>',{
                class: 'nestedCatContainer',
                id: 'nestedCatContainer' + category._id
            }).appendTo(categoryContainer).css('margin-left', '30px').hide();
            dropDown.click(()=>{
                nestedCatContainer.toggle('fast');
            });
            extractNestedCategories(category, nestedCatContainer);
        }
    });
}

//send the post to the server:
function savePostToServer(){
    //get post title :
    const title = $('#postTitle').html();
    const des = $('#postDes').html();
    const body = $('#postBody').html();
    const category = $("input[name='category']:checked").val();
    const tags = getPostTags();
    const showInActivity = 1;
    const img = null;
    //CREATE IMG HOLDER ->> 4
    //CREATE TOGGLE SHOW IN RECENT POSTS ->> 5
    //CREATE ALERT ON NON SELECTED CATEGORY ->> 6 
    // HANDEL POST SAVED ->> 7

    $.post('./add.php', {savePost: true, title: title, des: des, body: body, category: category, tags: tags, showInActivity: showInActivity,  }, (res)=>{
        console.log(res)
    }, 'json')
}

//get post tags before save the post :
function getPostTags(){
    var tags = '';
    for (let i = 0; i < postTagsArr.length; i++) {
        const t = postTagsArr[i];
        if(i == postTagsArr.length-1){
            tags += t ;
            break;
        }
        tags += t + ', ';
    }
    if(tags == ''){
        tags = null
    }

    return tags;
}

//create toolbar
function createToolbar() {
    const toolbarContainer = $('<div>', {
        class: 'toolbarContainer',
        id: 'toolbarContainer'
    });

    //toggle toolbar:
    const toggleBar = $('<div>', {
        class: 'toggleToolBarIconActive toolbar-tool',
        id: 'toggleToolBarBtn'
    }).html('<i class="far fa-eye-slash toggleToolbarIcon"></i>').appendTo(toolbarContainer).click(()=>{
        toggleToolbar();
    });

    const toolsContainer = $('<div>', {
        class: 'toolsContainer',
        id: 'toolsContainer'
    }).appendTo(toolbarContainer);
    const menuContainer = $('<div>', {
        class: 'menuContainer',
        id: 'menuContainer'
    }).appendTo(toolbarContainer);

    //save doc:
    toolbarSaveDocTool().appendTo(toolsContainer);

    //undo:
    toolbarUndoTool().appendTo(toolsContainer);

    //redo:
    toolbarRedoTool().appendTo(toolsContainer);

    //font size:
    toolbarFontSizeTool().appendTo(toolsContainer);

    //font color:
    toolbarFontColorTool().appendTo(toolsContainer);

    //background color:
    toolbarBackgroundColorTool().appendTo(toolsContainer);

    //Heading:
    toolbarHeadingTool().appendTo(toolsContainer);

    //bolding:
    toolbarBoldingTool().appendTo(toolsContainer);

    //italic:
    toolbarItalicTool().appendTo(toolsContainer);

    //ordered list 
    toolbarOrderedList().appendTo(toolsContainer);

    //unordered list :
    toolbarUnorderedList().appendTo(toolsContainer);

    //text-align:
    toolbarTextAlignTool().appendTo(toolsContainer);

    //add html:
    toolbarAddHtmlTool().appendTo(toolsContainer);

    //embed:
    toolbarEmbedTool().appendTo(toolsContainer);

    //on long press move:
    onLongPress(toolbarContainer);

    return toolbarContainer;
}

//minimize toolbar
function toggleToolbar(){
    const toolbarContainer = $('#toolbarContainer');
    const toolsContainer = $('#toolsContainer');
    const toggleBtn = $('#toggleToolBarBtn');

    //hide tools container
    toolsContainer.toggle('fast');
    //apply hide class to toolbar container
    toolbarContainer.toggleClass('toolbarContainerHidden');
    toolbarOpened = !toolbarOpened;
    //change btn content:
    if(toolbarOpened){
        toggleBtn.html('<i class="far fa-eye-slash toggleToolbarIcon"></i>').css('color', 'rosybrown')
    }else{
        toggleBtn.html('<i class="fas fa-ellipsis-h toggleToolbarIcon"></i>').css('color', '#13456f')
    }
}

//embed:
function toolbarEmbedTool(){
    const embedContainer = $('<div>', {
        class: 'embedContainer toolbar-tool',
        id: 'embedContainer'
    }).html('<i class="fas fa-link toolIcon"></i>');

    const items = new Array();

    const embedsContainer = $('<div>', {
        class: 'embedsContainer',
        id: 'embedsContainer'
    });

    const youTubeEmbedTool  = $('<div>', {
        class: 'youTubeEmbedTool toolbar-tool',
        id: 'youTubeEmbedTool'
    }).html('<i class="fab fa-youtube toolIcon"></i>').appendTo(embedsContainer).click(()=>{
        embedToolClick('YouTube');
    });
    const gistEmbedTool  = $('<div>', {
        class: 'gistEmbedTool toolbar-tool',
        id: 'gistEmbedTool'
    }).html('<i class="fab fa-github toolIcon"></i>').appendTo(embedsContainer).click(()=>{
        embedToolClick('gist');
    });
    const imageEmbedTool  = $('<div>', {
        class: 'imageEmbedTool toolbar-tool',
        id: 'imageEmbedTool'
    }).html('<i class="fas fa-image toolIcon"></i>').appendTo(embedsContainer).click(()=>{
        embedToolClick('Image');
    });

    items.push(embedsContainer);

    embedContainer.click(()=>{
        customizeMenuInflater(items, 'embeds')
    })

    return embedContainer;
}

//embed tool click : 
function embedToolClick(eType){
    //check if the modal already opened;
    if(embedModalOpened){
        $('#embedModalContainer').remove();
        //toggle opened:
        embedModalOpened = !embedModalOpened;
        return;
    }
    //create the modal:
    const modalContainer = $('<div>',{
        class: 'embedModalContainer',
        id: 'embedModalContainer'
    });
    //input: 
    const holder = extractHolderMsg(eType);
    const input = $('<div>',{
        class: 'embedModalInput',
        id: 'embedModalInput'
    }).attr('contenteditable', 'true').appendTo(modalContainer).text(holder);
    //submit:
    const submit = $('<div>',{
        class: 'embedModalSubmitBtn',
        id: 'embedModalSubmitBtn'
    }).appendTo(modalContainer).text('Submit').click(()=>{
        submitEmbed(eType);
    });


    //append modal to body:
    $('body').append(modalContainer);
    //toggle modal opened:
    embedModalOpened = !embedModalOpened;
    //close customize menu:
    closeCustomizeMenu2();
    //select holder text:
    const range = new Range();
    const length = input.text().length;
    range.setStart(input.get(0).firstChild, 0);
    range.setEnd(input.get(0).firstChild, length);
    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
}

//to set the input holder:
function extractHolderMsg(eType){
    switch (eType) {
        case 'YouTube':
            return 'video ID';
        case 'gist':
            return 'Ex: https://gist.github.com/Hazim6163/000395f0b608eebece8651bd0ae890f8'
        case 'Image':
            return 'Ex: https://i.imgur.com/0d21RdD.jpg'
        default:
            break;
    }
}

//on submit embed click
function submitEmbed(embedType){
    const inputText = $('#embedModalInput').text();
    var iframe;
    switch (embedType) {
        case 'YouTube':
            iframe = $('<iframe>');
            iframe.attr({
                'width': '560',
                'height': '315',
                'src': 'https://www.youtube.com/embed/'+inputText,
                'frameborder': '0',
                'allow': 'encrypted-media',
                'allowfullscreen':''
            }).css({
                'display': 'block',
                'margin': '16px auto',
                'border-radius': '20px',
                'box-shadow': '0px 0px 3px black'
            });
            insertNewItem('y-iframe', {target: iframe});
            break;
        case 'gist':
            iframe = $('<iframe>');
            iframe.attr({
                'frameborder': '0',
                'scrolling': 'no',
                'seamless': 'seamless',
                'onload': 'resizeIframe(this)',
                'srcdoc': '<html><body><script src="'+inputText+'.js"></script><style type="text/css">.gist .gist-data {} .gist-file{border: 0px !important; padding-bottom: 16px} /** custom style: */.gist .gist-data {  background-color: #171717;  border-bottom: 1px solid #171717;  padding-bottom: 16px;}.gist .highlight {  color: wheat;  background: #171717;}.gist .gist-meta {  color: #171717;  background-color: #171717;}.gist .pl-pds, .gist .pl-s, .gist .pl-s .pl-pse .pl-s1, .gist .pl-sr, .gist .pl-sr .pl-cce, .gist .pl-sr .pl-sra, .gist .pl-sr .pl-sre {  color: #90a21f;}.gist .pl-c1, .gist .pl-s .pl-v {  color: #7ab8ff;}.gist .blob-code-inner {  color: white;}.gist .pl-s .pl-s1, .gist .pl-smi {  color: #ff7878;}html {background-color: #171717;scrollbar-width: thin;scrollbar-color:black#171717; }::-webkit-scrollbar-track {background: #171717; }::-webkit-scrollbar-thumb {background: #000; }::-webkit-scrollbar {width: 10px;}::-webkit-scrollbar-arrow-color{background: gray}.gist .blob-num::before {color: wheat;}.gist .blob-wrapper table {border-collapse:collapse;margin-bottom: 16px;}</style></body></html>'
            });
            iframe.css({
                'display': 'block',
                'width': '70%',
                'margin': '24px auto',
                'border-radius': '20px',
                'box-shadow': '0px 0px 3px black'
            });
            insertNewItem('g-iframe', {target: iframe});
            break;
        case 'Image':
            const image = $('<img>');
            image.attr({
                'src': inputText,
                'frameborder': '0',
                'allow': 'encrypted-media',
                'allowfullscreen':''
            }).css({
                //TODO TAKE HEIGHT WIDTH FROM MODAL
                'max-width': '100%',
                'display': 'block',
                'margin': '16px auto',
                'border-radius': '20px',
                'box-shadow': '0px 0px 3px black'
            });
            insertNewItem('image', {target: image});
            break;
        default:
            break;
    }
    //close modal
    embedToolClick();
}

//resize iframe:
function resizeIframe(obj) {
    obj.style.height = obj.contentWindow.document.body.scrollHeight + 'px';
    obj.style.maxWidth = '90%';
}

//add html section to post body:
function toolbarAddHtmlTool(){
    const addHtmlContainer = $('<div>', {
        class: 'addHtmlContainer toolbar-tool',
        id: 'addHtmlContainer'
    }).html('<i class="fas fa-code toolIcon"></i>');

    addHtmlContainer.click(()=>{
        //create modal 
        addHtmlModal();
    })

    return addHtmlContainer;
}

//add html to post body modal:
function addHtmlModal(){
    //check if the modal already opened;
    if(htmlModalOpened){
        $('#htmlModalContainer').remove();
        //toggle opened:
        htmlModalOpened = !htmlModalOpened;
        return;
    }
    //create the modal:
    const modalContainer = $('<div>',{
        class: 'htmlModalContainer',
        id: 'htmlModalContainer'
    });

    const editorArea = $('<div>', {
        class: 'htmlModalEditorArea',
        id: 'htmlModalEditorArea'
    }).attr('contenteditable', 'true').attr('spellcheck', 'false').appendTo(modalContainer);

    const btnsContainer = $('<div>',{
        class: 'htmlModalBtnsContainer',
        id: 'htmlModalBtnsContainer'
    }).appendTo(modalContainer)

    const addBtn = $('<div>',{
        class: 'htmlModalAddBtn',
        id: 'htmlModalAddBtn'
    }).appendTo(btnsContainer).html('Save').click(()=>{
        saveHtmlToPostBody();
        $('#htmlModalContainer').remove();
        //toggle opened:
        htmlModalOpened = !htmlModalOpened;
    });

    const cancelBtn = $('<div>',{
        class: 'htmlModalCancelBtn',
        id: 'htmlModalCancelBtn'
    }).appendTo(btnsContainer).html('Cancel').click(()=>{
        $('#htmlModalContainer').remove();
        //toggle opened:
        htmlModalOpened = !htmlModalOpened;
    });

    //append to document:
    $('body').append(modalContainer);

    //toggle opened:
    htmlModalOpened = !htmlModalOpened;

    //focus
    editorArea.trigger('focus');
}

//to add html from modal to post body
function saveHtmlToPostBody(){
    const editor = $('#htmlModalEditorArea');
    const newDivTarget = $('<div>',{
        class: 'newDivTarget'
    }).html(editor.text());
    const extraData = {
        'target': newDivTarget,
    };

    //insert target to post body
    insertNewItem('customHtml', extraData);
}

//text align tool:
function toolbarTextAlignTool(){
    const textAlignContainer = $('<div>', {
        class: 'textAlignContainer toolbar-tool',
        id: 'textAlignContainer'
    }).html('<i class="fas fa-align-center toolIcon"></i>');

    const menuItems = new Array();

    const positionsContainer = $('<div>', {
        class: 'textAlignPositionsContainer',
        id: 'textAlignPositionsContainer'
    });

    //left align:
    const alignLeft = $('<div>', {
        class: 'textAlignTool textAlign-tool',
        id: 'textAlignLeftAlign'
    }).html('<i class="fas fa-align-left toolIcon"></i>').appendTo(positionsContainer).click(()=>{
        textAlign = 'left';
        onTextAlignToolClick();
    });
    //center align:
    const alignCenter = $('<div>', {
        class: 'textAlignTool textAlign-tool',
        id: 'textAlignCenterAlign'
    }).html('<i class="fas fa-align-center toolIcon"></i>').appendTo(positionsContainer).click(()=>{
        textAlign = 'center';
        onTextAlignToolClick();
    });
    //right align:
    const alignRight = $('<div>', {
        class: 'textAlignTool textAlign-tool',
        id: 'textAlignRightAlign'
    }).html('<i class="fas fa-align-right toolIcon"></i>').appendTo(positionsContainer).click(()=>{
        textAlign = 'right';
        onTextAlignToolClick();
    });

    //append to menu items 
    menuItems.push(positionsContainer);
    //open items menu on click:
    textAlignContainer.click(()=>{
        customizeMenuInflater(menuItems, 'text-align');
    })

    return textAlignContainer;
}

//text align tools:
function onTextAlignToolClick(){
   //check if there is selected text
   const selection = checkIfSelection();

   if (selection.isSelected) {
       //there is selected text
       updateSelection(selection.selection, 'text-align');
   } else {
       //insert new item to post body
       insertNewItem('div');
   } 
}

//unordered list:
function toolbarUnorderedList() {
    const unorderedListContainer = $('<div>', {
        class: 'unorderedListContainer toolbar-tool',
        id: 'unorderedListContainer'
    }).html('<i class="fas fa-list-ul toolIcon"></i>');

    unorderedListContainer.click(() => {
        onUnorderedToolClick();
    })

    return unorderedListContainer;
}

//on unordered list click:
function onUnorderedToolClick() {
    //check if there is selected text
    const selection = checkIfSelection();

    if (selection.isSelected) {
        //there is selected text
        updateSelection(selection.selection, 'unordered');
    } else {
        //insert new item to post body
        insertNewItem('ul');
    }
}

//ordered list tool:
function toolbarOrderedList() {
    const orderedListContainer = $('<div>', {
        class: 'orderedListContainer toolbar-tool',
        id: 'orderedListContainer'
    }).html('<i class="fas fa-list-ol" toolIcon></i>');

    orderedListContainer.click(() => {
        onOrderedToolClick();
    })

    return orderedListContainer;
}

function onOrderedToolClick() {
    //check if there is selected text
    const selection = checkIfSelection();

    if (selection.isSelected) {
        //there is selected text
        updateSelection(selection.selection, 'ordered');
    } else {
        //insert new item to post body
        insertNewItem('ol');
    }
}

//undo tool
function toolbarUndoTool() {
    const undoContainer = $('<div>', {
        class: 'toolbarUndoTool toolbar-tool',
        id: 'toolbarUndoTool'
    }).html('<i class="fas fa-undo toolIcon"></i>');

    undoContainer.click(() => {
        undo();
    })

    return undoContainer;
}

//undo function
function undo() {
    //get post body:
    const postBody = $('#postBody');

    changesArray = docHistory;
    changesArrayCurrentPosition = changesArray.length - 1;
    //check if there is changes:
    if (changesArray.length < 1) {
        //there is no changes
        return;
    }
    // go step to back:
    changesArrayCurrentPosition--;
    //get change obj
    var changeObj = changesArray[changesArrayCurrentPosition];
    //check if the obj is valid
    if (!changeObj) {
        changesArrayCurrentPosition = changesArray.length;
        changesArrayCurrentPosition = changesArrayCurrentPosition;
        changesArrayCurrentPosition--;
    }

    //get change obj
    changeObj = changesArray[changesArrayCurrentPosition];
    if (changesArray.length != 0) {
        redoArray.push({ position: redoCurrentPosition++, change: postBody.html() });
    }
    //change obj founded:
    postBody.html(changeObj.change);
    changesArray.pop();
}

//redo tool
function toolbarRedoTool() {
    const redoContainer = $('<div>', {
        class: 'toolbarRedoTool toolbar-tool',
        id: 'toolbarRedoTool'
    }).html('<i class="fas fa-redo toolIcon"></i>');

    redoContainer.click(() => {
        redo();
    })

    return redoContainer;
}

//redo function
function redo() {
    //get post body:
    const postBody = $('#postBody');

    //check if there is redos:
    if (redoArray.length < 1) {
        //there is no redos
        return;
    }
    // go to the end of the array:
    redoCurrentPosition = redoArray.length;
    //get change obj
    var changeObj = redoArray[redoCurrentPosition];
    //check if the obj is valid
    if (!changeObj) {
        redoCurrentPosition = redoArray.length - 1;
    }

    //get change obj
    changeObj = redoArray[redoCurrentPosition];
    // changesArray.push({position: changesArrayCurrentPosition++, change: postBody.html()});
    //change obj founded:
    postBody.html(changeObj.change);
    if (redoArray.length != 0) {
        changesArray.push(changeObj);
    }
    redoArray.pop();
}

//save doc tool:
function toolbarSaveDocTool() {
    const saveDocTool = $('<div>', {
        class: 'saveDocTool toolbar-tool',
        id: 'toolbarSaveDocTool'
    }).html('<i class="fas fa-cloud-upload-alt toolIcon"></i>');

    saveDocTool.click(() => {
        docSave();
    })

    return saveDocTool;
}

//save doc:
function docSave() {
    const postBody = $('#postBody');
    const change = postBody.html();
    changesArrayCurrentPosition++;
    changesArray.push({ position: changesArrayCurrentPosition, change: change });
    docHistory.push({ position: historyPosition++, change: change });
    alreadyChangesSaved = true;
    $('#toolbarSaveDocTool').addClass('changesSaved').removeClass('rotate');
}

//save the doc on change every 1s:
function docSaver() {
    var postBody;
    setInterval(() => {
        if (currentInChange || alreadyChangesSaved) {
            currentInChange = false;
            return
        }
        postBody = $('#postBody');
        const change = postBody.html();
        changesArrayCurrentPosition++;
        changesArray.push({ position: changesArrayCurrentPosition, change: change });
        docHistory.push({ position: historyPosition++, change: change });
        alreadyChangesSaved = true;
        $('#toolbarSaveDocTool').addClass('changesSaved').removeClass('rotate');
        //get post title description:
        title = $('#postTitle').text();
        des = $('#postDes').text();
        //send save copy to php:
        $.post('./add.php', {savePostCopy: true, title: title, des: des, body: postBody.html(), docHistory: docHistory}, (res)=>{
            //alert post saved
        }, 'json')
    }, 1000);
}

//toolbar italic tool:
function toolbarItalicTool() {
    const italicContainer = $('<div>', {
        class: 'toolbarItalicTool toolbar-tool',
        id: 'toolbarItalicTool'
    }).html('<i class="fas fa-italic toolIcon"></i>');

    italicContainer.click(() => {
        toggleItalic();
        italicContainer.toggleClass('toggleTool');
    })

    return italicContainer;
}

//toggle italic:
function toggleItalic() {
    italic = !italic;
    //check if there is selected text
    const selection = checkIfSelection();

    if (selection.isSelected) {
        //there is selected text
        updateSelection(selection.selection, 'italic', { italic: italic });
    } else {
        //insert new item to post body
        insertNewItem('span');
    }
}

//toolbar bolding tool
function toolbarBoldingTool() {
    const boldingContainer = $('<div>', {
        class: 'toolbarBoldingTool toolbar-tool',
        id: 'toolbarBoldingTool'
    }).html('<i class="fas fa-bold toolIcon"></i>');

    boldingContainer.click(() => {
        toggleBold();
        boldingContainer.toggleClass('toggleTool');
    })

    return boldingContainer;
}

//toggle bold:
function toggleBold() {
    //toggle bold
    bold = !bold;
    //check if there is selected text
    const selection = checkIfSelection();

    if (selection.isSelected) {
        //there is selected text
        updateSelection(selection.selection, 'bolding', { bold: bold });
    } else {
        //insert new item to post body
        insertNewItem('span');
    }
}

//toolbar heading tool:
function toolbarHeadingTool() {
    const headingContainer = $('<div>', {
        class: 'toolbarHeadingTool toolbar-tool',
        id: 'toolbarHeadingTool'
    }).html('<i class="fas fa-heading toolIcon"></i>');

    const itemsArray = new Array();

    for (let index = 6; index >= 1; index--) {
        itemsArray.push($('<h' + index + '>', {
            class: 'headerTool'
        }).click(() => {
            header = true;
            headerLevel = index;
            onHeaderItemClick(headerLevel);
        }).html('H' + index).css('text-align', 'center'));
    }

    headingContainer.click(() => {
        customizeMenuInflater(itemsArray, 'heading');
    })

    return headingContainer;
}

//on header item click:
function onHeaderItemClick(lvl) {
    //check if there is selected text
    const selection = checkIfSelection();

    if (selection.isSelected) {
        //there is selected text
        updateSelection(selection.selection, 'heading', { level: lvl });
    } else {
        //insert new item to post body
        type = 'h' + lvl;
        insertNewItem(type);
    }
}

//toolbar Font color tool
function toolbarFontColorTool() {
    const fontColorContainer = $('<div>', {
        class: 'toolbarFontColorTool toolbar-tool',
        id: 'toolbarFontColorTool'
    }).html('<i class="fas fa-tint toolIcon"></i>');

    //create the color list :
    const itemsArray = new Array();

    const platesContainer = $('<div>', {
        class: 'platesColorContainer',
        id: 'platesColorContainer'
    });

    const colorsPlates = extractColors();
    //loop throw each plate
    colorsPlates.forEach((plate) => {
        //get plate colors icons
        const plateArr = plate.children();
        for (let index = 0; index < plateArr.length; index++) {
            //get color icon jquery obj
            const element = $(plateArr[index]);
            //set colorIcon css class
            element.addClass('colorIcon');
            //set on click listener
            element.click(() => {
                fontColor = element.css('background-color');
                onFontColorIconClick();
            })
        }
        //append plate to plates container:
        platesContainer.append(plate);
    })


    itemsArray.push(platesContainer);
    fontColorContainer.click(() => {
        customizeMenuInflater(itemsArray, 'font-color');
    })


    return fontColorContainer;
}

//toolbar background-color: 
function toolbarBackgroundColorTool() {
    const backgroundColorContainer = $('<div>', {
        class: 'toolbarBackgroundColorTool toolbar-tool',
        id: 'toolbarBackgroundColorTool'
    }).html('<i class="fas fa-highlighter toolIcon"></i>');

    //create the color list :
    const itemsArray = new Array();

    const platesContainer = $('<div>', {
        class: 'platesColorContainer',
        id: 'platesColorContainer'
    });

    const colorsPlates = extractColors();
    //loop throw each plate
    colorsPlates.forEach((plate) => {
        //get plate colors icons
        const plateArr = plate.children();
        for (let index = 0; index < plateArr.length; index++) {
            //get color icon jquery obj
            const element = $(plateArr[index]);
            //set colorIcon css class
            element.addClass('colorIcon');
            //set on click listener
            element.click(() => {
                backgroundColor = element.css('background-color');
                onBackGroundColorIconClick();
            })
        }
        //append plate to plates container:
        platesContainer.append(plate);
    })


    itemsArray.push(platesContainer);
    backgroundColorContainer.click(() => {
        customizeMenuInflater(itemsArray, 'background-color');
    })

    return backgroundColorContainer;
}

//on background color icon click
function onBackGroundColorIconClick() {
    //check if there is selected text
    const selection = checkIfSelection();

    if (selection.isSelected) {
        //there is selected text
        updateSelection(selection.selection, 'background-color');
    } else {
        // no selected text insert new item to post body
        insertNewItem('span');
    }
}

//extract Colors:
function extractColors() {
    const colors = new Array();

    //plat_1
    const plat_1 = $('<div>', {
        class: 'colorPlat',
        id: 'colorPlat_1'
    });
    const plat_1Arr = new Array();
    plat_1Arr.push('#000000');
    plat_1Arr.push('#252525');
    plat_1Arr.push('#ff0000');
    plat_1Arr.push('#fff457');
    plat_1Arr.push('#66ff00');
    plat_1Arr.push('#0000ff');
    plat_1Arr.push('#ffffff');
    plat_1Arr.forEach((color) => {
        plat_1.append($('<div>').css({ 'background-color': color }));
    });
    colors.push(plat_1);

    //plat1
    const plat1 = $('<div>', {
        class: 'colorPlat',
        id: 'colorPlat1'
    });
    const plat1Arr = new Array();
    plat1Arr.push('rgb(70, 0, 0)');
    plat1Arr.push('rgb(122, 0, 0)');
    plat1Arr.push('rgb(190, 0, 0)');
    plat1Arr.push('rgb(255, 0, 0)');
    plat1Arr.push('rgb(255, 41, 41)');
    plat1Arr.push('rgb(255, 71, 71)');
    plat1Arr.push('rgb(255, 114, 114)');
    plat1Arr.forEach((color) => {
        plat1.append($('<div>').css({ 'background-color': color }));
    });
    colors.push(plat1);

    //plat2
    const plat2 = $('<div>', {
        class: 'colorPlat',
        id: 'colorPlat2'
    });
    const plat2Arr = new Array();
    plat2Arr.push('#5a2400');
    plat2Arr.push('#923a00');
    plat2Arr.push('#ce5200');
    plat2Arr.push('#ff6600');
    plat2Arr.push('#ff791f');
    plat2Arr.push('#ff8c40');
    plat2Arr.push('#ffa365');
    plat2Arr.forEach((color) => {
        plat2.append($('<div>').css({ 'background-color': color }));
    });
    colors.push(plat2);

    /* plat3 */
    const plat3 = $('<div>', {
        class: 'colorPlat',
        id: 'colorPlat3'
    });
    const plat3Arr = new Array();
    plat3Arr.push('#362b00');
    plat3Arr.push('#9b7c00');
    plat3Arr.push('#dbaf00');
    plat3Arr.push('#ffcc00');
    plat3Arr.push('#fff457');
    plat3Arr.push('#fff78e');
    plat3Arr.push('#fffabb');
    plat3Arr.forEach((color) => {
        plat3.append($('<div>').css({ 'background-color': color }));
    });
    colors.push(plat3);

    /* plat5 */
    const plat5 = $('<div>', {
        class: 'colorPlat',
        id: 'colorPlat5'
    });
    const plat5Arr = new Array();
    plat5Arr.push('#122c00');
    plat5Arr.push('#358500');
    plat5Arr.push('#52cc00');
    plat5Arr.push('#66ff00');
    plat5Arr.push('#9aff57');
    plat5Arr.push('#b2ff7f');
    plat5Arr.push('#c4ff9d');
    plat5Arr.forEach((color) => {
        plat5.append($('<div>').css({ 'background-color': color }));
    });
    colors.push(plat5);

    /* plat7 */
    const plat7 = $('<div>', {
        class: 'colorPlat',
        id: 'colorPlat7'
    });
    const plat7Arr = new Array();
    plat7Arr.push('#003515');
    plat7Arr.push('#008636');
    plat7Arr.push('#00bd4b');
    plat7Arr.push('#00ff66');
    plat7Arr.push('#2dff81');
    plat7Arr.push('#49ff92');
    plat7Arr.push('#80ffb3');
    plat7Arr.forEach((color) => {
        plat7.append($('<div>').css({ 'background-color': color }));
    });
    colors.push(plat7);

    /* plat8 */
    const plat8 = $('<div>', {
        class: 'colorPlat',
        id: 'colorPlat8'
    });
    const plat8Arr = new Array();
    plat8Arr.push('#002e25');
    plat8Arr.push('#008167');
    plat8Arr.push('#00cca3');
    plat8Arr.push('#00ffcc');
    plat8Arr.push('#4affdb');
    plat8Arr.push('#81ffe6');
    plat8Arr.push('#acffee');
    plat8Arr.forEach((color) => {
        plat8.append($('<div>').css({ 'background-color': color }));
    });
    colors.push(plat8);

    /* plat9 */
    const plat9 = $('<div>', {
        class: 'colorPlat',
        id: 'colorPlat9'
    });
    const plat9Arr = new Array();
    plat9Arr.push('#00252e');
    plat9Arr.push('#006e8a');
    plat9Arr.push('#00a0c8');
    plat9Arr.push('#00ccff');
    plat9Arr.push('#28d4ff');
    plat9Arr.push('#55ddff');
    plat9Arr.push('#81e6ff');
    plat9Arr.forEach((color) => {
        plat9.append($('<div>').css({ 'background-color': color }));
    });
    colors.push(plat9);

    /* plat10 */
    const plat10 = $('<div>', {
        class: 'colorPlat',
        id: 'colorPlat10'
    });
    const plat10Arr = new Array();
    plat10Arr.push('#00193f');
    plat10Arr.push('#003c95');
    plat10Arr.push('#004fc5');
    plat10Arr.push('#0066ff');
    plat10Arr.push('#297eff');
    plat10Arr.push('#4891ff');
    plat10Arr.push('#6da8ff');
    plat10Arr.forEach((color) => {
        plat10.append($('<div>').css({ 'background-color': color }));
    });
    colors.push(plat10);

    /* plat11 */
    const plat11 = $('<div>', {
        class: 'colorPlat',
        id: 'colorPlat11'
    });
    const plat11Arr = new Array();
    plat11Arr.push('#000033');
    plat11Arr.push('#00008b');
    plat11Arr.push('#0000cc');
    plat11Arr.push('#0000ff');
    plat11Arr.push('#2727ff');
    plat11Arr.push('#4a4aff');
    plat11Arr.push('#8181ff');
    plat11Arr.forEach((color) => {
        plat11.append($('<div>').css({ 'background-color': color }));
    });
    colors.push(plat11);

    /* plat12 */
    const plat12 = $('<div>', {
        class: 'colorPlat',
        id: 'colorPlat12'
    });
    const plat12Arr = new Array();
    plat12Arr.push('#13002f');
    plat12Arr.push('#31007a');
    plat12Arr.push('#5100ca');
    plat12Arr.push('#6600ff');
    plat12Arr.push('#7c25ff');
    plat12Arr.push('#8f44ff');
    plat12Arr.push('#b787ff');
    plat12Arr.forEach((color) => {
        plat12.append($('<div>').css({ 'background-color': color }));
    });
    colors.push(plat12);

    /* plat13 */
    const plat13 = $('<div>', {
        class: 'colorPlat',
        id: 'colorPlat13'
    });
    const plat13Arr = new Array();
    plat13Arr.push('#270031');
    plat13Arr.push('#760094');
    plat13Arr.push('#9b00c2');
    plat13Arr.push('#cc00ff');
    plat13Arr.push('#d633ff');
    plat13Arr.push('#df61ff');
    plat13Arr.push('#ea97ff');
    plat13Arr.forEach((color) => {
        plat13.append($('<div>').css({ 'background-color': color }));
    });
    colors.push(plat13);

    /* plat14 */
    const plat14 = $('<div>', {
        class: 'colorPlat',
        id: 'colorPlat14'
    });
    const plat14Arr = new Array();
    plat14Arr.push('#3b0030');
    plat14Arr.push('#940076');
    plat14Arr.push('#c2009b');
    plat14Arr.push('#ff00cc');
    plat14Arr.push('#ff21d3');
    plat14Arr.push('#ff57dd');
    plat14Arr.push('#ff82e6');
    plat14Arr.forEach((color) => {
        plat14.append($('<div>').css({ 'background-color': color }));
    });
    colors.push(plat14);


    /* plat15 */
    const plat15 = $('<div>', {
        class: 'colorPlat',
        id: 'colorPlat15'
    });
    const plat15Arr = new Array();
    plat15Arr.push('#3d0018');
    plat15Arr.push('#7e0032');
    plat15Arr.push('#c0004d');
    plat15Arr.push('#ff0066');
    plat15Arr.push('#ff2f82');
    plat15Arr.push('#fd5196');
    plat15Arr.push('#ff89b8');
    plat15Arr.forEach((color) => {
        plat15.append($('<div>').css({ 'background-color': color }));
    });
    colors.push(plat15);

    return colors;
}

//on color icon click
function onFontColorIconClick() {
    //check if there is selected text
    const selection = checkIfSelection();

    if (selection.isSelected) {
        //there is selected text
        updateSelection(selection.selection, 'font-color');
    } else {
        // no selected text insert new item to post body
        insertNewItem('span');
    }
}

//toolbarFontSizeTool
function toolbarFontSizeTool() {
    const fontSizeContainer = $('<div>', {
        class: 'toolbarFontSizeTool toolbar-tool',
        id: 'toolbarFontSizeTool'
    }).html('<i class="material-icons toolIcon">format_size</i>');

    //inflate list 8-32: 
    const itemsArray = new Array();
    for (let index = 12; index <= 32; index += 2) {
        if (index > 12) {
            index += 2;
        }
        //create list item: 
        const temp = $('<span>', {
            class: 'fontSizeMenuItem',
            id: 'fontSizeMenuItem' + index
        }).css('font-size', index + 'px').html(index + 'px');

        //on the list item click
        temp.click(() => {
            fontSize = index;
            onFontPropClick();
        });

        itemsArray.push(
            $('<div>', {
                class: 'fontSizeMenuItemContainer',
                id: 'fontSizeMenuItemContainer' + index
            }).html(temp)
        );
    }

    //custom font size:
    const customFontSizeContainer = $('<div>', {
        class: 'customFontSizeContainer',
        id: 'customFontSizeContainer'
    });
    const customFontSizeI = $('<input>', {
        class: 'customFontSizeI',
        id: 'customFontSizeI'
    }).attr('placeholder', '18').appendTo(customFontSizeContainer);
    const customFontSizeIPx = $('<div>', {
        class: 'customFontSizeIPx',
        id: 'customFontSizeIPx'
    }).html('px').appendTo(customFontSizeContainer);
    const customFontSizeSubmit = $('<div>', {
        class: 'customFontSizeSubmit',
        id: 'customFontSizeSubmit'
    }).html('Submit').appendTo(customFontSizeContainer);
    customFontSizeSubmit.click(() => {
        setCustomFontSize();
    });
    itemsArray.push(customFontSizeContainer);

    fontSizeContainer.click(() => {
        customizeMenuInflater(itemsArray, 'font-size');
    })

    return fontSizeContainer;
}

//set custom font size:
function setCustomFontSize() {
    const val = parseInt($('#customFontSizeI').val(), 10);
    if (!Number.isInteger(val)) {
        return;
    }
    //set font size:
    fontSize = val;
    onFontPropClick();
}

//set font size property item clicked:
function onFontPropClick() {
    //check if there is selected text
    const selection = checkIfSelection();

    if (selection.isSelected) {
        //there is selected text
        updateSelection(selection.selection, 'font-size');
    } else {
        // no selected text insert new item to post body
        insertNewItem('span');
    }
}

//cursor at end setter:
function cursorEndSetter() {
    //get the last Element :
    var lastElement = $(type).last();
    var p;
    //check if there is new element : 
    if (!lastElement.html()) {
        //there is no new item just move the cursor to the end of the post body:
        lastElement = $('#postBody');
        p = $('#postBody').html().length;
    } else {
        lastElement = $(type).last();
        p = lastElement.html().length;
    }
    const range = new Range();
    range.setStart(lastElement.get(0).firstChild, p);
    range.setEnd(lastElement.get(0).firstChild, p);

    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
}

//menu inflater: 
function customizeMenuInflater(items, menuType) {

    //check if the menu obj already created:
    if (!$('#customizeMenu').html()) {
        //inflate menu for first time:
        $('#menuContainer').append(
            $('<div>', {
                class: 'customizeMenu',
                id: 'customizeMenu'
            })
        );
    }

    if (customizeMenuInflaterOpened) {
        //menu already opened:
        //check if the opened menu is the same:
        if (menuType === openedCustomizeMenuType) {
            //opened menu is the same of the requested menu:
            //hide the menu:
            closeCustomizeMenu();
            return;
        }
        //opened menu is other than requested menu:
        //clean up the menu container:
        $('#customizeMenu').remove();
        //inflate new menu 
        customizeMenuInflaterOpened = false;
        customizeMenuInflater(items, menuType);
        return;
    }
    items.forEach((item) => {
        $('#customizeMenu').append(item.clone(true));
    });
    openedCustomizeMenuType = menuType;
    customizeMenuInflaterOpened = true;


}

//to close the customize menu:
function closeCustomizeMenu() {
    $('#customizeMenu').toggle('fast');
    $('#customizeMenu').remove();
    openedCustomizeMenuType = 'none';
    customizeMenuInflaterOpened = false;
    //set cursor inside the Post Body after hide the menu:
    cursorEndSetter();
}

//close the customize menu without move the cursor:
function closeCustomizeMenuWithoutMoveCursor() {
    $('#customizeMenu').toggle('fast');
    $('#customizeMenu').remove();
    openedCustomizeMenuType = 'none';
    customizeMenuInflaterOpened = false;
}

//long muse click listener on toolbar to move:
function onLongPress(element) {
    //set mouse click timeout to move
    element.mousedown(function (e) {
        mousedown = true;
        mousedown_timer = setTimeout(function () {
            if (mousedown) {
                menuIsClicked = true;
            }
        }, 200);
    }).mouseup(function (e) {
        mousedown = false;
        clearTimeout(mousedown_timer);
    });

    //remove menu clicked on mouse up:
    element.on('mouseup', () => {
        menuIsClicked = false;
    })

    document.addEventListener('mousemove', onMouseUpdate, false);
    function onMouseUpdate(e) {
        if (menuIsClicked) {
            element.css({
                'left': getToolbarXPosition(e, element),
                'top': getToolbarYPosition(e, element)
            });
        }
    }
}

//get x position for tool bar:
function getToolbarXPosition(e, element){
    var x; // present element left position
    var saveX = 5 // to be sure the cursor is in the element
    const viewPortWidth = $( window ).width();
    var fromRightMargin = 52;

    //check if the -x out the page
    if(e.pageX < 15){
        x = 0;
        //set element width to 50px
        element.width('50');
        //apply pinned to left class
        element.addClass('toolbarToLeft')
        return x;
    }

    //check if the +x out page:
    if(e.pageX > viewPortWidth - 50){
        //set element width to 50px
        element.width('70');
        //open tool bar if closed
        if(!toolbarOpened){
            toggleToolbar();
            toolbarOpened = true;
        }
        x = viewPortWidth - 50 - fromRightMargin;
        element.addClass('toolbarToRight')
        return x;
    }

    // x is on the page 
    x = e.pageX - saveX;
    //remove classes right left
    element.removeClass('toolbarToRight')
    element.removeClass('toolbarToLeft')
    //remove margin:
    element.css('margin-left', '0px')
    if(toolbarOpened){
        element.width('25%');
    }else{
        element.width('auto');
    }

    return x ;
}

//get y position for toolbar:
function getToolbarYPosition(e, element){
    var y = e.pageY - 15
    return y;
}

//insert new Item to post body:
function insertNewItem(_type, extraData) {
    type = _type;
    //set type:
    //add new element to post body:
    var newElement;
    if (headerChecker()) {
        //get unique id :
        const id = getUniqueId();
        newElement = $('<' + type + '>').attr('id', id).css(getStyleCssProp());
    } else if (type == 'span') {
        newElement = $('<span>').css(getStyleCssProp());
    } else if (type == 'ol') {
        newElement = $('<ol>').css(getStyleCssProp('list'));
        const liElement = $('<li>').appendTo(newElement);
    } else if (type == 'ul') {
        newElement = $('<ul>').css(getStyleCssProp('list'));
        const liElement = $('<li>').appendTo(newElement);
    } else if (type == 'div') {
        newElement = $('<div>').css(getStyleCssProp('div'));
    } else if (type == 'customHtml') {
        const target = extraData.target;
        newElement = target;
    } else if (type == 'y-iframe' || type == 'image' || type == 'g-iframe') {
        const target = extraData.target;
        newElement = target;
    }

    appendToCurrentCursor(newElement);
    return;
}

//header checker:
function headerChecker() {
    var isHeader = false;
    if (
        type == 'h1' || type == 'h2' ||
        type == 'h3' || type == 'h4' ||
        type == 'h5' || type == 'h6'
    ) {
        isHeader = true;
    }

    return isHeader;
}

//remove br from the post body:
function removeBrFromElement(element) {
    //remove <br>
    const html = element.html();
    element.html(html.replace(/<br>/g, ''));
}

//append element to last child
function appendToLastChild2(element, nested = true) {
    //get post body element
    const postBody = $('#postBody');
    //remove place holder and br:
    postBodyCleanUp();

    const targetElement = getLastNestedChild(postBody.get(0));

    //append the element to the last child:
    $(targetElement).append(element);

    //close menu
    closeCustomizeMenu2();
    //check if the cursor will be at the end of the element children:
    if (nested) {
        element = getLastNestedChild(element.get(0));
    }
    //set cursor inside the New element:
    cursorAtStartElement(element);
}

//get the last nested child of the element:
function getLastNestedChild(element) {
    var temp = element.lastElementChild;
    while (temp) {
        element = temp;
        temp = temp.lastElementChild;
    }
    return element;
}

//remove br and the place holder from the post body
function postBodyCleanUp() {
    //remove place holder:
    const postBody = $('#postBody');
    if (postBody.get(0).innerText == 'Add Post Body') {
        postBody.get(0).innerText = '';
    }
    //remove br from post body:
    removeBrFromElement(postBody);
}

//append element to the current cursor:
// nested : to set the cursor at the end of the last child Element
function appendToCurrentCursor(element, nested = true) {
    //check if there is a valid selection:
    if (!lastSelection) {
        appendToLastChild2(element, nested);
        return;
    }
    //get selection range:
    const selectionRange = lastSelection;
    //insert new element
    selectionRange.insertNode(element.get(0));
    //close menu
    closeCustomizeMenu2();
    //check if the cursor will be at the end of the element children:
    if (nested) {
        element = getLastNestedChild(element.get(0));
    }

    //cursor setter:
    cursorAtEndElement(element);

}

// to close the customize menu and set the cursor inside the element:
function closeCustomizeMenu2() {
    $('#customizeMenu').toggle('fast');
    $('#customizeMenu').remove();
    openedCustomizeMenuType = 'none';
    customizeMenuInflaterOpened = false;
}

// to set the cursor inside the element:
function cursorAtEndElement(element, translate = 0) {
    //convert element to jquery if not:
    if (!element.jquery) { element = $(element) }
    //get element text
    var innerText = element.get(0).innerText;
    //check if the element is text element:
    if(!innerText){
        innerText = element.get(0).textContent;
    }
    //get element text range:
    const length = innerText.length;
    //check if the element has text first child or not 
    if(element.get(0).firstChild){
        element = element.get(0).firstChild;
        element = $(element);
    }
    //create the range at the end of the element:
    const range = new Range();
    range.setStart(element.get(0), length + translate);
    range.setEnd(element.get(0), length + translate);

    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
}

//highlight element : 
function highlightElement(element) {
    //get element text
    const innerText = element.get(0).innerText;
    //get element text range:
    const length = innerText.length;
    //create the range at the end of the element:
    const range = new Range();
    range.setStart(element.get(0), 0);
    range.setEnd(element.get(0), length);

    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
}

//cursor of the element start:
function cursorAtStartElement(element) {
    //convert the element to jquery if not
    if (!element.jquery) { element = $(element) }
    const range = new Range();
    range.setStart(element.get(0), 0);
    range.setEnd(element.get(0), 0);

    window.getSelection().removeAllRanges();
    window.getSelection().addRange(range);
}

//css prop
function getStyleCssProp(item) {
    var cssProp = {
        'background-color': backgroundColor,
        'color': fontColor,
        'font-size': fontSize + 'px',
    };

    //set header style;
    if (headerChecker()) {
        cssProp = {
            'background-color': backgroundColor,
            'color': fontColor
        };
        return cssProp;
    }

    //set lists style
    if (item == 'list') {
        cssProp['margin-left'] = '30px';
    }

    //set div style:
    if(item == 'div'){
        cssProp['text-align'] = textAlign;
    }

    if (bold && italic) {
        cssProp['font-weight'] = 'bold';
        cssProp['font-style'] = 'italic';

    } else if (italic) {
        cssProp['font-style'] = 'italic';
        cssProp['font-weight'] = 'normal';
    } else if (bold) {
        cssProp['font-weight'] = 'bold';
        cssProp['font-style'] = 'normal';
    } else {
        cssProp['font-style'] = 'normal';
        cssProp['font-weight'] = 'normal';
    }

    return cssProp;
}

//append to last child loop
//html will append to the last child or to post body if there is no elements in the post body:
function appendToLastChild(html) {
    const postBody = $('#postBody');
    //get last child:
    var lastChild = $(postBody.get(0).lastChild);
    //check if there is valid child
    if (lastChild.html()) {
        //get node name:
        const nodeName = lastChild.prop('nodeName');
        $(nodeName).last().html($(nodeName).last().html() + html);
        return;
    }
    //no nested children founded append to body:
    postBody.html(postBody.html() + html);
    //close menu:
    closeCustomizeMenu();
}

//check if there is selection:
function checkIfSelection() {
    //get post body obj:
    const postBody = $('#postBody');

    //get the selections if founded
    const selection = document.getSelection(postBody.get(0));
    const selectionRange = selection.getRangeAt(0);

    //check if the range is in the post body:
    const container = selectionRange.endContainer.parentNode;
    const isPostBodyChild = checkPostBodyChild(container);
    if (!isPostBodyChild) { return { isSelected: false }; }

    const start = selectionRange.startOffset;
    const end = selectionRange.endOffset;

    return { isSelected: start != end, selection: selection };
}

// check if the element is post body child
function checkPostBodyChild(element) {
    //check if valid element :
    if (!element) { return false; }

    var isPostBodyChild = false;
    //check if the element is the post body:
    if (element.id == 'postBody') { isPostBodyChild = true; }
    //check if the element parents is the post body:
    while (element) {
        if (element.id == 'postBody') { isPostBodyChild = true; }
        element = element.parentNode;
    }

    return isPostBodyChild;
}

//update the selection:
function updateSelection(selection, changeType, data) {
    //extract selection text, range
    const selectionText = selection.toString();
    const selectionRange = selection.getRangeAt(0);
    //create new element
    var newElement = createUpdatedItem(changeType, selectionText, data);
    //delete selection from post body
    selection.deleteFromDocument();
    //insert new element place the deleted selection
    selectionRange.insertNode(newElement.get(0));

    //close the menu:
    closeCustomizeMenuWithoutMoveCursor();
}

//create updated item 
function createUpdatedItem(changeType, selectionText, extraData) {
    var newElement = null;
    switch (changeType) {
        case 'font-size':
            newElement = $('<span>').css('font-size', fontSize).html(selectionText);
            break;
        case 'font-color':
            newElement = $('<span>').css('color', fontColor).html(selectionText);
            break;
        case 'background-color':
            newElement = $('<span>').css('background-color', backgroundColor).html(selectionText);
            break;
        case 'heading':
            const id = getUniqueId();
            newElement = $('<h' + extraData.level + '>').attr('id', id).html(selectionText);
            header = false;
            break;
        case 'italic':
        case 'bolding':
            if (bold & italic) {
                newElement = $('<span>').css('font-weight', 'bold').css('font-style', 'italic').html(selectionText);
            } else if (bold) {
                newElement = $('<span>').css('font-weight', 'bold').html(selectionText);
            } else if (italic) {
                newElement = $('<span>').css('font-style', 'italic').html(selectionText);
            } else {
                newElement = $('<span>').html(selectionText);
            }
            break;
        case 'ordered':
            newElement = $('<ol>').css('margin-left', '32px').html('<li>' + selectionText + '</li>');
            break;
        case 'unordered':
            newElement = $('<ul>').css('margin-left', '32px').html('<li>' + selectionText + '</li>');
            break;
        case 'text-align':
            newElement = $('<div>').css(getStyleCssProp('div')).html(selectionText);
            break;
        default:
            break;
    }
    return newElement;
}
