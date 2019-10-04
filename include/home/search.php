<?php
/** style variable */ 
    #search wrapper width
    $sww = '270px';
    #search box container width
    $sbcw = '250px';
    #search box container height
    $sbch = '45px';
/** api  */
    // handle the ajax request:
    if(isset($_POST['content'])){
        $result = getResult($_POST['content']);
        $json = json_encode($result);
        echo $json;
        return;
    }
    function getResult($str){
        $url = 'http://localhost:3000/search?content='.$str;
        $result = connectToServer($url, 'GET');
        return $result;
    }
    function  connectToServer($url, $request){
        $error = false;
        $url = $url;
        $options = array(
            CURLOPT_RETURNTRANSFER=> TRUE,
            CURLOPT_CUSTOMREQUEST => $request
        );
        $ch = curl_init($url);
        curl_setopt_array($ch, $options);

        $result = json_decode(curl_exec($ch), true);
        $info = curl_getinfo($ch);
        $resCode = $info['http_code'];
        curl_close($ch);

        if($resCode != 200){
            $error = true;
        }
        $resultWithBool = array(
            'result' => $result,
            'error' => $error
        );

        return $resultWithBool;
    }

?>
<!--search style-->
<style>
    .searchWrapper {
        width:<?php echo $sww?>;
        display: flex;
        flex-direction: column;
        align-items: center;
        justify-content: center;
        position: relative;
    }
    .searchBoxContainer {
        box-sizing: border-box;
        margin: 0;
        width: <?php echo $sbcw?>;
        height: <?php echo $sbch?>;
        display: flex;
        background-color: white;
        border: 1px solid #6e6e6e;
        border-radius: 12px 12px 12px 12px;
        -moz-border-radius: 12px 12px 12px 12px;
        -webkit-border-radius: 12px 12px 12px 12px;
        padding: 8px;
    }
    .searchBoxContainer input {
        padding-left: 8px;
        width: 200px;
        background-color: inherit;
        border: 0px;
        font-size: 1rem;
    }
    .searchBoxContainer i {
        color: #693d3d;
    }
    .liveSearchResult {
        visibility: hidden;
        width: 249px;
        height: 300px;
        background-color: #f6f6f6;
        box-sizing: border-box;
        overflow-y: auto;
        position: absolute;
        top:45px;
        z-index: -1;

    }
    .searchWrapper h3{
        text-align:center;
        margin: 0px;
        margin-top: 8px;
        font-size: 1.5rem;
    }

    .searchItem{
        cursor: pointer;
        padding: 8px;
        box-sizing: border-box;
        width: 230px;
        min-height: 90px;
        background-color: #f6f6f6;
    }
    .searchItem:hover{
        background-color: rgb(200, 200, 200, .2);
    }
    .searchItem h4{
        margin: 0px;
        font-size:1.2rem;
    }
    .searchItem p{
        margin: 0px;
    }
    .lineBreak{
        width: 200px;
        height: 1px;
        background-color: rgb(0, 0, 0, .2);
        margin: 8px 0px;
        margin-left: auto;
        margin-right: auto;
    }
</style>
<!--search-->
<div class="searchWrapper">

    <div class="searchBoxContainer" id="searchBoxContainer">
        <i class="material-icons">search</i>
        <input class="searchInput" id="searchBox" type="text" placeholder="Search">
    </div>

    <div class="liveSearchResult" id="liveSearchResult">
        <div class="postsResult" id="postsContainer">
            
        </div>
        <div class="tagsResult" id="tagsContainer">
            
        </div>
        <div class="categoriesResult" id="categoriesContainer">
            
        </div>
    </div>

</div>
<!--search script-->
<script>
    $(document).ready(function () {
        $("#searchBox").keyup(function () {
            let char = $("#searchBox").val().length;
            if (char <= 1) {
                $("#liveSearchResult").css("visibility", "hidden");
                $("#searchBoxContainer").css("border-radius", "12px 12px 12px 12px");
                $("#searchBoxContainer").css("-moz-border-radius", "12px 12px 12px 12px");
                $("#searchBoxContainer").css("-webkit-border-radius", "12px 12px 12px 12px");
            }else{
                $("#liveSearchResult").css("visibility", "visible");
                $("#searchBoxContainer").css("border-radius", "12px 12px 0px 0px");
                $("#searchBoxContainer").css("-moz-border-radius", "12px 12px 0px 0px");
                $("#searchBoxContainer").css("-webkit-border-radius", "12px 12px 0px 0px");
                //connect to the api ...
                var data = {
                    content: $("#searchBox").val()
                };
                $.post('./include/home/search.php', data, function (res) {
                    var res = JSON.parse(res);
                    if(!res.error){
                        //extract the array:
                        var posts = res.result['posts'];
                        var tags = res.result['tags'];
                        var categories = res.result['categories'];
                        //get the liveSearch, posts, tags, categories div
                        var postsContainer = $('#postsContainer');
                        var tagsContainer = $('#tagsContainer');
                        var categoriesContainer = $('#categoriesContainer');
                        var liveSearchResult = $('#liveSearchResult');
                        //init the containers posts categories and tags:
                        postsContainer.html('');
                        tagsContainer.html('');
                        categoriesContainer.html('');
                        if(posts.length == 0 && tags.length == 0 && categories.length == 0){
                            postsContainer.html('<p>No Result Founded!<p>');
                        }if(posts.length != 0){
                            postsContainer.html('<h3>Posts:<h3>');
                        }if(tags.length != 0){
                            tagsContainer.html('<h3>Tags:<h3>');
                        }if(categories.length != 0){
                            categoriesContainer.html('<h3>Categories:<h3>');
                        }
                        //create posts search items:
                        posts.forEach(post => {
                            postsContainer.append(
                                '<div class="searchItem" id="'+post._id+'"><h4>'+post.title+'</h4><p>'+post.des+'</p><div class="lineBreak"></div></div>'
                            );
                            $('#'+post._id).click(function (){
                                //TODO create post page 
                                window.location.href = 'error.php?id='+post._id;
                            });
                        });
                        //create tags search items:
                        tags.forEach(tag => {
                            tagsContainer.append(
                                '<div class="searchItem" id="'+tag._id+'"><div class="lineBreak"></div><h4>'+tag.name+'</h4><p>'+tag.postsCount+' posts</p><div class="lineBreak"></div></div>'
                            );
                            $('#'+tag._id).click(function (){
                                //TODO create tag page 
                                window.location.href = 'error.php?id='+tag._id;
                            });
                        });
                        //create categories search items:
                        categories.forEach(category => {
                            categoriesContainer.append(
                                '<div class="searchItem" id="'+category._id+'"><div class="lineBreak"></div><h4>'+category.title+'</h4><p>'+category.des+'</p><div class="lineBreak"></div></div>'
                            );
                            $('#'+category._id).click(function (){
                                //TODO create category page 
                                window.location.href = 'error.php?id='+category._id;
                            });
                        });
                        
                        console.log(res.result['posts']);
                    }else{
                        console.log('there is no results');
                    }
                    
                });
            }
        });
    });
</script>