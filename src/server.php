<?php
sleep(3);

$admin_email = array();
foreach ( $_POST as $key => $value ) {
  $admin_email[$key]=$value;
}

header('Content-type: application/json');
echo json_encode($admin_email);