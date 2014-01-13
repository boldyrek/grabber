<?php

session_start();
require_once($_SERVER['DOCUMENT_ROOT'].'/account_id.php');
require_once($_SERVER['DOCUMENT_ROOT'].'/lib/class.MdpmBase.php');

if (isset($_GET['mod']) and $_GET['mod'] != '')
{
   $file = $_SERVER['DOCUMENT_ROOT'].'/grabber/lib/class.Mdpm'.$_GET['mod'].'.php';
   if (file_exists($file))
      require_once($file);
   else
      Proto::redirect('/grabber');
}
else
{
   if (isset($_SESSION['authorised']) && $_SESSION['authorised'] == 1) {
	   $default = $_SERVER['DOCUMENT_ROOT'].'/grabber/mod/grabber/index.php';
	   require_once($default);  
   } else {
       header('Location: /');
   }
}

?>