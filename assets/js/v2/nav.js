//vars: 
const userImgBaseUrl = 'http://localhost:3000/user/profilePhoto?id='

//user menu icon vars:
var NavbarUserMenuOpened = false;
//side nav vars:
var sideNavigateOpened = false;
//navbar toggle vars:
var navbarOpened = true;

//create navbar:
const createNavBar = (userInfo) => {
    const userImg = userInfo.photoUrl;
    const admin = 1;//userInfo.admin;
    const userId = userInfo.id;
    const notificationsCount = 15; //TODO user notifications

    //set notifications count:
    $('#navMenuNotificationsCount').html(notificationsCount);
    /***set user img:**/
    //check if the user has img:
    if (userImg) {
        //user has img
        const UserImg = $('<img>', {
            class: 'userMenuUserImg'
        }).attr('src', userImgBaseUrl + userImg);
        $('#userMenuUserImgContainer').append(UserImg);
    } else {
        //create user icon
        const userIcon = $('<div>', {
            class: 'userMenuUserIcon'
        }).html('userIcon');
        $('#userMenuUserImgContainer').append(userIcon);
    }

    //on user menu icon click:
    $('#navMenuUserMenuToggleIcon').click(() => {
        NavbarUserMenuOpened = !NavbarUserMenuOpened;
        //get user menu items:
        const toggleIcon = $('#userMenuToggleIcon');
        const menu = $('#userMenuContent');
        const $profile = $('#navUserProfileLink');
        const $logout = $('#navUserLogoutLink');
        //show user menu:
        menu.toggleClass('showUserMenu');
        //remove hide class:
        menu.toggleClass('userMenuContent');
        //set the position:
        $(window).on('resize', (e) => {
            const x = toggleIcon.offset().left - toggleIcon.width();
            const xMargin = x - 16;
            menu.css('left', xMargin);
        })
        const x = toggleIcon.offset().left - toggleIcon.width();
        const xMargin = x - 16;
        menu.css('left', xMargin);

        //on logout click 
        $logout.click(() => {
            //send to logout request:
            $.post('../classes/utils.php', { logoutRequest: true }, (res) => {
                if (res.result) {
                    window.location.href = "../index.php";
                }
            }, 'json');
        });

        //on Profile click:
        $profile.click(() => {
            window.location.href = "../error.php?id=" + userId; //TODO create user page
        });
    });

    //check if the user is admin : 
    var panelBtn;
    if (admin == 1) {
        panelBtn = $('<div>', {
            id: 'navigateMenuLinkPanel',
            class: 'nav-link'
        }).html('Panel');
        $('#NavbarNavigateMenu').append(panelBtn);
        panelBtn.click(() => {
            window.location.href = '../error.php?id=adminPanel'; //TODO CREATE ADMIN PANEL PAGE
        })
    }

    //Home click
    const HomeBtn = $('#navigateMenuLinkHome');
    HomeBtn.click(() => {
        window.location.href = '../index.php';
    });

    //categories click:
    const CategoriesBtn = $('#navigateMenuLinkCategories');
    CategoriesBtn.click(() => {
        window.location.href = '../index.php';//TODO CREATE CATEGORIES PAGE 
    });

    //toggle side bar
    const sideToggleIcon = $('#toggleSideNavigateMenu');
    const sideNav = $('#sideNavigate').hide();
    const sideMenu = $('<div>', {
        id: 'navbarNavigateSideMenu',
        class: 'navbarNavigateSideMenu'
    }).append(HomeBtn.clone(true)).append(CategoriesBtn.clone(true)).append(panelBtn.clone(true)).appendTo(sideNav);

    sideToggleIcon.click(() => {
        if (sideNavigateOpened) {
            /**************close the nav**************/
            //change icon:
            sideToggleIcon.html('<i class="fas fa-bars"></i>');
            sideNav.toggle('fast');
            //toggle bool:
            sideNavigateOpened = !sideNavigateOpened;
            //change page wrapper margin:
            $('#pageWrapper').css('margin-top', '150px');
            $('#pageContainer').toggle('fast');
            return;
        }
        /************** open the nav**************/
        console.log('open')
        //change icon
        sideToggleIcon.html('<i class="fas fa-times"></i>');
        //add the menu to side nav:
        sideNav.toggle('fast');
        //toggle bool
        sideNavigateOpened = !sideNavigateOpened;
        //change page wrapper margin
        $('#pageWrapper').css('margin-top', '125px');
        $('#pageContainer').toggle('fast');

    });

    //toggle navbar:
    const toggleNav = $('<div>', {
        id: 'navbarToggler',
        class: 'navbarToggler'
    }).html('<i class="fas fa-chevron-up"></i>');
    $('body').append(toggleNav);
    toggleNav.click(() => {
        if (navbarOpened) {
            //close
            $('#navbar').hide('fast');
            navbarOpened = false;
            toggleNav.toggleClass('navbarTogglerActive');
            //change to open icon:
            toggleNav.html('<i class="fas fa-chevron-down"></i>');
            //changes to add when the nav is closed
            $('#pageWrapper').toggleClass('navbarToggleActivePageWrapper');
            sideNav.css('margin-top', '-40px');
            $('#toolbarContainer').toggleClass('navbarToggleActiveToolbar')//.css('top', '76px');
            return;
        }
        //open
        $('#navbar').show('fast');
        navbarOpened = true;
        //change to close icon
        toggleNav.html('<i class="fas fa-chevron-up"></i>')
        //changes to add when the nav is opened
        toggleNav.toggleClass('navbarTogglerActive');
        $('#pageWrapper').toggleClass('navbarToggleActivePageWrapper');
        sideNav.css('margin-top', '0px');
        $('#toolbarContainer').toggleClass('navbarToggleActiveToolbar')//.css('top', '196px');


    });
}

//fetch user info to create the navbar 
getUserInfo(createNavBar);

// get user information:
function getUserInfo(nextFun) {
    //get user information
    $.post('../classes/utils.php', { getUserInfo: true }, (res) => {
        nextFun(res);
    }, 'json')
}
