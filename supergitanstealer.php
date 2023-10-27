<?php
$reference = $_GET['reference'];
echo file_get_contents('http://www.cvc.uab.es/people/dvazquez/wordpress/Pubs/foldereader.php?reference='.$reference);
?>
