$(document).ready(function () {

  //to open the upload file window on click add img icon
  $('#addProfilePic').click(function () { $('#profilePic').trigger('click'); });
  //to open the upload file window on click the selected img 
  $('#afterImgSelectImg').click(function () { $('#profilePic').trigger('click'); });

  // where the img will cropped
  $image_crop = $('#image_demo').croppie({
    enableExif: true,
    viewport: {
      width: 150,
      height: 150,
      type: 'circle' //circle square
    },
    boundary: {
      width: 300,
      height: 300
    }
  });

  // to open the modal when the image is selected
  $('#profilePic').on('change', function () {
    var reader = new FileReader();
    reader.onload = function (event) {
      $image_crop.croppie('bind', {
        url: event.target.result
      }).then(function () {
        console.log('jQuery bind complete');
      });
    }
    reader.readAsDataURL(this.files[0]);
    $('#modalDialogCrop').css('display', 'block');
  });

  // on crop opr finish and click on the save btn
  $('#crop_image').click(function (event) {
    $image_crop.croppie('result', {
      type: 'canvas',
      size: 'viewport'
    }).then(function (response) {
      $.ajax({
        url: "cropImg.php",
        type: "POST",
        data: {
          "image": response
        },
        success: function (data) {
          $('#modalDialogCrop').css('display', 'none');
          $('#afterImgSelectImg').html('<img src="' + data + '" class="img-thumbnail" />');
          $('.afterImgSelect').css('display', 'block');
          $('.beforeImgSelect').css('display', 'none');
          $('#profilePicAfterCrop').val(data);
        }
      });
    })
  });

  //to close Modal on close btn clicked:
  $('#closeModalBtn').click((event) => {
    console.log('done');
    $('#modalDialogCrop').css('display', 'none');
  });

});
