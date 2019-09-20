<?php
$title = 'Login';
global $validateErr;
global $errMsg;

include('include/header.php');
include('include/navbar.php');
?>


<!--   main content     -->
<div class="container">

<!-- login form -->
<div class="mainContent">
<!--               login title -->
        <h2 class="formTitle">Login</h2>
        <form action="login.php" method="post">
            <!--username inputGroup-->
            <div class="inputGroup">
               <div class="inputDescription">Username: </div>
                <input name="username">
            </div>
            <!--password inputGroup-->
            <div class="inputGroup">
               <div class="inputDescription">Password: </div>
                <input type="password" name="password">
            </div><!--password inputGroup-->
            <?php
            if ($validateErr){?>

                <div class="invalidEntry">
                    <span><?php
                    echo $errMsg;
                    ?></span></div>
                </div><!--username inputGroup-->
            <?php
            }else{ ?>

            <div class="registerInLogin">
or create a new account <a href="register.php">register</a>
            </div><?php }?>
        <!--submit form-->
        <input type="submit" id="loginBtn" value="Login">
        </form><!--login form-->

    </div><!--main content-->

<?php
include('include/footer.php');
?>
