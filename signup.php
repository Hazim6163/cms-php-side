<?php
$title = 'Signup';
$costumeCss = '<link rel="stylesheet" href="assets/css/croppie.css" type="text/css">';
global $validateErr;
global $errMsg;

include('include/header.php');
include('include/navbar.php');
?>



<!--   main content     -->
<div class="container">


<!--               Signup title -->
  <div class="formTitle">
    <h2>Signup</h2>
  </div>

        <form action="signup.php" method="post">


            <!-- photo -->
            <div class="profilePhoto">
              <div class="beforeImgSelect">
                <i class="material-icons profileIcon">
                  account_circle
                </i>
                <i class="material-icons addProfileIcon" id="addProfilePic">
                  photo_camera
                </i>
              </div>
              <div class="afterImgSelect">
                <div id="afterImgSelectImg"></div>
              </div>
            </div>
            <!--name inputGroup-->
            <div class="inputGroup">
               <div class="inputDescription">Name: </div>
                <input name="name" type="text">
            </div>
            <!--username inputGroup-->
            <div class="inputGroup">
               <div class="inputDescription">Username: </div>
                <input name="username" type="text">
            </div>
            <!--Email-address inputGroup-->
            <div class="inputGroup">
               <div class="inputDescription">E-mail address: </div>
                <input name="email" type="email">
            </div>
            <!--password inputGroup-->
            <div class="inputGroup">
               <div class="inputDescription">Password: </div>
                <input type="password" name="password">
            </div><!--password inputGroup-->
            <!-- profile pic-->
            <input name="profilePic" id="profilePic" type="file" style="display: none" accept="image/*">
            <input name="profilePicAfterCrop" id="profilePicAfterCrop" type="text" style="display: none">
            <?php
            if ($validateErr){?>

                <div class="invalidEntry">
                    <span><?php
                    echo $errMsg;
                    ?></span></div>
                </div><!--username inputGroup-->
            <?php
            }else{ ?>

            <div class="moreFormDetails">
already have an account <a href="login.php">Login</a>
            </div><?php }?>
        <!--submit form-->
        <input type="submit" id="submitFormBtn" value="Signup">
        </form><!--Signup form-->


<!-- crop img modal dialog -->
        <div class="modalDialogCrop" id="modalDialogCrop">
              <div class="modal-content">
                <div class="modal-body">
                  <span class="close">&times;</span>
                  <div id="image_demo" style="width:350px; margin-top:30px"></div>
                  <button class="" id="crop_image">Crop & Upload Image</button>
                </div>
              </div>
        </div><!-- crop img dialog -->

    </div><!--container-->


<!--croppie script -->
<script type="text/javascript" src="assets/js/croppie.js"></script>
<script type="text/javascript" src="assets/js/register.js"></script>
<?php
include('include/footer.php');
?>
