<?php
sleep(3);

$opt_array = array();
foreach ( $_POST as $key => $value ) {
  $opt_array[$key]=$value;
}

header('Content-type: application/json');
echo json_encode($opt_array);