<?php 
//./include/home/categories.php
require ('./Classes/Category.php');
/**Classes\Category.php
include\home\categories.php**/

//array we need in home page 
$rootCategories = Category::getRootCategories();
/**categories access: */
if(!$rootCategories['error']){
    $rootCategories = $rootCategories['result'];
}else{
    session_start();
    $_SESSION['errorCode'] = 600;
    header('Location: ./error.php');
}

foreach ($rootCategories as $category) {
    //check if the category has img:
    if(isset($category['imgUrl'])){ ?>
<div class="category">
    <div class="photo">
        <img src="http://localhost:3000/file/uri?uri=<?php echo $category['imgUrl']?>" alt="" class="categoryImg">
    </div>
    <div class="content">
        <div class="title">
            <?php echo $category['title'] ?>
        </div>
        <div class="des">
            <?php echo $category['des'] ?>
        </div>
        <div class="postsCount">
            <?php echo $category['postsCount'] ?> Posts.
        </div>
    </div>
    
</div>

<?php  } //the category with out Img:?>

<div class="category">
    <div class="content">
        <div class="title">
            <?php echo $category['title'] ?>
        </div>
        <div class="des">
            <?php echo $category['des'] ?>
        </div>
        <div class="postsCount">
            <?php echo $category['postsCount'] ?> Posts.
        </div>
    </div>
    
</div>
<?php } ?>