<?php

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
        $instance = new self();
        
        $url = 'http://localhost:3000/categories/?id='.$id;
        $options = array(
            CURLOPT_RETURNTRANSFER=> TRUE,
            CURLOPT_CUSTOMREQUEST => 'GET'
        );
        $ch = curl_init($url);
        curl_setopt_array($ch, $options);
        
        $result = json_decode(curl_exec($ch));
        $info = curl_getinfo($ch);
        $resCode = $info['http_code'];
        curl_close($ch);
        
        if($resCode != 200){
            $instance->isFounded = false;
        }else{
            $instance->isFounded = true;
            $instance->title = $result->title;
            $instance->des = $result->des;
            $instance->lastUpdate = $result->lastUpdate;
            $instance->nestedCategories = $result->nestedCategories;
            $instance->postsCount = $result->postsCount;
            $instance->imgUrl = $result->imgUrl;
            $instance->id = $result->id;
            $instance->parentId = $result->parentId;
        }
        
        return $instance;
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
        $error = false;
        $url = 'http://localhost:3000/catdegories/';
        $options = array(
            CURLOPT_RETURNTRANSFER=> TRUE,
            CURLOPT_CUSTOMREQUEST => 'GET'
        );
        $ch = curl_init($url);
        curl_setopt_array($ch, $options);
        
        $result = json_decode(curl_exec($ch));
        $info = curl_getinfo($ch);
        $resCode = $info['http_code'];
        curl_close($ch);
        
        if($resCode != 200){
            $error = true;
        }
        $resultWithBol = array(
            'result' => $result,
            'error' => $error
        );
        return $resultWithBol;
    }

    /**
     * to get the children categories 
     */
    public static function getCatByCatId($catId){
        $error = false;
        $url = 'http://localhost:3000/catdegories/category?id='.$catId;
        $options = array(
            CURLOPT_RETURNTRANSFER=> TRUE,
            CURLOPT_CUSTOMREQUEST => 'GET'
        );
        $ch = curl_init($url);
        curl_setopt_array($ch, $options);
        
        $result = json_decode(curl_exec($ch));
        $info = curl_getinfo($ch);
        $resCode = $info['http_code'];
        curl_close($ch);
        
        if($resCode != 200){
            $error = true;
        }
        $resultWithBol = array(
            'result' => $result,
            'error' => $error
        );
        return $resultWithBol;
    }

    /**
     * to get the root categories:
     */
    public static function getRootCategories(){
        $error = false;
        $url = 'http://localhost:3000/catdegories/category/home';
        $options = array(
            CURLOPT_RETURNTRANSFER=> TRUE,
            CURLOPT_CUSTOMREQUEST => 'GET'
        );
        $ch = curl_init($url);
        curl_setopt_array($ch, $options);
        
        $result = json_decode(curl_exec($ch));
        $info = curl_getinfo($ch);
        $resCode = $info['http_code'];
        curl_close($ch);
        
        if($resCode != 200){
            $error = true;
        }
        $resultWithBol = array(
            'result' => $result,
            'error' => $error
        );
        return $resultWithBol;
    }
    
}
