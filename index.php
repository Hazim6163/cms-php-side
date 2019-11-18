<?php
$base = 'http://www.mustafa-dev.website/cms';

//get categories:
if(isset($_POST['getCategories'])){
    require('./classes/utils.php');
    $categories = Utils::getCategories();
    echo($categories);
    return;
}

//save new category:
if(isset($_POST['saveCat'])){
    session_start();

    $url = 'http://localhost:3000/categories/add';
    
    $headers = array(
        'Authorization: '.$_SESSION['token']
    );

    $postData = array(
        'title' => $_POST['title'],
        'des' => $_POST['des']
    );

    //check if the category has img:
    if(isset($_FILES['img'])){//max size 4M
        $path = uploadFile('img', null, '/temp/', 4*1000000);
        $file = curl_file_create(realpath('.' . $path));
        $postData['img'] = $file;
    }

    //check if the category has parent:
    if(isset($_POST['pCat'])){
        $postData['parentId'] = $_POST['pCat'];
    }

    require('./classes/utils.php');
    $res = Utils::postRequest($url, $postData, $headers);

    echo($res);
    //delete the img from php after send it
    unlink('.' . $path);
    
    return;
}

//function to upload files to server:
/// inputName: input name in the form
/// allowedExt: allowed extensions as array
/// dir folder to upload file to should be already created look ex:
// ex: /uploads/ -> upload folder in the root dir
// will rename the file to the time in mill sec and the extension.
// max size in Byte
function uploadFile($inputName, $allowedExt, $dir, $maxSize){
    $currentDir = getcwd();
    //dir should be already created
    $uploadDirectory = $dir;

    $errors = []; // Store all errors here

    $fileName = $_FILES[$inputName]['name'];
    $fileSize = $_FILES[$inputName]['size'];
    $fileTmpName  = $_FILES[$inputName]['tmp_name'];
    $fileType = $_FILES[$inputName]['type'];
    $fileExtension = strtolower(end(explode('.',$fileName)));

    $newFileName = time() . '.' .$fileExtension ;

    $uploadPath = $currentDir . $uploadDirectory . basename($newFileName); 

    //check if there extension validate:
    if($allowedExt != null){
        if (! in_array($fileExtension, $allowedExt)) {
            $errors[] = "This file extension is not allowed. Please upload a JPEG or PNG file";
        }
    }
    

    if ($fileSize > $maxSize) {
        $errors[] = "This file is more than ". $maxSize/1000000 ." MB. Sorry, it has to be less than or equal to ". $maxSize/1000000 ." MB";
    }

    if (empty($errors)) {
        $didUpload = move_uploaded_file($fileTmpName, $uploadPath);

        if ($didUpload) {
            return $uploadDirectory . basename($newFileName);
        } else {
            echo "An error occurred somewhere. Try again or contact the admin";
        }
    } else {
        foreach ($errors as $error) {
            echo $error . " These are the errors" . "\n";
        }
    }
}

$title = 'Home';
$custom_head = '
<link rel="stylesheet" href="'. $base .'/assets/css/index.css">

<script src="https://kit.fontawesome.com/9b9c3e7d62.js" crossorigin="anonymous"></script>
';

session_start();
$loggedIn = false;
//check if the user logged in : 
if(isset($_SESSION['token'])){
    $loggedIn = true;
}

echo '<div class="pageWrapper" id="pageWrapper">';
include('./include/header.php');
include('./include/navbar.php');
?>

<!-- main container-->
<div class="container">
    <div class="searchBar">
        <?php include('./include/home/search.php') ?>
    </div>
    <div class="categories">
        <?php include('./include/home/categories.php'); ?>
    </div>
    <div class="lastPosts">
        <div class="lastPostsTitle">
            Last Posts:
        </div>
        <?php include('./include/home/posts.php'); ?>
    </div>
    <?php if($loggedIn){?>
    <div class="addSection">
        <div class="addMenu" id="addMenu">
            <div class="addPost" id="addPost">add post</div>
            <div class="addCategory" id="addCat">add category</div>
        </div>
        <div class="addBtn" id="addBtn"><i class="fas fa-plus"></i></div>
    </div>
    <?php } ?>
</div>
<!--container-->
</div>
<!--page wrapper-->
<script src="./assets/js/home.js"></script>
<?php 
include('./include/footer.php');
?>
