<?php
require 'vendor/autoload.php';

$dotenv = Dotenv\Dotenv::create(__DIR__, 'sendgrid.env');
$dotenv->load();

$title = 'Signup';
$costumeCss = '<link rel="stylesheet" href="assets/css/croppie.css" type="text/css">';
global $validateErr;
global $errMsg;

if (isset($_POST['submit'])){

    //check if signup submit: 
    if($_POST['submit'] != 'Signup'){
        header('Refresh:0');
    }

    //handle the request and extract the values:
    $fname= $_POST['fname'];
    $lname= $_POST['lname'];
    $username= $_POST['username'];
    $email= $_POST['email'];
    $password= $_POST['password'];
    $img = $_POST['profilePicAfterCrop'];

    /** send the data to the main server : */

    // init url:
    $url = 'http://localhost:3000/users/register';

    //create the verification code : 
    $vKey = rand(100000, 999999);

    /**
     * check if there is an img
     */
    $user;
    if(!empty($img)){
        // create the img file : 
        $file = curl_file_create ( realpath($img) );
        //user obj: 
        $user = array(
            'fname' => $fname,
            'lname' => $lname,
            'username' => $username,
            'email' => $email,
            'password' => $password,
            'vKey' => $vKey,
            'img' => $file
        );
    }else{
        //user obj: 
        $user = array(
            'fname' => $fname,
            'lname' => $lname,
            'username' => $username,
            'email' => $email,
            'password' => $password,
            'vKey' => $vKey
        );
    }
    
    //init curl:
    $ch = curl_init($url);
    // Configuring curl options
    $options = array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POST => 1,
        CURLOPT_POSTFIELDS => $user
    );
    
    // Setting curl options
    curl_setopt_array( $ch, $options );

    // Getting results
    $result = curl_exec($ch); // Getting jSON result string

    $info = curl_getinfo($ch);
    curl_close($ch);

    $responseCode = $info['http_code'];
    $result = json_decode($result);


    if($responseCode == 406 || $responseCode == 400){
        $GLOBALS['validateErr'] = true;
        $GLOBALS['errMsg'] = $result->error;
    }else{
        session_start();
        $_SESSION['token'] = $result->token;
        $_SESSION['username'] = $username;
        $_SESSION['verified'] = 0;
        $_SESSION['email'] = $email;
        $_SESSION['fname'] = $fname;
        session_write_close();

        //delete the user img form php server because it saved in the server ->
        unlink($img);

        //Send the Validation vKey Email:
        /*$Semail = new \SendGrid\Mail\Mail(); 
        $Semail->setFrom("CMS@example.com", "CMS PROJECT");
        $Semail->setSubject("Please confirm you E-mail");
        $Semail->addTo($email, $fname . ' ' .$lname);
        $Semail->addContent(
            "text/html", "<strong>vKey: </strong>".$vKey //add custom html here
        );
        $sendgrid = new \SendGrid(getenv('SENDGRID_API_KEY'));*/
        try {
            //$response = $sendgrid->send($Semail);
            //print $response->statusCode() . "<br>"; //to get the response code
            //print_r($response->headers());    //to get the response Header
            //print $response->body() . "<br>"; //to get the response body
            header('Location: ./validation/signup.php');
        } catch (Exception $e) {
            echo 'Caught exception: '. $e->getMessage() ."<br>";
        }

    }

}


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
        <div class="inputGroup-6">
            <div class="inputDescription">First Name: </div>
            <input name="fname" type="text">
        </div>
        <!--name inputGroup-->
        <div class="inputGroup-6">
            <div class="inputDescription">Last Name: </div>
            <input name="lname" type="text">
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
        </div>
        <!--password inputGroup-->
        <!-- profile pic-->
        <input name="profilePic" id="profilePic" type="file" style="display: none" accept="image/*">
        <input name="profilePicAfterCrop" id="profilePicAfterCrop" type="text" style="display: none">
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
    already have an account <a href="login.php">Login</a>
</div><?php }?>
<!--submit form-->
<input type="submit" id="submitFormBtn" name="submit" value="Signup">
</form>
<!--Signup form-->


<!-- crop img modal dialog -->
<div class="modalDialogCrop" id="modalDialogCrop">
    <div class="modal-content">
        <div class="modal-body">
            <span class="close" id="closeModalBtn">&times;</span>
            <div id="image_demo" style="width:350px; margin-top:30px"></div>
            <button class="mdc-button mdc-button--raised" id="crop_image">
                <i class="material-icons mdc-button__icon" aria-hidden="true">save</i>
                <span class="mdc-button__label">Save</span>
            </button>
        </div>
    </div>
</div><!-- crop img dialog -->

</div>
<!--container-->


<!--croppie script -->
<script type="text/javascript" src="assets/js/croppie.js"></script>
<script type="text/javascript" src="assets/js/register.js"></script>
<?php
include('include/footer.php');
?>