<?php
    $base = 'http://www.mustafa-dev.website/cms';
    //TODO logged in users navbar
?>

<!--       navbar    -->
<nav class="navbar">
    <div class="brandContainer">
        <span class="brand">
            <a href="">CMS</a>
        </span>
    </div>
    <ul class="menuLinkContainer">
        <li class="menuLink">
            <a href=<?php echo $base . '/index.php' ?>>Home</a>
        </li>
        <li class="menuLink">
            <a href=<?php echo $base . '/categories/categories.php' ?>>Categories</a>
        </li>
        <?php if(isset($_SESSION['token'])){ ?>
        <li class="menuLink">
            <a href="#" id="logout">Logout</a>
        </li>
        <?php }else { ?>
        <li class="menuLink">
            <a href=<?php echo $base . '/login.php' ?>>Login</a>
        </li>
        <?php }?>
    </ul>
    <!--menu links-->
</nav>
<!--nav bar-->

<script>
    $(document).ready(function () {
        $('#logout').click( function(){
            <?php
                //TODO fix auto logout when uncomment this two lines
                //unset($_SESSION['token']);
                //unset($_SESSION['userInfo']);
                //session_write_close();
            ?>
            location.reload();
        });
    });
</script>