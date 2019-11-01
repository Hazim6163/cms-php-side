//loading : 
startLoading();

//vars: 
//url params : 
const params = new URLSearchParams(window.location.search);
//requested user id: 
const rId = params.get('id');
//user login status boolean
let userLoggedIn = false;
//post class links object:
const links = {
    catLink: '../categories.php?id=',
    profileLink: './profile.php?id=',
    tagLink: '', //todo create tag link
    authorImgLink: 'http://localhost:3000/user/profilePhoto?id=',
    phpUtils: './profile.php',
    postImgLink: 'http://localhost:3000/file/uri?uri=',
    postLink: 'http://localhost/html/CMS/posts/post.php?id='
}
//user data: 
let userData;
//time line vars: 
let lastPostDate;

//get user data: 
getUserInfo((userInfo) => {
    (userInfo.loggedIn == false) ? userLoggedIn = false : userLoggedIn = true;
    userData = userInfo;
    //get data:
    getData((data) => {
        //inflate page:
        inflatePage(data, userInfo);
    })
});

//get data: 
const getData = (nextFun) => {
    //create data url: 
    let path;
    rId == null ? path = './profile.php' : path = './profile.php?id=' + rId;
    $.post(path, { getData: true }, (data) => {
        nextFun(data);
    }, 'json')
}

function inflatePage(data, userInfo) {
    //get page container: 
    const pageContainer = $('#pageContainer');
    // clean up loading stuff
    pageContainer.empty();
    //create post container: 
    eHtml({ class: 'postsContainer', id: 'postsContainer', container: pageContainer });
    //append posts to posts container
    data.forEach((postD) => {
        timeLine(postD);
        createPost(postD);
    })

}

//profile time line creator:
function timeLine(data) {
    const postsContainer = $('#postsContainer');
    const date = new Date(data.updatedAt);
    postDate = { year: date.getFullYear(), month: convertToMonth(date.getMonth() + 1) };
    //create time line for the first post 
    if (!lastPostDate) {
        lastPostDate = postDate;
        const eTimeLine = eHtml({ class: 'eTimeLine non-select', container: postsContainer });
        eHtml({ class: 'timeLineYear', container: eTimeLine, text: lastPostDate.year });
        eHtml({ class: 'timeLineMonth', container: eTimeLine, text: ' - ' + lastPostDate.month });
    }
    //validate date last post and actual
    if (postDate.month != lastPostDate.month || postDate.year != lastPostDate.year) {
        lastPostDate = postDate;
        const eTimeLine = eHtml({ class: 'eTimeLine non-select', container: postsContainer });
        eHtml({ class: 'timeLineYear', container: eTimeLine, text: lastPostDate.year });
        eHtml({ class: 'timeLineMonth', container: eTimeLine, text: ' - ' + lastPostDate.month });
    }
}

//convert month from number to typed month: 
function convertToMonth(number) {
    let month = '';
    switch (number) {
        case 1:
            month = 'Jan'
            break;
        case 2:
            month = 'Feb'
            break;
        case 3:
            month = 'Mar'
            break;
        case 4:
            month = 'Apr'
            break;
        case 5:
            month = 'May'
            break;
        case 6:
            month = 'Jun'
            break;
        case 7:
            month = 'Jul'
            break;
        case 8:
            month = 'Aug'
            break;
        case 9:
            month = 'Sep'
            break;
        case 10:
            month = 'Oct'
            break;
        case 11:
            month = 'Nov'
            break;
        case 12:
            month = 'Dec'
            break;
        default:
            break;
    }
    return month;
}

//create post function: 
function createPost(data) {
    const postsContainer = $('#postsContainer');
    const post = new Post(data, links, userData);
    post.postV1.appendTo(postsContainer);
}


