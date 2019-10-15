//get user info:
getUserInfo((userInfo) => {
    //create main page:
    createPage(userInfo)
});

/******************* functions  *************/

//main page:
const createPage = (userInfo) => {
    //page
    const page = $('#pageContainer');
    //post container
    const postContainer = $('<div>', {
        class: 'postContainer',
        id: 'postContainer'
    }).appendTo(page);
    //create post header 
    postContainer.append(postHeader());
    //post Body:
    createPostBody().appendTo(postContainer)
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