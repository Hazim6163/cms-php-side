<?php

/*********************************** check js requests ************************************/
//get user info:
if(isset($_POST['getUserInfo'])){
    session_start();
    //check if the user logged in . 
    if(!(isset($_SESSION['userInfo']))){
        $res = '{"loggedIn": false}';
        echo $res;
        return ;
    }

    //get user Info:
    $userInfo = $_SESSION['userInfo'];
    $res = json_encode($userInfo);
    echo $res;
    return;
}

//logout request:
if(isset($_POST['logoutRequest'])){
    session_start();
    //remove token:
    unset($_SESSION['token']);
    //remove user info
    unset($_SESSION['userInfo']);
    //send the user to home screen:
    echo '{"result": true}';
    return;
}

//./classes/utils.php 
class Utils{

    public static function  toggleLike($url, $postData, $requestHeaders){
    //init curl:
    $ch = curl_init($url);
    // Configuring curl options
    $options = array(
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_POSTFIELDS => $postData,
        CURLOPT_HTTPHEADER => $requestHeaders
    );
    
    // Setting curl options
    curl_setopt_array( $ch, $options );

    // Getting results
    $result = curl_exec($ch); // Getting jSON result string

    $info = curl_getinfo($ch);
    curl_close($ch);

    $responseCode = $info['http_code'];

    return $result;
    }

    public static function getRequest($url){
        $url = $url;
        $options = array(
            CURLOPT_RETURNTRANSFER=> TRUE,
            CURLOPT_CUSTOMREQUEST => 'GET'
        );
        $ch = curl_init($url);
        curl_setopt_array($ch, $options);

        $result = curl_exec($ch);

        return $result;
    }

    public static function postRequest($url, $postData, $headers){
        //init curl:
        $ch = curl_init($url);
        // Configuring curl options
        $options = array(
            CURLOPT_CUSTOMREQUEST => 'POST',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POSTFIELDS => $postData,
            CURLOPT_HTTPHEADER => $headers
        );
        
        // Setting curl options
        curl_setopt_array( $ch, $options );

        // Getting results
        $result = curl_exec($ch); // Getting jSON result string

        $info = curl_getinfo($ch);
        curl_close($ch);

        $responseCode = $info['http_code'];

        return $result;
    }

    public static function deleteRequest($url, $headers){
        $url = $url;
        $options = array(
            CURLOPT_RETURNTRANSFER=> TRUE,
            CURLOPT_CUSTOMREQUEST => 'DELETE',
            CURLOPT_HTTPHEADER => $headers
        );
        $ch = curl_init($url);
        curl_setopt_array($ch, $options);

        $result = curl_exec($ch);

        return $result;
    }

    // patch request:
    public static function patchRequest($url, $patchData, $headers){
        //init curl:
        $ch = curl_init($url);
        // Configuring curl options
        $options = array(
            CURLOPT_CUSTOMREQUEST => 'PATCH',
            CURLOPT_RETURNTRANSFER => true,
            CURLOPT_POSTFIELDS => $patchData,
            CURLOPT_HTTPHEADER => $headers
        );
        
        // Setting curl options
        curl_setopt_array( $ch, $options );

        // Getting results
        $result = curl_exec($ch); // Getting jSON result string

        $info = curl_getinfo($ch);
        curl_close($ch);

        $responseCode = $info['http_code'];

        return $result;
    }

    //get categories:
    public static function getCategories(){
        $url = 'http://localhost:3000/categories/nested';
        $res = Utils::getRequest($url);
        return $res;
    }

    //get tags:
    public static function getTags(){
        $url = 'http://localhost:3000/tags';
        $res = Utils::getRequest($url);
        return $res;
    }

    //get posts by user id:
    public static function getPostsByUserId($id){
        $url = 'http://localhost:3000/posts/user?id=' . $id . '&catTree=true';
        $res = Utils::getRequest($url);
        return $res;
    }
}

?>
