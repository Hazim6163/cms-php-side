<?php

$title = 'Confirm Account';
$costumeCss = '
<link href="https://fonts.googleapis.com/css?family=Open+Sans&display=swap" rel="stylesheet">

';

// check if the token is available :
session_start();
if(!isset($_SESSION['token'])){
    header('Location: ../login.php');
}

//check if the user already confirmed the account: 
if($_SESSION['verified'] == 1){ //TODO: set the verified to 1 after login and after conformation
    header('Location: ../index.php');
}

//the user need to confirm the account :

//extract the data from the session:
$token = $_SESSION['token'];

//the user need to confirm the account :

$vKey;
$email = $_SESSION['email'];
$fname = $_SESSION['fname'];

if(isset($_POST['submit'])){

    //get the vKey from the user: 
        $uVKey = (int)$_POST['vKey'];

    //send the post request to the server ->
        $url = 'http://localhost:3000/users/confirm';
        $postFields = array(
            'vKey' => $uVKey
        );
        $postFields = json_encode($postFields);
        $options = array(
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_CUSTOMREQUEST => 'PATCH',
            CURLOPT_POSTFIELDS => $postFields,
            CURLOPT_HTTPHEADER => array('Content-type: application/json', 'Authorization: '.$token)
        );
        $ch = curl_init($url);
        curl_setopt_array($ch, $options);

        $result = curl_exec($ch);
        $info = curl_getinfo($ch);
        curl_close($ch);

        $responseCode = $info['http_code'];
        $result = json_decode($result);

    if($responseCode != 200){
        $_SESSION['error'] = $result->error;

    }else{
        //catch the verified value from the server 
        $verified = $result->verified;

        //compare the vKeys:
        if($verified == 1){
            //conformation successfully: 
                $_SESSION['verified'] = 1 ;
                header('Location: ../index.php');
        }else {
            //confirmation failed:
                $_SESSION['error'] = 'Wrong confirmation Code';
        }
    }
}


include('../include/header.php');
include('../include/navbar.php');
?>

<!-- create confirmation form -->
<style>
  
  .container{
        font-family: 'Open Sans';
    }

    .content{
        text-align: center;
        padding-left: 36px;
    }

    .title{
        box-sizing: border-box;
        width:100%;
        text-align: center;
        padding-bottom: 36px;
        color: #a74165;
    }

    .inputGroup-6 > .inputDescription {
        text-align: left;
        padding-left: 8px;
    }

    .vKey-input{
        appearance: none;
    }

    input[type='number'] {
        -moz-appearance:textfield;
    }

    input::-webkit-outer-spin-button,
    input::-webkit-inner-spin-button {
        -webkit-appearance: none;
    }

    #submitFormBtn{
        margin-top: 16px;
    }

    .inputGroup-6 {
        margin-bottom: 0px;
    }

    .invalidEntry {
        margin:16px 0px 0px 0px;
    }

</style>

<div class="container">
    <h1 class="title">Welcome <?php echo($fname) ?> !!</h1>
    <div class="content">
        <p>we already sent you the confirmation code to your E-mail: <b><?php echo($email) ?></b>.</p>
        <p style="padding: 16px;">please enter the confirmation Code:</p>
        <form action="" method="post">
            <div class="inputGroup-6 vKey-input">
                <div class="inputDescription">vKey: </div>
                <input name="vKey" type="number">
            </div>
            <?php if (isset($_SESSION['error'])){ ?>
                <div class="invalidEntry">
                    <span><?php echo $_SESSION['error']; unset($_SESSION['error']); ?></span>
                </div>
            <?php } ?>
            <input type="submit" id="submitFormBtn" name="submit" value="confirm">
        </form>
    </div>
</div>