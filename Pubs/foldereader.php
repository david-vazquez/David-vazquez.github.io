<?php 
 
	$dir="http://www.cvc.uab.es/~dvazquez/wordpress/Pubs";
	$reference = $_GET['reference'];
	
	// Teaser image
	$teaserurl = $dir."/".$reference."/teaser.jpg";
	if (!@file_get_contents($teaserurl, 0, NULL, 0, 1))
		$teaserurl = $dir."/pdf.jpg";
	
	// Poster
	$posterurl = $dir."/".$reference."/poster.pdf";
	if (!@file_get_contents($posterurl, 0, NULL, 0, 1))
		$posterurl = "";
		
	// Videos
	$videosurl = $dir."/".$reference."/videos.txt";
	$videos = array();
	if (@file_get_contents($videosurl, 0, NULL, 0, 1))
	{
		$videos = file_get_contents($videosurl);
		$videos = explode(PHP_EOL,$videos);
	}

	// Links
	$linksurl = $dir."/".$reference."/links.txt";
	$links = array();
	if (@file_get_contents($linksurl, 0, NULL, 0, 1))
	{
		$links = file_get_contents($linksurl);
		$links = explode(PHP_EOL,$links);
	}

	// Export data	
	echo json_encode(array("links"=>$links,"poster"=>$posterurl,"teaser"=>$teaserurl,"videos"=>$videos));
?>