//Post Class
class Post {
    constructor(post, links, userInfo) {
        //user : 
        this.userInfo = userInfo;
        this.id = post._id;
        //operation vars: 
        this.authorMenuInProgress = false;
        //links:
        this.links = links;
        this.catLink = links.catLink;
        this.tagLink = links.tagLink;
        this.profileLink = links.profileLink;
        this.phpUtils = links.phpUtils;
        this.postImgLink = links.postImgLink
        this.postLink = links.postLink + this.id
        //post vars:
        this.parentId = post.parentId;
        //post author vars:
        this.authorId = post.authorId;
        this.authorInfo = post.authorInfo;
        this.authorImgLink = this.links.authorImgLink + this.authorInfo.photoUrl;
        if (post.authorInfo.photoUrl != '' && post.authorInfo.photoUrl) {
            this.authorImgUrl = post.authorInfo.photoUrl;
        }
        //cat tree
        this.catTree = post.catTree;
        this.title = post.title;
        this.des = post.des;
        this.body = post.body;
        post.imgUrl ? this.img = post.imgUrl : this.img = undefined;
        this.tags = post.tags;
        this.likesCount = post.likesCount;
        this.likers = post.likers;
        this.commentsCount = post.commentsCount;
        this.comments = post.comments;
        //post date
        let date;
        //created date:
        this.createdAt = post.createdAt;
        date = new Date(this.createdAt);
        this.createdDate = { year: date.getFullYear(), month: convertToMonth(date.getMonth() + 1), day: date.getDate() };
        this.updatedAt = post.updatedAt;
        //updated date:
        date = new Date(this.updatedAt);
        this.updatedDate = { year: date.getFullYear(), month: convertToMonth(date.getMonth() + 1), day: date.getDate() };
        //post html elements:
        //create post title element: 
        this.eTitle = eHtml({ class: 'postTitle', html: this.title });
        //create post des element: 
        this.eDes = eHtml({ class: 'postDes', html: this.des });
        //create post body element: 
        this.eBody = eHtml({ class: 'postBody', html: this.body });
        //create post created date element: 
        this.eCreated = eHtml({ class: 'postCreated', html: this.createdAt });
        //create post updated element: 
        this.eUpdated = eHtml({ class: 'postUpdated', html: this.updatedAt });
        //create post likes element: 
        this.eLikesCount = eHtml({ class: 'postLikesCount', html: this.likesCount });
        this.eLikes = this.createPostLikes();
        //create post comments element: 
        this.eCommentsCount = eHtml({ class: 'postCommentsCount', html: this.commentsCount });
        this.eComments = this.createPostComments();
        //create post author fname element: 
        this.eAuthorFname = eHtml({ class: 'postAuthorFname', html: this.authorInfo.fname });
        //create post author lname element: 
        this.eAuthorLname = eHtml({ class: 'postAuthorLname', html: this.authorInfo.lname });
        //create post author name: 
        this.eAuthorName = eHtml({
            class: 'postAuthorName',
            html: this.authorInfo.fname + ' ' + this.authorInfo.lname
        });
        //create post author username element: 
        this.eAuthorUsername = eHtml({ class: 'postAuthorUsername', html: this.authorInfo.username });

        //create post : 
        this.postV1 = this.postV1();

    }

    //post img:
    postImgV1() {
        const wrapper = eHtml({ class: 'pImgWrapper' });
        const container = eHtml({ class: 'pImgContainer', container: wrapper });
        //check if the post has img:
        const url = this.img;
        if (url && url != '' && url != null) {
            //create post img
            const img = eHtml({ type: 'img', class: 'postImg', container: container });
            img.attr('src', this.postImgLink + url);
        }
        return wrapper;
    }

    //create tags wrapper
    createTags() {
        //create tags wrapper
        const wrapper = eHtml({ class: 'tagsWrapper' });
        //create tags container
        const container = eHtml({ class: 'tagsContainer', container: wrapper });
        //create tag container
        this.tags.forEach(tag => {
            const tContainer = eHtml({
                class: 'tagContainer',
                container: container,
                onClick: () => {
                    window.location.href = this.links.tagLink + tag._id
                }
            })
            const icon = eHtml({ class: 'tagIconContainer', html: '<i class="fas fa-tag tagIcon"></i>', container: tContainer });
            const name = eHtml({ class: 'tagName', html: tag.name, container: tContainer });
        });
        //todo test tags
        return wrapper;
    }

