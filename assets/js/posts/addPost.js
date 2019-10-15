//get user info:
getUserInfo((userInfo) => {
    //create main page:
    createPage(userInfo)
});


//post body editor vars:
var fontColor = '';
var fontSize = '40';
var type = 'span';
var customizeMenuInflaterOpened = false;
var openedCustomizeMenuType = 'none';
//change the menu position on drag
var menuIsClicked = false;
var mousedown = false;
var mousedown_timer = '';

/******************* functions  *************/

//main page:
const createPage = (userInfo) => {
    //page
    const page = $('#pageContainer');

    const postBody = createPostBody();
    //createToolBar
    createToolbar(postBody).appendTo(page);
    //post container
    const postContainer = $('<div>', {
        class: 'postContainer',
        id: 'postContainer'
    }).appendTo(page);
    //create post header 
    postContainer.append(postHeader());
    //post Body:
    postBody.appendTo(postContainer)
}

//create post header
function postHeader() {
    const pageHeader = $('<div>', {
        class: 'pageHeader',
        id: 'pageHeader'
    });

    //TODO  CREATE POST IMG SECTION

    //post title section
    createPostTitle().appendTo(pageHeader);
    //post description section:
    createPostDes().appendTo(pageHeader);

    return pageHeader;
}

//create post title section;
function createPostTitle() {
    const postTitleContainer = $('<div>', {
        class: 'postTitleSectionContainer',
        id: 'postTitleSectionContainer'
    });

    const postTitle = $('<div>', {
        class: 'postTitle',
        id: 'postTitle'
    }).html('Post Title').appendTo(postTitleContainer).attr('contenteditable', 'true');

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
function createPostDes() {
    const postDesContainer = $('<div>', {
        class: 'postDesContainer',
        id: 'postDesContainer'
    });

    const postDes = $('<div>', {
        class: 'postDes',
        id: 'postDes'
    }).html('Add Post Description').appendTo(postDesContainer).attr('contenteditable', 'true');

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
function createPostBody() {
    const postBody = $('<div>', {
        class: 'postBody',
        id: 'postBody'
    }).attr('contenteditable', 'true').html('Add Post Body');

    //create on key up listener to set the place holder
    postBody.on('keyup', () => {
        if (postBody.html() === '<br>') {
            postBody.html('Add Post Body');

            const range = new Range();
            range.setStart(postBody.get(0).firstChild, 0);
            range.setEnd(postBody.get(0).firstChild, 13);

            window.getSelection().removeAllRanges();
            window.getSelection().addRange(range);
            return;
        }
    });

    //on focus remove default text:
    postBody.on('focus', () => {
        if (postBody.html() === 'Add Post Body') {
            postBody.html('');
        }

    })
    //set default place holder
    postBody.on('focusout', () => {
        if (postBody.html() === '') {
            postBody.html('Add Post Body');
        }

    })

    return postBody;
}

//create toolbar
function createToolbar(postBody){
    const toolbarContainer = $('<div>',{
        class: 'toolbarContainer',
        id: 'toolbarContainer'
    });
    const toolsContainer = $('<div>',{
        class: 'toolsContainer',
        id: 'toolsContainer'
    }).appendTo(toolbarContainer);
    const menuContainer = $('<div>',{
        class: 'menuContainer',
        id: 'menuContainer'
    }).appendTo(toolbarContainer);

    //font size:
    toolbarFontSizeTool().appendTo(toolsContainer);

    //on long press move:
    onLongPress(toolbarContainer);

    return toolbarContainer;
}

//toolbarFontSizeTool
function toolbarFontSizeTool(){
    const fontSizeContainer = $('<div>',{
        class: 'toolbarFontSizeTool toolbar-tool',
        id: 'toolbarFontSizeTool'
    }).html('<i class="material-icons">format_size</i>');

    //inflate list 8-32: 
    const itemsArray = new Array();
    for (let index = 12; index <= 32; index+=2) {
        if(index > 12){
            index+=2;
        }
        //create list item: 
        const temp = $('<span>',{
            class: 'fontSizeMenuItem',
            id: 'fontSizeMenuItem'+index
        }).css('font-size', index+'px').html(index+'px');

        //on the list item click
        temp.click(()=>{
           onFontPropClick(index);
        });

        itemsArray.push(
            $('<div>',{
                class: 'fontSizeMenuItemContainer',
                id: 'fontSizeMenuItemContainer'+index
            }).html(temp)
        );
    }

    //custom font size:
    const customFontSizeContainer = $('<div>',{
        class: 'customFontSizeContainer',
        id: 'customFontSizeContainer'
    });
    const customFontSizeI = $('<input>',{
        class: 'customFontSizeI',
        id: 'customFontSizeI'
    }).attr('placeholder', '18').appendTo(customFontSizeContainer);
    const customFontSizeIPx = $('<div>',{
        class: 'customFontSizeIPx',
        id: 'customFontSizeIPx'
    }).html('px').appendTo(customFontSizeContainer);
    const customFontSizeSubmit = $('<div>',{
        class: 'customFontSizeSubmit',
        id: 'customFontSizeSubmit'
    }).html('Submit').appendTo(customFontSizeContainer);
    customFontSizeSubmit.click(()=>{
        setCustomFontSize();
    });
    itemsArray.push(customFontSizeContainer);

    fontSizeContainer.click(()=>{
        customizeMenuInflater(itemsArray, 'font-size');
    })
    
    return fontSizeContainer;
}

//set custom font size:
function setCustomFontSize(){
    const val = parseInt($('#customFontSizeI').val(), 10);
    if(!Number.isInteger(val)){
        return;
    }
    //set font size:
    fontSize = val;
    onFontPropClick(fontSize);
}

//set font size property item clicked:
function onFontPropClick(fontSize){
    //get post body obj:
    const postBody = $('#postBody');

    //get the selections if founded
    const selection = document.getSelection(postBody.get(0));
    
    const selectionText = selection.toString();
    const selectionRange = selection.getRangeAt(0);
    const start = selectionRange.startOffset;
    const end = selectionRange.endOffset;

    if(start != end){
        
        const newElement = $('<span>').css('font-size', fontSize).html(selectionText);
        selection.deleteFromDocument();
        selectionRange.insertNode(newElement.get(0));

        //close the menu:
        closeCustomizeMenuWithoutMoveCursor();
        return;
    }
    
    // no selection text add new span to post body:
    postBody.html(postBody.html()+'<span style="font-size:'+fontSize+'px;">&zwnj;');

    //remove <br>
    const newHtml = postBody.html();
    postBody.html(newHtml.replace(/<br>/g , ''));
    
    closeCustomizeMenu();
}

//cursor at end setter:
function cursorEndSetter(){
    //get the last Element :
    var lastElement = $(type).last();
    var p;
    //check if there is new element : 
    if(!lastElement.html()){
        //there is no new item just move the cursor to the end of the post body:
        lastElement = $('#postBody');
        p = $('#postBody').html().length;
    }else{
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
function customizeMenuInflater(items, menuType){

    //check if the menu obj already created:
    if(!$('#customizeMenu').html()){
        //inflate menu for first time:
        $('#menuContainer').append(
            $('<div>',{
                class: 'customizeMenu',
                id: 'customizeMenu'
            })
        );
    }

    if(customizeMenuInflaterOpened){
        //menu already opened:
        //check if the opened menu is the same:
        if(menuType === openedCustomizeMenuType){
            //opened menu is the same of the requested menu:
            //hide the menu:
            closeCustomizeMenu();
            return;
        }
        //opened menu is other than requested menu:
        //clean up the menu container:
        $('#customizeMenu').remove();
        //inflate new menu 
        customizeMenuInflater(items, menuType);
        return;
    }
    items.forEach((item)=>{
        $('#customizeMenu').append(item.clone(true));
    });
    openedCustomizeMenuType = menuType;
    customizeMenuInflaterOpened = true;

    
}

//to close the customize menu:
function closeCustomizeMenu(){
    $('#customizeMenu').toggle('fast');
    $('#customizeMenu').remove();
    openedCustomizeMenuType = 'none';
    customizeMenuInflaterOpened = false;
    //set cursor inside the Post Body after hide the menu:
    cursorEndSetter();
}

//close the customize menu without move the cursor:
function closeCustomizeMenuWithoutMoveCursor(){
    $('#customizeMenu').toggle('fast');
    $('#customizeMenu').remove();
    openedCustomizeMenuType = 'none';
    customizeMenuInflaterOpened = false;
}

//long muse click listener on toolbar to move:
function onLongPress(element) { 


    //set mouse click timeout to move
    element.mousedown(function(e) {
        mousedown = true;
        mousedown_timer = setTimeout(function() {
            if(mousedown) {
                menuIsClicked = true;
            }
        }, 200);
    }).mouseup(function(e) {
        mousedown = false;
        clearTimeout(mousedown_timer);
    });

    //remove menu clicked on mouse up:
    element.on('mouseup',()=>{
        menuIsClicked = false;
    })

    document.addEventListener('mousemove', onMouseUpdate, false);
    function onMouseUpdate(e){
        if(menuIsClicked){
            element.css({
                'left': e.pageX+(element.width()/2)-15,
                'top': e.pageY-15
            });
        }
    }
}
