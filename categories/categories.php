<?php
require('../classes/utils.php');

/*****  js requests:    ***/
//get data:
if(isset($_POST['getData'])){
    //check if single category request:
    $isSingleCat = isSingle();
    //set json data to send:
    if(!$isSingleCat){
        //if not single category get all root categories array:
        $rootCats = getRootCats();
        //data array
        $data = array(
            'isSingleCat' => $isSingleCat,
            'rootCats' => $rootCats
        );
        $data = json_encode($data);
        echo($data);
        return;
    }else{
        //if single category get category and posts arrays:
        $cat = getCat();
        $catPosts = getCatPosts();
        //data array
        $data = array(
            'isSingleCat' => $isSingleCat,
            'cat' => $cat->category,
        );
        if(isset($cat->nestedCats)){
            $data['nested'] = $cat->nestedCats;
        }
        if(isset($cat->parents)){
            $data['parents'] = $cat->parents;
        }
        $data = json_encode($data);
        echo($data);
        return;
    }
}

//check if the single category request:
function isSingle(){
    if($_POST['id']){
        return true;
    }
    return false;
}

//get root categories:
function getRootCats(){
    $url = 'http://localhost:3000/categories/home';
    $res = json_decode(Utils::getRequest($url));
    return $res;
}

//get category:
function getCat(){
    $id = $_POST['id'];
    $url = 'http://localhost:3000/categories/category?id=' . $id;
    $res = json_decode(Utils::getRequest($url));
    return $res;
}

//get category posts:
function getCatPosts(){
    $id = $_POST['id'];
    $url = 'http://localhost:3000/posts/category?id=' . $id ;
    $res = json_decode(Utils::getRequest($url));
    return $res;
}


$title = 'Categories';
$custom_headers = '
<link rel="stylesheet" href="../assets/css/categories/index.css">
';


include('../include/v2/head.php');
include('../include/v2/nav.php');
?>

<div class="pageWrapper" id="pageWrapper">
    <div class="sideNavigate" id="sideNavigate"></div>
    <div class="pageContainer" id="pageContainer"></div>
</div>

<script src="../assets/js/categories/index.js"></script>
<?php include('../include/v2/footer.php'); ?>
