<!--       navbar    -->
<nav class="navbar">
    <div class="brandContainer">
        <span class="brand">
            <a href="">CMS</a>
        </span>
    </div>
    <ul class="menuLinkContainer">
        <li class="menuLink">
            <a href="#">Home</a>
        </li>
        <li class="menuLink">
            <a href="#">Categories</a>
        </li>
        <?php

if(isset($_SESSION['username'])){
                ?>
        <li class="menuLink">
            <a href="#">Logout</a>
        </li>
        <?php }else { ?>
        <li class="menuLink">
            <a href="#">Login</a>
        </li>
        <?php }?>
    </ul>
    <!--menu links-->
</nav>
<!--nav bar-->