    //create category tree wrapper: 
    createCatTree() {
        //tree wrapper: 
        const wrapper = eHtml({ class: 'catTreeWrapper' });
        //tree links container
        const container = eHtml({ class: 'catTreeContainer', container: wrapper });
        //home link
        const home = eHtml({ class: 'body-nav', text: 'Home', container: container });
        //slash
        const slash = eHtml({ class: 'body-nav body-nav-slash', text: '/', container: container });
        //categories link
        const categories = eHtml({ class: 'body-nav', text: 'Categories', container: container });
        //loop throw each parent: 
        this.catTree.reverse().forEach((cat) => {
            //append slash
            container.append(slash.clone(true));
            //create cat container: 
            const cContainer = eHtml({
                class: 'body-nav-cat body-nav',
                text: cat.title,
                container: container,
                onClick: () => {
                    window.location.href = this.catLink + cat._id
                }
            });
        })
        //todo test categories
        return wrapper;
    }

    //author img:
    creatAuthorImg() {
        const wrapper = eHtml({ class: 'pAuthorImgWrapper' });
        //img container: 
        const container = eHtml({ class: 'pAuthorImgContainer', container: wrapper });
        //check if the user has img: 
        const url = this.authorInfo.photoUrl;
        if (url && url != '' && url != null) {
            //has photo
            const img = htmlE({ type: 'img', class: 'authorImg', container: container });
            img.attr('src', this.links.authorImgLink + this.authorInfo.photoUrl);
        } else {
            //create icon
            container.html('<i class="fas fa-user userIcon"></i>')
        }

        return wrapper;
    }

    //post author menu: 
    createAuthorMenu() {
        const wrapper = eHtml({ class: 'authorMenuWrapper' });
        const container = eHtml({ class: 'authorMenuContainer', container: wrapper });
        const icon = eHtml({ class: 'authorMenuIconContainer menuCollapsed', id: 'authorMenuIconContainer', container: container, html: '<i class="fas fa-ellipsis-v menuIcon"></i>' });
        const menu = eHtml({ class: 'authorMenu', id: 'authorMenu', container: container }).hide();
        icon.click(() => {
            menu.toggle('fast', () => {
                //check menu status:
                let displayed;
                menu.is(":visible") ? displayed = true : displayed = false;
                displayed ? icon.html('<i class="fas fa-times menuIcon"></i>') : icon.html('<i class="fas fa-ellipsis-v menuIcon"></i>')
            });
        })
        const privacy = eHtml({ class: 'mPrivacy', id: 'mPrivacy', text: 'Privacy', container: menu });
        privacy.click(() => {
            if (this.authorMenuInProgress) return;
            this.authorMenuInProgress = true;
            this.createPrivacyModal();
        })
        const edit = eHtml({ class: 'mEditPost', id: 'mEditPost', text: 'Edit', container: menu });
        edit.click(() => {
            if (this.authorMenuInProgress) return;
            window.location.href = window.location.href //todo create edit post page
        })
        const mDelete = eHtml({ class: 'mDelete', id: 'mDelete', text: 'Delete', container: menu });
        mDelete.click(() => {
            if (this.authorMenuInProgress) return;
            this.authorMenuInProgress = true;
            //change icon to in progress
            icon.html('<i class="fas fa-spinner rotate"></i>');
            //delete request:
            $.post(this.phpUtils, { deletePost: true, id: this.id, in: 'profile', extra: { id: this.authorId } }, (res) => {
                if (res.deleted) {
                    //todo update posts container
                    this.createAlertModal({
                        message: 'Post Deleted !!', status: 'p', nextFun: () => {
                            this.authorMenuInProgress = false;
                        }
                    });
                } else {
                    //todo create alert modal
                    this.createAlertModal({
                        message: res.error, status: 'n', nextFun: () => {
                            this.authorMenuInProgress = false;
                        }
                    });
                }
                menu.hide('fast', () => {
                    icon.html('<i class="fas fa-ellipsis-v menuIcon"></i>');
                });
            })
        })
        return wrapper;
    }

