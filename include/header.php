<?php
  global $title;
  global $custom_head;
  $base = 'http://www.mustafa-dev.website/cms';
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
    <!-- navbar and footer-->
    <link rel="stylesheet" href=" <?php echo $base ?> /assets/css/navbar.css" type="text/css">
    <link rel="stylesheet" href="<?php echo $base ?>/assets/css/footer.css" type="text/css">
    <?php echo $custom_head ?>
    <title><?php echo $title; ?></title>
</head>

<body>
  