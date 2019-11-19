<?php

$base = 'http://www.mustafa-dev.website/cms';
$api_base = 'http://ec2-35-158-214-140.eu-central-1.compute.amazonaws.com:3000';
/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Post
 *
 * @author Mustafa
 */
class Post {
    
    public $id;
    public $authorId;
    public $parentId;
    public $lastUpdate;
    public $title;
    public $des;
    public $body;
    public $likesCount;
    public $commentsCount;
    public $comments;
    public $answers;
    public $imgUrl;
    public $isFounded;
    
    public static function formServer($id){
        $url = $api_base . '/posts/?id='.$id;
        $result = Post::connectToServer($url, 'GET');
        return $result;
        
    }
    
    public static function getCategoryPosts($catId){
        $url = $api_base . '/posts/category?id='.$catId;
        $result = Post::connectToServer($url, 'GET');
        return $result;
    }

    /**
     * getLastPosts
     */
    public static function getLastPosts(){
        $url = $api_base . '/posts/last';
        $result = Post::connectToServer($url, 'GET');
        return $result;
    }

    /**
     * function to connect to the server and return the result.
     * @url : the url to the server.
     * @request: request type GET POST etc. .
     * return array with error field true if there any error false if not 
     * and result array content the returned value from the server.
     */
    public static function  connectToServer($url, $request){
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
    
}
