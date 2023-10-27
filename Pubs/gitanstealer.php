<?php 
  $ref = substr($_SERVER["QUERY_STRING"], strpos($_SERVER["QUERY_STRING"], '=')+1);
  echo file_get_contents('http://refbase.cvc.uab.es/json.php?'.$ref);
?>