<?php
$base = 'http://www.mustafa-dev.website/cms';
$api_base = 'http://ec2-35-158-214-140.eu-central-1.compute.amazonaws.com:3000';

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Category
 * 
 * @author Mustafa
 */
class Category {
    public $id;
    public $parentId;
    public $title;
    public $des;
    public $nestedCategories;
    public $postsCount;
    public $imgUrl;
    public $lastUpdate;
    public $isFounded;
    
    public function __construct() {
        
    }
    
    /**
     * to get single category details
     */
    public static function fromServer($id) {
        $url = $api_base . '/categories/?id='.$id;
        $result = Category::connectToServer($url, 'GET');
        return $result;
    }
    
    public static function withDet($id, $parentId, $title, $des,
            $nestedCategories, $postsCount, $imgUrl,
            $lastUpdate){
        
        $instance = new self();
        
        $instance->isFounded = true;
        $instance->title = $title;
        $instance->des = $des;
        $instance->lastUpdate = $lastUpdate;
        $instance->nestedCategories = $nestedCategories;
        $instance->postsCount = $postsCount;
        $instance->imgUrl = $imgUrl;
        $instance->id = $id;
        $instance->parentId = $result->parentId;
        
        return $instance;
    }
    
    /*
     * to get all categories from the server
     **/
    public static function getCategories(){
        $url = $api_base . '/categories/';
        $result = Category::connectToServer($url, 'GET');
        return $result;
    }

    /**
     * to get the children categories 
     */
    public static function getCatByCatId($catId){
        $url = $api_base . '/categories/category?id='.$catId;
        $result = Category::connectToServer($url, 'GET');
        return $result;
    }

    /**
     * to get the root categories:
     */
    public static function getRootCategories(){
        $url = $api_base . '/categories/home';
        $result = Category::connectToServer($url, 'GET');
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
