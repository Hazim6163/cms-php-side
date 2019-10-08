<?php
$title = 'Login';
$custom_head = '
<link rel="stylesheet" href="./assets/css/main.css" type="text/css">
';

//check if the user already logged in :
session_start();
if(isset($_SESSION['token'])){
    header('Location: ./index.php');
}      

$isErr = false;
$errMsg;

if (isset($_POST['submit'])) {

    $requestBody = array(
        'usernameOrEmail' => $_POST['username'],
        'password' => $_POST['password']
    );
    $requestBody = json_encode($requestBody);

   $url = 'http://localhost:3000/users/login';
   $options = array(
    CURLOPT_RETURNTRANSFER => TRUE,
    CURLOPT_CUSTOMREQUEST => 'POST',
    CURLOPT_POSTFIELDS => $requestBody,
    CURLOPT_HTTPHEADER => array('Content-type: application/json')
   );
   $ch = curl_init($url);
   curl_setopt_array($ch, $options);

   $result = curl_exec($ch);
   $result = json_decode($result);
   $info = curl_getinfo($ch);
   $responseCode = $info['http_code'];
   curl_close($ch);

   if(!($responseCode == 200)){
        $isErr = true;
        $errMsg = $result->error;
    }else {
        //done
        $_SESSION['token'] = $result->token;
        $userInfo = getUserInfo($result->token);
        $_SESSION['userInfo'] = $userInfo;
        session_write_close();
        header('Location: ./index.php');
   }
}

function getUserInfo($token){
    $url = 'http://localhost:3000/users/getUserCard';
    $requestHeaders = array(
        'Authorization: '.$token
    );
    //init curl:
    $ch = curl_init($url);
    // Configuring curl options
    $options = array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER => $requestHeaders
    );
    
    // Setting curl options
    curl_setopt_array( $ch, $options );

    // Getting results
    $result = curl_exec($ch); // Getting jSON result string

    $info = curl_getinfo($ch);
    curl_close($ch);

    $responseCode = $info['http_code'];
    $result = json_decode($result);
    return $result;
}

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
            <input name="username" required>
        </div>
        <!--password inputGroup-->
        <div class="inputGroup">
            <div class="inputDescription">Password: </div>
            <input type="password" name="password" required>
        </div>
        <!--password inputGroup-->
        <?php
            if ($isErr){?>

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
<input type="submit" id="submitFormBtn" name="submit" value="Login">
</form>
<!--login form-->

</div>
<!--container-->

<?php
include('include/footer.php');
?>