    //privacy modal: 
    createPrivacyModal() {
        //change icon to in progress
        $('#authorMenuIconContainer').html('<i class="fas fa-spinner rotate"></i>');
        const wrapper = eHtml({ class: 'modalWrapper' });
        const container = eHtml({ class: 'privacyMContainer', id: 'privacyMContainer', container: wrapper });
        const close = eHtml({ class: 'modalClose privacyMCloseContainer', id: 'closePrivacyM', container: container, html: '<i class="fas fa-times privacyMCloseIcon"></i>' });
        close.click(() => {
            wrapper.remove();
            this.authorMenuInProgress = false;
            $('#authorMenu').hide('fast', () => {
                $('#authorMenuIconContainer').html('<i class="fas fa-ellipsis-v menuIcon"></i>');
            });
        });
        //modal content
        const content = eHtml({ class: 'privacyMContent', container: container });
        //privacy dropdown label:
        const label = eHtml({ class: 'privacyMLabel', text: 'Privacy : ', container: content });
        //privacy dropdown
        const dropdown = eHtml({ type: 'select', name: 'privacy', class: 'privacyDropdown', container: content });
        //info : 
        const info = eHtml({ class: 'privacyMInfo', container: content }).hide();
        const infoIcon = eHtml({ class: 'privacy-modal-info-icon-container', container: info, html: '<i class="fas fa-info-circle privacy-modal-info-icon"></i>' });
        const infoMsg = eHtml({ class: 'privacy-modal-info-msg', container: info });
        //public option
        const _public = eHtml({ type: 'option', value: 'public', text: 'Public', container: dropdown, class: 'privacyDropdownOption' });
        //private option
        const _private = eHtml({ type: 'option', value: 'private', text: 'Private', container: dropdown, class: 'privacyDropdownOption' });
        //modal footer: 
        const footer = eHtml({ class: 'privacyMFooter', container: container });
        const save = eHtml({ class: 'privacyMSave', container: footer, text: 'Save' });
        //on privacy save click:
        save.click(() => {
            const val = dropdown.children("option:selected").val();
            $.post(this.phpUtils, { savePrivacy: true, privacy: val, id: this.id }, (res) => { //todo handel request
                info.show('fast');
                if (res.changed) {
                    info.addClass('privacy-modal-success-info');
                    infoMsg.text(res.message);
                    setTimeout(() => {
                        close.trigger('click');
                        this.authorMenuInProgress = false;
                    }, 2000)
                } else {
                    info.addClass('privacy-modal-failed-info');
                    infoMsg.text(res.error);
                }
                $('#authorMenu').hide('fast', () => {
                    $('#authorMenuIconContainer').html('<i class="fas fa-ellipsis-v menuIcon"></i>');
                });
            }, 'json')
        });
        $('body').append(wrapper);
    }

