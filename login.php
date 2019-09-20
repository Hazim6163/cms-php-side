<?php
$title = 'Login';
global $validateErr;
global $errMsg;

include('include/header.php');
include('include/navbar.php');
?>


<!--   main content     -->
<div class="container">


    <!--               login title -->
    <div class="formTitle">
        <h2>Login</h2>
    </div>

    <form action="login.php" method="post">
        <!--username inputGroup-->
        <div class="inputGroup">
            <div class="inputDescription">Username or E-mail address: </div>
            <input name="username">
        </div>
        <!--password inputGroup-->
        <div class="inputGroup">
            <div class="inputDescription">Password: </div>
            <input type="password" name="password">
        </div>
        <!--password inputGroup-->
        <?php
            if ($validateErr){?>

        <div class="invalidEntry">
            <span><?php
                    echo $errMsg;
                    ?></span></div>
</div>
<!--username inputGroup-->
<?php
            }else{ ?>

<div class="moreFormDetails">
    or create a new account <a href="signup.php">register</a>
</div><?php }?>
<!--submit form-->
<input type="submit" id="submitFormBtn" value="Login">
</form>
<!--login form-->

</div>
<!--container-->

<?php
include('include/footer.php');
?>
