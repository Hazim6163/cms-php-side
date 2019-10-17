//get user info:
getUserInfo((userInfo) => {
    //create main page:
    createPage(userInfo)
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
var customizeMenuInflaterOpened = false;
var openedCustomizeMenuType = 'none';
//change the menu position on drag
var menuIsClicked = false;
var mousedown = false;
var mousedown_timer = '';
//version controller:
const changesArray = new Array();
var changesArrayCurrentPosition = 0;
var currentInChange = false;
var alreadyChangesSaved = false;

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
    //version control tool
    docSaver();
    const postBody = $('<div>', {
        class: 'postBody',
        id: 'postBody'
    }).attr('contenteditable', 'true').html('Add Post Body');

    //create on key up listener to set the place holder
    postBody.on('keyup', () => {
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
function createToolbar(postBody) {
    const toolbarContainer = $('<div>', {
        class: 'toolbarContainer',
        id: 'toolbarContainer'
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

    //on long press move:
    onLongPress(toolbarContainer);

    return toolbarContainer;
}

//save doc tool:
function toolbarSaveDocTool(){
    const saveDocTool =$('<div>',{
        class: 'saveDocTool toolbar-tool',
        id: 'toolbarSaveDocTool'
    }).html('<i class="fas fa-cloud-upload-alt toolIcon"></i>');

    saveDocTool.click(()=>{
        docSave();
    })

    return saveDocTool;
}

//save doc:
function docSave(){
    const postBody = $('#postBody');
    const change = postBody.html();
    changesArrayCurrentPosition++;
    changesArray.push({changesArrayCurrentPosition: changesArrayCurrentPosition, change: change});
    console.log(changesArray);
    alreadyChangesSaved = true;
    $('#toolbarSaveDocTool').addClass('changesSaved').removeClass('rotate');
}

//save the doc on change every 1s:
function docSaver(){
    var postBody;
    setInterval(()=>{
        if(currentInChange || alreadyChangesSaved){
            currentInChange = false;
            return
        }
        postBody = $('#postBody');
        const change = postBody.html();
        changesArrayCurrentPosition++;
        changesArray.push({changesArrayCurrentPosition: changesArrayCurrentPosition, change: change});
        console.log(changesArray);
        alreadyChangesSaved = true;
        $('#toolbarSaveDocTool').addClass('changesSaved').removeClass('rotate');
    }, 1000);
}

//toolbar italic tool:
function toolbarItalicTool(){
    const italicContainer = $('<div>', {
        class: 'toolbarItalicTool toolbar-tool',
        id: 'toolbarItalicTool'
    }).html('<i class="fas fa-italic toolIcon"></i>');

    italicContainer.click(()=>{
        toggleItalic();
        italicContainer.toggleClass('toggleTool');
    })
    
    return italicContainer;
}

//toggle italic:
function toggleItalic(){
    italic = !italic;
    //check if there is selected text
    const selection = checkIfSelection();

    if(selection.isSelected){
        //there is selected text
        updateSelection(selection.selection, 'italic', {italic: italic});
    }else{
        //insert new item to post body
        insertNewItem('span');
    }
}

//toolbar bolding tool
function toolbarBoldingTool(){
    const boldingContainer = $('<div>', {
        class: 'toolbarBoldingTool toolbar-tool',
        id: 'toolbarBoldingTool'
    }).html('<i class="fas fa-bold toolIcon"></i>');

    boldingContainer.click(()=>{
        toggleBold();
        boldingContainer.toggleClass('toggleTool');
    })
    
    return boldingContainer;
}

//toggle bold:
function toggleBold(){
    //toggle bold
    bold = !bold;
    //check if there is selected text
    const selection = checkIfSelection();

    if(selection.isSelected){
        //there is selected text
        updateSelection(selection.selection, 'bolding', {bold: bold});
    }else{
        //insert new item to post body
        insertNewItem('span');
    }
}

//toolbar heading tool:
function toolbarHeadingTool(){
    const headingContainer = $('<div>', {
        class: 'toolbarHeadingTool toolbar-tool',
        id: 'toolbarHeadingTool'
    }).html('<i class="fas fa-heading toolIcon"></i>');

    const itemsArray = new Array();

    for (let index = 6; index >= 1; index--) {
       itemsArray.push($('<h'+index+'>',{
           class: 'headerTool'
       }).click(()=>{
            header = true;
            headerLevel = index;
            onHeaderItemClick(headerLevel);
       }).html('H'+index).css('text-align', 'center'));
    }

    headingContainer.click(()=>{
        customizeMenuInflater(itemsArray, 'heading');
    })

    return headingContainer;
}

//on header item click:
function onHeaderItemClick(lvl){
    //check if there is selected text
    const selection = checkIfSelection();

    if(selection.isSelected){
        //there is selected text
        updateSelection(selection.selection, 'heading', {level: lvl});
    }else{
        //insert new item to post body
        insertNewItem('h'+lvl);
    }
}

//toolbar Font color tool
function toolbarFontColorTool(){
    const fontColorContainer = $('<div>', {
        class: 'toolbarFontColorTool toolbar-tool',
        id: 'toolbarFontColorTool'
    }).html('<i class="fas fa-tint toolIcon"></i>');

    //create the color list :
    const itemsArray = new Array();

    const platesContainer = $('<div>',{
        class: 'platesColorContainer',
        id: 'platesColorContainer'
    });

    const colorsPlates = extractColors();
    //loop throw each plate
    colorsPlates.forEach((plate)=>{
        //get plate colors icons
        const plateArr = plate.children();
        for (let index = 0; index < plateArr.length; index++) {
            //get color icon jquery obj
            const element = $(plateArr[index]);
            //set colorIcon css class
            element.addClass('colorIcon');
            //set on click listener
            element.click(()=>{
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
function toolbarBackgroundColorTool(){
    const backgroundColorContainer = $('<div>', {
        class: 'toolbarBackgroundColorTool toolbar-tool',
        id: 'toolbarBackgroundColorTool'
    }).html('<i class="fas fa-highlighter toolIcon"></i>');

    //create the color list :
    const itemsArray = new Array();

    const platesContainer = $('<div>',{
        class: 'platesColorContainer',
        id: 'platesColorContainer'
    });

    const colorsPlates = extractColors();
    //loop throw each plate
    colorsPlates.forEach((plate)=>{
        //get plate colors icons
        const plateArr = plate.children();
        for (let index = 0; index < plateArr.length; index++) {
            //get color icon jquery obj
            const element = $(plateArr[index]);
            //set colorIcon css class
            element.addClass('colorIcon');
            //set on click listener
            element.click(()=>{
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
function onBackGroundColorIconClick(){
    //check if there is selected text
    const selection = checkIfSelection();

    if(selection.isSelected){
        //there is selected text
        updateSelection(selection.selection, 'background-color');
    }else{
        // no selected text insert new item to post body
        insertNewItem('span');
    }
}

//extract Colors:
function extractColors(){
    const colors = new Array();

    //plat_1
    const plat_1 = $('<div>',{
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
    plat_1Arr.forEach((color)=>{
        plat_1.append($('<div>').css({'background-color': color}));
    });
    colors.push(plat_1);

    //plat1
    const plat1 = $('<div>',{
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
    plat1Arr.forEach((color)=>{
        plat1.append($('<div>').css({'background-color': color}));
    });
    colors.push(plat1);

    //plat2
    const plat2 = $('<div>',{
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
    plat2Arr.forEach((color)=>{
        plat2.append($('<div>').css({'background-color': color}));
    });
    colors.push(plat2);

    /* plat3 */
    const plat3 = $('<div>',{
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
    plat3Arr.forEach((color)=>{
        plat3.append($('<div>').css({'background-color': color}));
    });
    colors.push(plat3);

    /* plat5 */
    const plat5 = $('<div>',{
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
    plat5Arr.forEach((color)=>{
        plat5.append($('<div>').css({'background-color': color}));
    });
    colors.push(plat5);

    /* plat7 */
    const plat7 = $('<div>',{
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
    plat7Arr.forEach((color)=>{
        plat7.append($('<div>').css({'background-color': color}));
    });
    colors.push(plat7);

    /* plat8 */
    const plat8 = $('<div>',{
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
    plat8Arr.forEach((color)=>{
        plat8.append($('<div>').css({'background-color': color}));
    });
    colors.push(plat8);

    /* plat9 */
    const plat9 = $('<div>',{
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
    plat9Arr.forEach((color)=>{
        plat9.append($('<div>').css({'background-color': color}));
    });
    colors.push(plat9);

    /* plat10 */
    const plat10 = $('<div>',{
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
    plat10Arr.forEach((color)=>{
        plat10.append($('<div>').css({'background-color': color}));
    });
    colors.push(plat10);

    /* plat11 */
    const plat11 = $('<div>',{
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
    plat11Arr.forEach((color)=>{
        plat11.append($('<div>').css({'background-color': color}));
    });
    colors.push(plat11);

    /* plat12 */
    const plat12 = $('<div>',{
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
    plat12Arr.forEach((color)=>{
        plat12.append($('<div>').css({'background-color': color}));
    });
    colors.push(plat12);

    /* plat13 */
    const plat13 = $('<div>',{
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
    plat13Arr.forEach((color)=>{
        plat13.append($('<div>').css({'background-color': color}));
    });
    colors.push(plat13);

    /* plat14 */
    const plat14 = $('<div>',{
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
    plat14Arr.forEach((color)=>{
        plat14.append($('<div>').css({'background-color': color}));
    });
    colors.push(plat14);


    /* plat15 */
    const plat15 = $('<div>',{
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
    plat15Arr.forEach((color)=>{
        plat15.append($('<div>').css({'background-color': color}));
    });
    colors.push(plat15);

    return colors;
}

//on color icon click
function onFontColorIconClick(){
    //check if there is selected text
    const selection = checkIfSelection();

    if(selection.isSelected){
        //there is selected text
        updateSelection(selection.selection, 'font-color');
    }else{
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

    if(selection.isSelected){
        //there is selected text
        updateSelection(selection.selection, 'font-size');
    }else{
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
                'left': e.pageX + (element.width() / 2) - 15,
                'top': e.pageY - 15
            });
        }
    }
}

//insert new Item to post body:
function insertNewItem(_type){
    type = _type;
    //get post body obj:
    const postBody = $('#postBody');
    //set type:
    //add new element to post body:
    var newElement;
    if(header){
        newElement = '<'+type+'>&zwnj;';
        header = false;
    }else if(type == 'span'){
        if(bold && italic){
            newElement = '<'+type+' style="font-size:' + fontSize + 'px; color:'+fontColor+'; background-color: '+backgroundColor+'; font-weight: bold; font-style: italic">&zwnj;'
        }else if(bold){
            newElement = '<'+type+' style="font-size:' + fontSize + 'px; color:'+fontColor+'; background-color: '+backgroundColor+'; font-weight: bold">&zwnj;'
        }else if(italic){
            newElement = '<'+type+' style="font-size:' + fontSize + 'px; color:'+fontColor+'; background-color: '+backgroundColor+';font-style: italic">&zwnj;'
        }else{
            newElement = '<'+type+' style="font-size:' + fontSize + 'px; color:'+fontColor+'; background-color: '+backgroundColor+';">&zwnj;'
        }
    }
    postBody.html(postBody.html() + newElement);

    //remove <br>
    const newHtml = postBody.html();
    postBody.html(newHtml.replace(/<br>/g, ''));

    closeCustomizeMenu();
}

//check if there is selection:
function checkIfSelection(){
    //get post body obj:
    const postBody = $('#postBody');

    //get the selections if founded
    const selection = document.getSelection(postBody.get(0));

    const selectionRange = selection.getRangeAt(0);
    const start = selectionRange.startOffset;
    const end = selectionRange.endOffset;

    return {isSelected: start != end, selection: selection};
}

//update the selection:
function updateSelection(selection, changeType, data){
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
    return;
}

//create updated item 
function createUpdatedItem(changeType, selectionText, extraData){
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
            newElement = $('<h'+extraData.level+'>').html(selectionText);
            header = false;
            break;
        case 'italic':
        case 'bolding':
            if(bold & italic){
                newElement = $('<span>').css('font-weight', 'bold').css('font-style', 'italic').html(selectionText);
            }else if(bold){
                newElement = $('<span>').css('font-weight', 'bold').html(selectionText);
            }else if(italic){
                newElement = $('<span>').css('font-style', 'italic').html(selectionText);
            }else{
                newElement = $('<span>').html(selectionText);
            }
            break;
        default:
            break;
    }
    return newElement;
}
