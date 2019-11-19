<?php
$base = 'http://www.mustafa-dev.website/cms';
$api_base = 'http://ec2-35-158-214-140.eu-central-1.compute.amazonaws.com:3000';

/*
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */

/**
 * Description of Comment
 *
 * @author Mustafa
 */
class Comment {
    public $id;
    public $authorId;
    public $date;
    public $body;
    public $likesCount;
    public $answersCount;
    public $answers;
    public $isFounded;
    
    public static function formServer($id){
        $instance = new self();
        
        $url = $api_base . '/comments/?id='.$id;
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
            $instance->body = $result->body;
            $instance->date = $result->date;
            $instance->answersCount = $result->answersCount;
            $instance->likesCount = $result->likesCount;
            $instance->answers = $result->answers;
            $instance->id = $result->id;
        }
        
        return $instance;
    }
    
    public static function getPostComments($postId){
        $isFounded = true;
        $url = $api_base . '/comments/post?id='.$postId;
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
