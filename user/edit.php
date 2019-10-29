<?php
require('../classes/utils.php');

//save user img locally 
if(isset($_POST["saveImg"])){
	$data = $_POST["image"];
	$image_array_1 = explode(";", $data);
	$image_array_2 = explode(",", $image_array_1[1]);
	$data = base64_decode($image_array_2[1]);

	$imageName = './temp/'. time() . '.png';
	file_put_contents($imageName, $data);
    echo $imageName;
    
    return;
}

//submit edit:
if(isset($_POST['edit'])){
    session_start();
    $url = 'http://localhost:3000/users/edit';
    $postData = array(
        'fname' => $_POST['fname'],
        'lname' => $_POST['lname'],
        'username' => $_POST['username'],
        'email' => $_POST['email'],
        'password' => $_POST['password'],
        'oldPassword' => $_POST['oldPass'],
        'imgChanged' => $_POST['imgChanged']
    );
    //append the img to post data if the img changed and not empty
    if(userImgChangedNotEmpty($_POST)){
        $file = curl_file_create ( realpath($_POST['img']) );
        $postData['img'] = $file;
    }
    //set request headers:
    $requestHeaders = array(
        'Authorization: '.$_SESSION['token']
    );
    //send patch request:
    $res = Utils::patchRequest($url, $postData, $requestHeaders);
    //remove img file after send the request:
    if(userImgChangedNotEmpty($_POST)){
        unlink($_POST['img']);
    }
    
    echo($res);
    return;
}
//check if the user img has changed and not empty
function userImgChangedNotEmpty($data){
    if($data['imgChanged']){
        if(isset($data['img'])){
            if($data['img'] != ''){
                return true;
            }
        }
    }
    return false;
}

if(isset($_POST['updateUser'])){
    session_start();
    $_SESSION['userInfo'] = getUserInfo($_SESSION['token']);
    return;
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

//logged in status:
global $loggedIn;

$custom_headers = '
<link rel="stylesheet" href="../assets/css/croppie.css" type="text/css">
<link rel="stylesheet" href="../assets/css/user/edit.css">
';


include('../include/v2/head.php');
include('../include/v2/nav.php');
if(!$loggedIn){
    header('Location: ./../index.php');
}
?>

<div class="pageWrapper" id="pageWrapper">
    <div class="sideNavigate" id="sideNavigate"></div>
    <div class="pageContainer" id="pageContainer"></div>
</div>

<!-- crop img modal dialog -->
<div class="modalDialogCrop" id="modalDialogCrop">
    <div class="modal-content">
        <div class="modal-body">
            <div class="closeModalContainer">
                <span class="close" id="closeModalBtn">&times;</span>
            </div>
            <div id="image_demo" style="width:350px; margin-top:30px"></div>
            <button class="mdc-button mdc-button--raised" id="crop_image">
                <span>Save</span>
            </button>
        </div>
    </div>
</div><!-- crop img dialog -->

<script type="text/javascript" src="../assets/js/croppie.js"></script>
<script src="../assets/js/user/edit.js"></script>
<?php include('../include/v2/footer.php'); ?>