    //alerts modal: 
    createAlertModal(data) {
        //modal message
        const message = data.message;
        //status n: negative or p: positive or undefined
        const status = data.status;
        //modal wrapper
        const wrapper = eHtml({ class: 'modalWrapper' });
        //modal container
        const container = eHtml({ class: 'alertModal', id: 'alertModal', container: wrapper });
        //close btn
        const close = eHtml({ class: 'modalClose alertMCloseContainer', id: 'closeAlertM', container: container, html: '<i class="fas fa-times alertMCloseIcon"></i>' });
        close.click(() => {
            wrapper.remove();
        });
        //modal content
        const content = eHtml({ class: 'AlertMContent', container: container });
        //info container
        const info = eHtml({ class: 'alertMInfo', container: content });
        //info icon
        const infoIcon = eHtml({ class: 'alert-modal-info-icon-container', container: info, html: '<i class="fas fa-info-circle alert-modal-info-icon"></i>' });
        //info message
        const infoMsg = eHtml({ class: 'alert-modal-info-msg', container: info, text: message });
        //add status classes
        if (status) {
            status == 'p' ? info.addClass('alert-info-success') : info.addClass('alert-info-failed');
        } else {
            info.addClass('alert-info');
        }
        //modal footer: 
        const footer = eHtml({ class: 'alertMFooter', container: container });
        const done = eHtml({ class: 'alertMDone', container: footer, text: 'Done' });
        //on alert done click:
        done.click(() => {
            close.trigger('click');
            data.nextFun(data.args);
        });

        $('body').append(wrapper);
    }


    //  post v1
    postV1() {
        //post container:
        const container = eHtml({ class: 'postContainer' });
        //post header: 
        this.postHeaderV1(container);
        //post body: 
        this.postBodyV1(container);
        // //post footer: 
        this.postFooterV1(container);
        //todo post comments:
        return container;
    }

    //create post header:
    postHeaderV1(container) {
        const header = eHtml({ class: 'postHeader', container: container });
        this.eAuthorAsHeader().appendTo(header);
    }

    /**
    * author as header element
    * content 2 col 
    *      1. author img, icon
    *      2. -> 2 row
    *          1. author first last name
    *          2. author username
    */
    eAuthorAsHeader() {
        const wrapper = eHtml({ class: 'postHeaderWrapper' });
        const container = eHtml({ class: 'postHeaderContainer', container: wrapper });
        //set on section click listener:
        container.click(() => {
            window.location.href = this.links.profileLink + this.authorId
        })

        //col 1 img container: 
        const imgContainer = eHtml({ class: 'authorImgContainer', container: container });
        //check if the user has img: 
        if (this.authorImgUrl) {
            const img = eHtml({ type: 'img', class: 'authorImg', container: imgContainer });
            img.attr('src', this.authorImgLink);
        } else {
            const icon = eHtml({ class: 'authorIconContainer', container: imgContainer, html: '<i class="fas fa-user authorIcon "></i>' });
        }
        //col 2 - names container: 
        const nameContainer = eHtml({ class: 'headerNameContainer', container: container });
        nameContainer.append(this.eAuthorName);
        nameContainer.append(this.eAuthorUsername);
        return wrapper;
    }

    //create post Body 
    postBodyV1(container) {
        const body = eHtml({ class: 'postBody', container: container });
        this.postImgV1().appendTo(body);
        this.eTitleTagsDes().appendTo(body);
    }

    //post title tags des element 
    eTitleTagsDes() {
        const container = eHtml({});
        //title
        this.eTitle.appendTo(container);
        //tags
        this.createTags().appendTo(container);
        //description
        this.eDes.appendTo(container);
        //read more
        const readMore = eHtml({ html: '<a href="' + this.postLink + '">Read more ...</a>' });
        readMore.attr('href');
        readMore.appendTo(container);
        //click listener:
        container.click(() => {
            window.location.href = this.postLink;
        })

        return container;
    }


    //post footer: 
    postFooterV1(container) {
        const footer = eHtml({ class: 'postFooter', container: container });
        //post likes
        this.eLikes.appendTo(footer);
        //post comments
        this.eComments.appendTo(footer);
        //last update:
        let lastUpdateText;
        switch (this.updatedDate.day) {
            case 1:
                lastUpdateText = 'Last Update : ' + this.updatedDate.day + 'st ' + this.updatedDate.month
                break;
            case 2:
                lastUpdateText = 'Last Update : ' + this.updatedDate.day + 'nd ' + this.updatedDate.month
                break;
            default:
                lastUpdateText = 'Last Update : ' + this.updatedDate.day + 'th ' + this.updatedDate.month
                break;
        }
        const lastUpdate = eHtml({ class: 'postLastUpdate', text: lastUpdateText, container: footer });
        //post categories tree
        this.createCatTree().appendTo(footer);
    }

