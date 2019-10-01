<?php

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
        $instance = new self();
        
        $url = 'http://localhost:3000/posts/?id='.$id;
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
            $instance->authorId = $result->authorId;
            $instance->title = $result->title;
            $instance->des = $result->des;
            $instance->body = $result->body;
            $instance->lastUpdate = $result->lastUpdate;
            $instance->commentsCount = $result->commentsCount;
            $instance->likesCount = $result->likesCount;
            $instance->comments = $result->comments;
            $instance->answers = $result->answers;
            $instance->imgUrl = $result->imgUrl;
            $instance->id = $result->id;
            $instance->parentId = $result->parentId;
        }
        
        return $instance;
    }
    
    public static function getCategoryPosts($catId){
        $isFounded = true;
        $url = 'http://localhost:3000/posts/category?id='.$catId;
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
            $isFounded = false;
        }
        $resultWithBool = array(
            result => $result,
            isFounded => $isFounded
        );
        
        return $resultWithBool;
    }
    
}
