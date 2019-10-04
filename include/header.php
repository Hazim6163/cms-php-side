<?php
  global $title;
  global $costume_head;
?>

<!DOCTYPE html>
<html lang="en" dir="ltr">

<head>
    <meta charset="utf-8">
    <!-- material icon -->
    <link href="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.css" rel="stylesheet">
    <script src="https://unpkg.com/material-components-web@latest/dist/material-components-web.min.js"></script>
    <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons">
    <!-- jquery  -->
    <script src="https://ajax.googleapis.com/ajax/libs/jquery/3.4.1/jquery.min.js"></script>
    <!--google fonts-->
    <link href="https://fonts.googleapis.com/css?family=Germania+One|Roboto+Condensed&display=swap" rel="stylesheet"> 

    <link rel="stylesheet" href="http://localhost/html/cms/assets/css/main.css" type="text/css">
    <?php echo $costume_head ?>
    <title><?php echo $title; ?></title>
</head>

<body>
  