urlPubs = "http://www.cvc.uab.es/~dvazquez/wordpress/Pubs/"
urlReadPubDB = "http://www.cvc.uab.es/~dvazquez/wordpress/Pubs/gitanstealer.php?reference=";
urlReadExtra = "http://www.cvc.uab.es/~dvazquez/wordpress/Pubs/supergitanstealer.php?reference=";



function mainF(reference){
	getPublications(urlReadPubDB+reference);
}

// Load data from publications
function getPublications(ref){
	$.ajax(
	{
		// Get the data from the json of the CVC refbase
		type: "GET",	 
		url: ref,
		dataType: "json",
		success: function(data)
		{
		      showPublications(data, "tabContentAll");
		}
	});
}


function showPublications(data, destination) {
	console.log(data);
	// Process each publication
	$.each(data, function(i, pub){
		addPublication(pub, destination);
	});
}

	

function addPublication(pub, destination){
		
	var n = pub.cvcref.indexOf(';');
	var cvcref = pub.cvcref.substring(0, n != -1 ? n : pub.cvcref.length);
	var reference = destination + cvcref;
	
	// Add an element
	publication = '<div class="element" id="element' + reference + '" style="cursor:pointer; border-radius: 25px; padding: 10px; height:100%; width:80%; overflow: hidden;">';

		// Add the teaser image
		publication += '<div class="image" id="image' + reference + '" style="float: left; width:10%;"></div>';
					
		// Add the publication
		publication += '<div class="publication" id="publication' + reference + '" style="float: left; width:85%; padding: 0px 0px 0px 10px">';
					
			// Add the basic div
		  publication += '<div class="basic" id="basic' + reference + '">';
		
			// Add the title
			publication += '<div class="title"><b>' + pub.title + '</b></div>';
						
			// Add the authors
			str = pub.author.replace(/;/g,",");
			if(  str.indexOf( "," ) > 0 && str.indexOf( "," ) != str.lastIndexOf( "," )  ) { // tests for >1 character group in string
	 		     //str = str.slice( 0, str.lastIndexOf( "," ) ); // lops off the last comma
			     str = str.slice( 0, str.lastIndexOf( "," ) ) + " and " + str.substring( str.lastIndexOf( "," )+1 );
			}
			strAuthors = str.replace("Antonio Lopez", "Antonio M. Lopez");
			publication += '<div class="authors">' + strAuthors + '</div>';
				

			strConfHtml = "";
			strConfLatex = "";
			switch (pub.type){
				case "Conference Article":
				case "Abstract":
				case "Report":
				case "Miscellaneous":
					strConfHtml = pub.publication + ' (<b>' + pub.conference + '</b>), ' + pub.year;
					strConfLatex = 'In \\textit{' + pub.publication + '} (\\textbf{' + pub.conference + '})';
					break;
				case "Journal Article":
					strVol = "";
					if (pub.volume != "")
						strVol += pub.volume;
					if (pub.issue != "")
						strVol += '(' + pub.issue + '), ';
					if (pub.issue == "" && pub.volume != "")
						strVol += ', ';
					if (pub.pages != "")
						strVol += 'pp. ' + pub.pages + ', ';
				  strConfHtml = pub.publication + ' (<b>' + pub.abbjournal + '</b>), ' + strVol + pub.year;
				  strConfLatex = 'In \\textit{' + pub.publication + '} (\\textbf{' + pub.abbjournal + '}), ' + strVol;
					break;
				case "Book Whole":
					strConfHtml = 'Book: ' + pub.publication + ', ' + pub.year;
					strConfLatex = 'In \\textit{' + 'Book: ' + pub.publication + '}';
					break;
				case "Book Chapter":
					strConfHtml = 'Book chapter: ' + pub.publication + ', ' + pub.year;
					strConfLatex = 'In \\textit{' + 'Book chapter: ' + pub.publication + '}';
					break;
			}			
			publication += '<div class="conference">' + strConfHtml + '</div>';
		
			// Add the extra content
			publication += '</div><div class="extra" id="extra' + reference + '" style="display:none;" >';
			
			  publication += '<div class="extraTwoCol" style="height:100%; width:100%; overflow: hidden;">';

				  // Add the abstract
				  publication += '<div class="abstract" style="float: left; width:80%; text-align:justify; text-justify:inter-word;"><br><b>Abstract: </b>' + pub.resum + '<br><br></div>';
		
					// Add the links area
		      publication += '<div class="links" id="links' + reference + '" style="padding: 20px 0px 0px 10px; float: left; width:15%;">';
		      	// Add paper link
		      	strLinkFile = "";
		      	if (pub.file!="")
		      		strLinkFile = 'http://refbase.cvc.uab.es/files/' + pub.file;
						  publication +='<a class="links" href="' + strLinkFile + '" target="_blank"><img src="' + urlPubs + 'icon_pdf.png"/> Paper </a><br>';
		      publication += '</div>';
		    publication += '</div>'; // ExtraTwoCol
		
				// Add the bibtex
				publication += '<div class="bibtex"> <span class="bibtitle"> <b>Latex Bibtex Citation:</b></span><br>';
				bibtexLine = ''
				if (pub.type=="Book Whole")
					bibtexLine = '@BOOK {' + cvcref + ',<br> &nbsp;&nbsp; author &nbsp;&nbsp;&nbsp; = {' + pub.author.replace(/;/g," and") + '}, <br> &nbsp;&nbsp; title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.title + '},<br> &nbsp;&nbsp; booktitle = {' + pub.publication + '}, <br> &nbsp;&nbsp; year &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.year + '}<br>}</div>';
				else if (pub.type=="Book Chapter")
					bibtexLine = '@INBOOK {' + cvcref + ',<br> &nbsp;&nbsp; author &nbsp;&nbsp;&nbsp; = {' + pub.author.replace(/;/g," and") + '}, <br> &nbsp;&nbsp; title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.title + '},<br> &nbsp;&nbsp; booktitle = {' + pub.publication + '}, <br> &nbsp;&nbsp; year &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.year + '}<br>}</div>';
			  else if (pub.type=="Journal Article")
			  	bibtexLine = '@ARTICLE {' + cvcref + ',<br> &nbsp;&nbsp; author &nbsp;= {' + pub.author.replace(/;/g," and") + '}, <br> &nbsp;&nbsp; title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.title + '},<br> &nbsp;&nbsp; journal = {' + pub.publication + '}, <br> &nbsp;&nbsp; year &nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.year + '}, <br> &nbsp;&nbsp; volume = {' + pub.volume + '}, <br> &nbsp;&nbsp; issue &nbsp;&nbsp;&nbsp; = {' + pub.issue + '}, <br> &nbsp;&nbsp; pages &nbsp;&nbsp; = {' + pub.pages + '}  <br>}</div>';		
			  else
				  bibtexLine = '@INPROCEEDINGS {' + cvcref + ',<br> &nbsp;&nbsp; author &nbsp;&nbsp;&nbsp; = {' + pub.author.replace(/;/g," and") + '}, <br> &nbsp;&nbsp; title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.title + '},<br> &nbsp;&nbsp; booktitle = {' + pub.publication + '}, <br> &nbsp;&nbsp; year &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.year + '}<br>}</div>';
				publication += bibtexLine
				//if (destination != 'tabContentAll')
				//  document.write(bibtexLine+'<br>')
				// Add latex
  				publication += '<div class="latex"> <span class="textitle"> <b>Latex Reference:</b></span><br>';
					publication += '{\\normalsize \\href{' + strLinkFile + '}{\\textbf{' + pub.title + '}} \\hfill \\textbf{' + pub.year + '}\\\\ \n' + strAuthors + '\\\\ ' + strConfLatex + '\\\\</div>';				
			publication += '</div>'; // Extra
		publication += '</div>'; // Publication
	publication += '</div>'; // Element
	
	$("#" + destination).append(publication);
}



function addExtraContent(reference, cvcref){
	
	$.ajax(
	{
		type:"GET",	 
		url: urlReadExtra+cvcref,
		dataType: "json",
		success: function(data) {
			
			// Add image
			$('#image' + reference).html('<img class="teaser" src="' + data.teaser + '" style="border-radius:8px; height:75px; width:75px;" />');

			// Add links
			$.each(data.links, function(i, link){
				link = link.split(',');
				$('#links' + reference).append('<a class="links" href="' + link[1] + '" target="_blank"><img src="' + urlPubs + 'icon_project.png"/> ' + link[0] + '</a><br>');
			});
			
			// Add video links
			$.each(data.videos, function(i, video){
				$('#links' + reference).append('<a class="videos" href="' + video + '" target="_blank"><img src="' + urlPubs + 'icon_video.png"/> Video ' + i + '</a><br>');
			});
			
			// Add poster link
			if(data.poster != ""){
			$('#links' + reference).append('<a class="poster" href="' + data.poster + '" target="_blank"><img src="' + urlPubs + 'icon_pdf.png"/> Poster </a>');
			}
 		}
	});	     
}
