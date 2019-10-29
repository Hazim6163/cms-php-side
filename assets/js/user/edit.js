//get user data: 
getUserInfo((userInfo) => {
    //inflate page:
    inflatePage(userInfo);
});

//page inflater function 
function inflatePage(userInfo) {
    //get page container 
    const pContainer = $('#pageContainer');

    //inflate user form:
    inflateUserForm(pContainer, userInfo);

}

//user img vars.
let uImgUrl = '';

//inflate user form:
function inflateUserForm(pContainer, userInfo) {
    //edit user form container :
    const userFContainer = htmlE({ type: 'div', class: 'userFContainer', id: 'userFContainer', container: pContainer });

    //user form: 
    const uForm = htmlE({ type: 'form', class: 'userForm', id: 'userForm', container: userFContainer });
    uForm.attr('method', 'POST')

    //user img:
    const imgInput = htmlE({ type: 'input', container: uForm, id: 'imgInput' });
    imgInput.attr('name', 'img');
    imgInput.attr('type', 'file');
    imgInput.attr('accept', 'image/*');
    imgInput.hide();

    uForm.append(createUserImg(userInfo.photoUrl));

    //user fname:
    const t2 = htmlE({ type: 'div', class: 'fnameIGroup', container: uForm });
    inputGroup({ name: 'fname', des: 'First Name', type: 'text', holder: 'Enter Your First Name .', c: t2, text: userInfo.fname });
    //user lname: 
    const t3 = htmlE({ type: 'div', class: 'lnameIGroup', container: uForm });
    inputGroup({ name: 'lname', des: 'Last Name', type: 'text', holder: 'Enter Your Last Name .', c: t3, text: userInfo.lname });
    //username :
    const t4 = htmlE({ type: 'div', class: 'usernameIGroup', container: uForm });
    inputGroup({ name: 'username', des: 'Username', type: 'text', holder: 'Enter Your Username .', c: t4, text: userInfo.username });
    //email:
    const t5 = htmlE({ type: 'div', class: 'emailIGroup', container: uForm });
    inputGroup({ name: 'email', des: 'E-Mail', type: 'email', holder: 'Enter Your E-Mail Address .', c: t5, text: userInfo.email });
    //old password:
    const t6 = htmlE({ type: 'div', class: 'passwordIGroup', container: uForm });
    inputGroup({ name: 'oldPass', des: 'old Password', type: 'password', holder: 'old password', c: t6 });
    //New password:
    const t7 = htmlE({ type: 'div', class: 'passwordIGroup', container: uForm });
    inputGroup({ name: 'password', des: 'Password', type: 'password', holder: 'Password', c: t7 });
    //new password2:
    const t8 = htmlE({ type: 'div', class: 'passwordIGroup', container: uForm });
    inputGroup({ name: 'password2', des: 'Confirm Password', type: 'password', holder: 'Confirm Password .', c: t8 });
    //error msg.
    const err = htmlE({ type: 'div', id: 'errMsg', container: uForm });
    //submit:
    const t9 = htmlE({ type: 'button', class: 'submitF', id: 'submitF', container: uForm, text: 'Save' });
    t9.attr('type', 'submit');
    t9.attr('name', 'edit');
    // Listen to submit event on the <form> itself!
    uForm.submit(function (e) {

        // Prevent form submission which refreshes page
        e.preventDefault();

        //set empty img value if no image provided:
        if (!$('#userImg').attr('src')) {
            $('#userImg').attr('src', '')
        }
        //check passwords: 
        if (t7.get(0).firstChild.lastChild.value != t8.get(0).firstChild.lastChild.value) {
            $('#errMsg').text('both password and confirm password should be same. ');
            return;
        }

        //check if the use photo has changed:
        let imgChanged;
        (userInfo.photoUrl == uImgUrl) ? imgChanged = false : imgChanged = true;
        //extract data to send :
        const edit = true;
        const fname = t2.get(0).firstChild.lastChild.value;
        const lname = t3.get(0).firstChild.lastChild.value;
        const username = t4.get(0).firstChild.lastChild.value;
        const email = t5.get(0).firstChild.lastChild.value;
        const oldPass = t6.get(0).firstChild.lastChild.value;
        const password = t7.get(0).firstChild.lastChild.value;
        const img = uImgUrl;
        //setup the data from:
        let formData;
        //image changed form:
        if (imgChanged) {
            formData = { edit, fname, lname, username, email, oldPass, password, img, imgChanged, };
        } else {
            formData = { edit, fname, lname, username, email, oldPass, password, imgChanged, };
        }

        $.post('./edit.php', formData, (res) => {
            $('#errMsg').hide()
            if (res.error) {
                $('#errMsg').show()
                $('#errMsg').text(res.error);
            } else {
                $.post('./edit.php', { updateUser: true }, (res2) => {
                    window.location.href = window.location.href
                });
            }
        }, 'json')
    });
}

