<?php
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
}

?>
