<?
mb_internal_encoding("UTF-8");
header("Expires: Tue, 1 Jul 2003 05:00:00 GMT");
header("Cache-Control: no-store, no-cache, must-revalidate");
header("Pragma: no-cache");
header("Content-type: text/html; charset=utf-8");
session_start();

// Registering Zend_Registry
require_once($_SERVER['DOCUMENT_ROOT'].'/Zend/Registry.php');

if(isset($_GET['mod'])) $mod = $_GET['mod'];
else $mod = '';
require_once($_SERVER['DOCUMENT_ROOT'].'/account_id.php');

if(!isset($_GET['exit']) && isset($_SESSION['user_type']) && $_SESSION['user_type']=='14') {
	header('Location: /grabber');
	exit;
}

require_once($_SERVER['DOCUMENT_ROOT'].'/lib/class.MdpmBase.php');

require_once($_SERVER['DOCUMENT_ROOT'].'/lib/class.starter.php');
$authoriser = new starter();
$authoriser->drawContent();

?>