function createUserImg(url) {
    uImgUrl = url;
    //post img container
    const userImgContainer = $('<div>', {
        class: 'userImgContainer',
        id: 'userImgContainer'
    });
    //remove img icon:
    const removeImgIconContainer = $('<div>', {
        class: 'removeImgIconContainer'
    });
    removeImgIconContainer.appendTo(userImgContainer).hide();
    //img 
    const imgHolder = $('<img>', {
        class: 'userImg',
        id: 'userImg'
    }).hide().appendTo(userImgContainer).click(() => {
        $('#imgInput').trigger('click');
    });
    const removeImgIcon = $('<span>', {
        class: 'removeImgIcon',
        id: 'removeImgIcon'
    }).appendTo(removeImgIconContainer).click(() => {
        uImgUrl = '';
        //remove user img from img
        imgHolder.attr('src', null);
        //remove remove icon 
        removeImgIconContainer.remove();
        //remove img container:
        imgHolder.hide('fast');
        //show choose img icon container:
        iconContainer.show('fast');
    });
    removeImgIcon.html('<i class="far fa-trash-alt"></i>');
    //icon container
    const iconContainer = $('<div>', {
        class: 'userImgIconContainer',
        id: 'userImgIconContainer'
    }).html('<i class="far fa-user"></i>').click(() => {
        $('#imgInput').trigger('click');
    });
    userImgContainer.append(iconContainer);
    //check if the user has img
    if (url) {
        imgHolder.attr('src', 'http://localhost:3000/user/profilePhoto?id=' + url);
        //hide and show containers:
        removeImgIconContainer.show()
        iconContainer.hide()
        imgHolder.show();
    }

    // where the img will cropped
    $image_crop = $('#image_demo').croppie({
        enableExif: true,
        viewport: {
            width: 300,
            height: 300,
            type: 'circle' //circle square
        },
        boundary: {
            width: 500,
            height: 500
        }
    });
    $('#imgInput').change(() => {
        var reader = new FileReader();
        reader.onload = function (event) {
            $image_crop.croppie('bind', {
                url: event.target.result
            })
        }
        reader.readAsDataURL($('#imgInput').get(0).files[0]);
        $('#modalDialogCrop').css('display', 'block');
    });
    //get close modal btn: 
    $('#closeModalBtn').click(() => {
        $('#modalDialogCrop').css('display', 'none');
    })
    //save btn:
    // on crop opr finish and click on the save btn
    $('#crop_image').click(() => {
        $image_crop.croppie('result', {
            type: 'canvas',
            size: 'viewport'
        }).then(function (response) {
            $.ajax({
                url: "./edit.php",
                type: "POST",
                data: {
                    "saveImg": true,
                    "image": response
                },
                success: function (data) {
                    $('#modalDialogCrop').css('display', 'none');
                    iconContainer.hide('fast');
                    imgHolder.attr('src', data).show('fast');
                    uImgUrl = data;
                    userImgContainer.prepend(removeImgIconContainer).click(() => {
                        uImgUrl = '';
                        //remove user img from img
                        $('#userImg').attr('src', null);
                        //remove remove icon 
                        removeImgIconContainer.remove();
                        //remove img container:
                        $('#userImg').hide('fast');
                        //show choose img icon container:
                        iconContainer.show('fast');
                    });
                }
            });
        })
    });
    return userImgContainer;
}

//inflate input group:
function inputGroup(data) {
    const group = htmlE({ type: 'div', class: 'inputGroup', container: data.c })
    htmlE({ container: group, type: 'div', class: 'inputDes', text: data.des + ' :' });
    htmlE({ container: group, type: 'input', class: 'input' }).attr('type', data.type).attr('name', data.name).attr('placeholder', data.holder).val(data.text);
}

//create html element:
function htmlE(data) {
    const e = $('<' + data.type + '>')

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

    if (data.onClick) {
        e.click(() => {
            data.onClick(data.params)
        });
    }

    return e;
}

//log obj
function logObj(msg, obj) {
    console.log('*************************************')
    console.log(msg);
    console.log('++++++++++++++++++++++++++++++++')
    console.log(obj);
    console.log('*************************************')
}