    //create post likes:
    createPostLikes() {
        //check if the user already liked the post : 
        const alreadyLiked = this.likers.filter((l) => {
            return l.id == this.userInfo.id
        }).length > 0;
        //likes container: 
        const container = eHtml({ class: 'likesContainer' });
        const likeIconC = eHtml({ class: 'likeIconContainer', container: container })
        //like icon: 
        alreadyLiked ?
            likeIconC.html('<i class="fas fa-heart"></i>') :
            likeIconC.html('<i class="far fa-heart"></i>');
        //likes count:
        eHtml({ class: 'pLikesCount', text: this.likesCount, container: container, onClick: this.showLikers });
        //like label:
        let likeLabel;
        this.likesCount > 1 ?
            likeLabel = 'Likes' :
            likeLabel = 'Like';
        eHtml({ class: 'pLikesLabel', text: likeLabel, container: container, onClick: this.showLikers });

        //on icon container click: 
        likeIconC.click(() => {
            //apply classes and animate:

            //send like request:
            $.post(this.phpUtils, { postLike: true, id: this.id }, (res) => {
                //update likes count likers:

                //stop animate:
            }, 'json')
        });

        return container;
    }

    //create post comments:
    createPostComments() {
        const container = eHtml({ class: 'pCommentsContainer' });
        //icon
        eHtml({ class: 'pCommentIconContainer', container: container, html: '<i class="fas fa-comment-alt"></i>', onClick: this.showComments });
        //count
        eHtml({ class: 'pCommentsCount', text: this.commentsCount, container: container, onClick: this.showComments })
        //label
        let label;
        this.commentsCount > 1 ?
            label = 'comments' :
            label = 'comment';
        eHtml({ class: 'pCommentLabel', container: container, text: label, onClick: this.showComments })
        return container;
    }

    //show likers: 
    showLikers() {
        //todo
        console.log('likes')
    }

    //show comments: 
    showComments() {
        //todo
        console.log('comments');
    }
}

class Comment {
    constructor(data) {
        this.comment = data.comment;
        this.body = this.comment.body;
        this.updatedAt = this.comment.updatedAt;
        this.likesCount = this.comment.likesCount;
        this.likers = this.comment.likers;
        this.replaysCount = this.comment.replaysCount;
        this.replays = this.comment.replays;
        this.authorInfo = this.comment.authorInfo;
    }
}

class Replay {
    constructor(data) {
        this.replay = data.replay;
        this.body = this.replay.body;
        this.updatedAt = this.replay.updatedAt;
        this.likesCount = this.replay.likesCount;
        this.authorInfo = this.replay.authorInfo;
    }
}

//create html element:
function eHtml(data) {
    data.type ? e = $('<' + data.type + '>') : e = $('<div>');

    if (data.class) {
        e.addClass(data.class);
    }

    if (data.id) {
        e.attr('id', data.id);
    }

    if (data.html) {
        e.html(data.html);
    }

    if (data.text) {
        e.text(data.text);
    }

    if (data.container) {
        e.appendTo(data.container);
    }

    if (data.name) {
        e.attr('name', data.name);
    }

    if (data.value) {
        e.attr('value', data.value);
    }

    if (data.onClick) {
        e.click(() => {
            data.onClick(data.params)
        });
    }

    return e;
}

//loading page:
function startLoading() {
    const pageContainer = $('#pageContainer');
    const loadingContainer = eHtml({ class: 'loadingContainer', id: 'loadingContainer', html: '<i class="fas fa-spinner loading-icon rotate"></i>', container: pageContainer });
}
