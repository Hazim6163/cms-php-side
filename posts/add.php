<?php

/****************** editor requests **********/
//save post:
if(isset($_POST['savePost'])){
    session_start();
    $url = 'http://localhost:3000/posts/add';
    $postData = array(
        'title' => $_POST['title'],
        'des' => $_POST['des'],
        'body' => $_POST['body'],
        'tags' => $_POST['tags'],
        'parentId' => $_POST['category'],
        'showInActivity' => $_POST['showInActivity'],
    );
    //check if the post has img:
    if(!empty($_POST['img'])){
        // create the img file : 
        $file = curl_file_create ( realpath($_POST['img']) );
        $postData['img'] = $file;
    }
    $requestHeaders = array(
        'Authorization: '.$_SESSION['token']
    );
    require('../classes/utils.php');
    $res = Utils::postRequest($url, $postData, $requestHeaders);
    
    echo($res);
    return;
}

//search tag:
if(isset($_POST['searchTag'])){
    $chars = $_POST['word'];
    $url = 'http://localhost:3000/search/tags?chars=' . $chars;
    require('../classes/utils.php');
    $res = Utils::getRequest($url);
    
    echo($res);
    return;  
}

//submit tag:
if(isset($_POST['tagSubmit'])){
    session_start();
    $url = 'http://localhost:3000/tags/';
    $postData = array(
        'name' => $_POST['name']
    );
    $requestHeaders = array(
        'Authorization: '.$_SESSION['token']
    );
    require('../classes/utils.php');
    $res = Utils::postRequest($url, $postData, $requestHeaders);
    echo($res);
    return;
}

//save post copy :
if(isset($_POST['savePostCopy'])){
    session_start();
    $post = array(
        'title'=> $_POST['title'],
        'body'=> $_POST['body'],
        'des'=> $_POST['des'],
        'docHistory' => $_POST['docHistory']
    );

    //save post to session:
    $_SESSION['postCopy'] = $post;

    $res = json_encode($post);
    echo $res;
    return;
}

//get add post page data: 
//categories, tags, post copy:
if(isset($_POST['getData'])){
    session_start();
    require('../classes/utils.php');
    //get categories:
    $categories = Utils::getCategories();
    //get tags:
    $tags = Utils::getTags();
    //get post copy:
    $postCopy = getPostCopy();
    //merge all data:
    //we need to convert the json data inside the array to php data because we need to encode the hole array letter 
    $data = array(
        "categories" => json_decode( $categories),
        "tags" => json_decode($tags),
        "postCopy" => json_decode($postCopy)
    );
    //convert data to json
    $res = json_encode($data);

    echo($res);
    return;
}

//get post copy:
function getPostCopy(){
    $copy = false;
    $res;
    if(isset($_SESSION['postCopy'])){
        $copy = true;
        $res = json_encode($_SESSION['postCopy']);
        return $res;
    }
    return '{"false": false}';
}

if(isset($_POST["saveImg"])){
	$data = $_POST["image"];
	$image_array_1 = explode(";", $data);
	$image_array_2 = explode(",", $image_array_1[1]);
	$data = base64_decode($image_array_2[1]);

	$imageName = './postsImages/'. time() . '.png';
	file_put_contents($imageName, $data);
    echo $imageName;
    
    return;
}

session_start();

//check if the user logged in 
if(!isset($_SESSION['token'])){
    header('Location: ../index.php');
}

$title = 'Add Post';
$custom_headers = '
<link href="https://fonts.googleapis.com/css?family=Source+Code+Pro&display=swap" rel="stylesheet"> 
<link rel="stylesheet" href="../assets/css/posts/addPost.css">
<link rel="stylesheet" href="../assets/css/croppie.css" type="text/css">
';

include('../include/v2/head.php');
include('../include/v2/nav.php');
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
<!-- alert dialog -->
<div class="alertModal" id="alertModal" style="display: none">
    <div class="alertModal-content">
        <div class="alertModal-body">
            <div class="closeModalContainer">
                <span class="close" id="alertClose">&times;</span>
            </div>
            <div class="alertModalContent">
                <div class="alertMessage" id="alertMsg">
                    alert message
                </div>
            </div>
            <div class="alertModalFooter">
                <div class="alertOkBtn" id="alertOk">
                    OK
                </div>
            </div>
        </div>
    </div>
</div><!-- alert dialog -->

<!--croppie script -->
<script type="text/javascript" src="../assets/js/croppie.js"></script>
<script src="../assets/js/posts/addPost.js"></script>

<?php 
include('../include/v2/footer.php');
?>