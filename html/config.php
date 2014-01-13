<?

// база данных

	$DBvars['host'] = 'localhost';
	$DBvars['name'] = 'grabber';
	$DBvars['user'] = 'root';
	$DBvars['pass'] = 'newpass7sh';


$root_path = '/';

$user_identificator = md5($_SERVER['REMOTE_ADDR'].'$'.$_SERVER['HTTP_USER_AGENT'].'$'.$_SERVER['SERVER_NAME'].'$'.gethostbyaddr($_SERVER['REMOTE_ADDR']));

$debug_mode = false;
$track_queries = true;
$show_execution_time = false;

$current['main_templates'] = $_SERVER['DOCUMENT_ROOT'].'/lib/main_templates.php';

set_include_path($_SERVER['DOCUMENT_ROOT'] . PATH_SEPARATOR . $_SERVER['DOCUMENT_ROOT'].'/Zend/');

?>
