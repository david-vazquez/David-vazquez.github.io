urlPubs = "http://www.cvc.uab.es/~dvazquez/wordpress/Pubs/"
urlReadPubDB = "./gitanstealer.php?reference=";
urlReadExtra = "./supergitanstealer.php?reference=";



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
		      showPublications(data, "mygrid2");
		}
	});
}


function showPublications(data, destination) {
	console.log(data);
	// Process each publication
	$.each(data, function(i, pub){
		addPublication(pub, destination);
	});

	document.getElementById("mygrid2").style.height = "100%";

}



function addPublication(pub, destination) {

	var n = pub.cvcref.indexOf(';');
	var cvcref = pub.cvcref.substring(0, n != -1 ? n : pub.cvcref.length);
	var reference = destination + cvcref;


	// Parse authors
	str = pub.author.replace(/;/g,",");
	if(  str.indexOf( "," ) > 0 && str.indexOf( "," ) != str.lastIndexOf( "," )  ) { // tests for >1 character group in string
	     str = str.slice( 0, str.lastIndexOf( "," ) ) + " and " + str.substring( str.lastIndexOf( "," )+1 );
	}
	strAuthors = str.replace("Antonio Lopez", "Antonio M. Lopez");


	// Parse conference name and type
	strConf = '';
	pubType = 'CONFERENCES';
	pubType2 = 'Conferences';
	label = 'label-success';
	bibtexLine = ''
	selected = false;
	author_bibtex = pub.author.replace(/;/g," and");
	switch (pub.type){
		case "Conference Article":
			pubType = 'CONFERENCES';
			pubType2 = 'Conferences';
			label = 'label-primary';
			strConf = pub.publication + ' (<b>' + pub.conference + '</b>), ' + pub.year;
			bibtexLine = '@INPROCEEDINGS {' + cvcref + ',<br> &nbsp;&nbsp; author &nbsp;&nbsp;&nbsp; = {' + author_bibtex + '}, <br> &nbsp;&nbsp; title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.title + '},<br> &nbsp;&nbsp; booktitle = {' + pub.publication + '}, <br> &nbsp;&nbsp; year &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.year + '}<br>}';
			break;
		case "Abstract":
			pubType = 'DEMONSTRATIONS';
			pubType2 = 'Demonstrations';
			label = 'label-warning';
			strConf = pub.publication + ' (<b>' + pub.conference + '</b>), ' + pub.year;
			bibtexLine = '@INPROCEEDINGS {' + cvcref + ',<br> &nbsp;&nbsp; author &nbsp;&nbsp;&nbsp; = {' + author_bibtex + '}, <br> &nbsp;&nbsp; title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.title + '},<br> &nbsp;&nbsp; booktitle = {' + pub.publication + '}, <br> &nbsp;&nbsp; year &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.year + '}<br>}';
			break;
		case "Report":
			pubType = 'THESES';
			pubType2 = 'Theses';
			label = 'label-default';
			strConf = pub.publication + ' (<b>' + pub.conference + '</b>), ' + pub.year;
			bibtexLine = '@INPROCEEDINGS {' + cvcref + ',<br> &nbsp;&nbsp; author &nbsp;&nbsp;&nbsp; = {' + author_bibtex + '}, <br> &nbsp;&nbsp; title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.title + '},<br> &nbsp;&nbsp; booktitle = {' + pub.publication + '}, <br> &nbsp;&nbsp; year &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.year + '}<br>}';
			break;
		case "Miscellaneous":
			pubType = 'DEMONSTRATIONS';
			pubType2 = 'Demonstrations';
			label = 'label-warning';
			strConf = pub.publication + ' (<b>' + pub.conference + '</b>), ' + pub.year;
			bibtexLine = '@INPROCEEDINGS {' + cvcref + ',<br> &nbsp;&nbsp; author &nbsp;&nbsp;&nbsp; = {' + author_bibtex + '}, <br> &nbsp;&nbsp; title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.title + '},<br> &nbsp;&nbsp; booktitle = {' + pub.publication + '}, <br> &nbsp;&nbsp; year &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.year + '}<br>}';
			break;
		case "Journal Article":
			pubType = 'JOURNAL PAPERS';
			pubType2 = 'Journal papers';
			label = 'label-success';
			selected = true;
			strVol = "";
			if (pub.volume != "")
				strVol += pub.volume;
			if (pub.issue != "")
				strVol += '(' + pub.issue + '), ';
			if (pub.issue == "" && pub.volume != "")
				strVol += ', ';
			if (pub.pages != "")
				strVol += 'pp. ' + pub.pages + ', ';
		  	strConf = pub.publication + ' (<b>' + pub.abbjournal + '</b>), ' + strVol + pub.year;
			bibtexLine = '@ARTICLE {' + cvcref + ',<br> &nbsp;&nbsp; author &nbsp;= {' + author_bibtex + '}, <br> &nbsp;&nbsp; title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.title + '},<br> &nbsp;&nbsp; journal = {' + pub.publication + '}, <br> &nbsp;&nbsp; year &nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.year + '}, <br> &nbsp;&nbsp; volume = {' + pub.volume + '}, <br> &nbsp;&nbsp; issue &nbsp;&nbsp;&nbsp; = {' + pub.issue + '}, <br> &nbsp;&nbsp; pages &nbsp;&nbsp; = {' + pub.pages + '}  <br>}';
			break;
		case "Book Whole":
			pubType = 'BOOK';
			pubType2 = 'Book';
			label = 'label-info';
			strConf = 'Book: ' + pub.publication + ', ' + pub.year;
			bibtexLine = '@BOOK {' + cvcref + ',<br> &nbsp;&nbsp; author &nbsp;&nbsp;&nbsp; = {' + author_bibtex + '}, <br> &nbsp;&nbsp; title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.title + '},<br> &nbsp;&nbsp; booktitle = {' + pub.publication + '}, <br> &nbsp;&nbsp; year &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.year + '}<br>}';
			break;
		case "Book Chapter":
			pubType = 'BOOK CHAPTERS';
			pubType2 = 'Book Chapters';
			label = 'label-danger';
			strConf = 'Book chapter: ' + pub.publication + ', ' + pub.year;
			bibtexLine = '@INBOOK {' + cvcref + ',<br> &nbsp;&nbsp; author &nbsp;&nbsp;&nbsp; = {' + author_bibtex + '}, <br> &nbsp;&nbsp; title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.title + '},<br> &nbsp;&nbsp; booktitle = {' + pub.publication + '}, <br> &nbsp;&nbsp; year &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.year + '}<br>}';
			break;
		default:
			pubType = 'NAN';
			pubType2 = 'Nan';
			strConf = 'NAN';
	}
	strConfUp = strConf.toUpperCase();
	console.log(bibtexLine)

	// Parse mini summary
	max_resum_length = 200;
	if (pub.resum.length > max_resum_length)
		mini_resum = pub.resum.substr(0, Math.min(pub.resum.length, max_resum_length)) + '...';
	else
		mini_resum = pub.resum;


    // Parse paper link
	if (pub.file!="")
      		strLinkFile = 'http://refbase.cvc.uab.es/files/' + pub.file;
	else
	      	strLinkFile = "";


	// Upercase title
	var title = pub.title.toUpperCase();

	// Add an element
	publication = '<div class="publication_item" data-groups="[&quot;all&quot;,&quot;' + pubType + '&quot;]" data-date-publication="'+ pub.year + '-01-01">'
	publication += '<div class="media"> <a href=".publication-detail' + cvcref + '" class="ex-link open_popup" data-effect="mfp-zoom-out"><i class="fa fa-plus-square-o"></i></a>'
	publication += '<div class="date pull-left"> <span class="day" id="mini_image_' + cvcref + '"></span> <span class="year">'+ pub.year + '</span></div>'
	publication += '<div class="media-body"> <h3><a class="ext_link" href="' + strLinkFile + '">' + title + '</a></h3> <h4>' + strConfUp + '</h4> <span class="publication_description">' + mini_resum + '</span> </div>'
	publication += '<hr style="margin:8px auto"> <span class="label ' + label + '">' + pubType2 + '</span><span class="label selected" id="selected_' + cvcref + '"></span> <span class="publication_authors">' + strAuthors + '</span> </div>'
	publication += '<div class="mfp-hide mfp-with-anim publication-detail' + cvcref + ' publication-detail"> <div class="image_work" id="image_work_' + cvcref + '"></div>'
	publication += '<div class="project_content"> <h3 class="publication_title">' + title + '</h3> <span class="publication_authors">'+ strAuthors +'</span> <span class="label ' + label + '">' + pubType2 + '</span> <span class="label selected">Selected</span> <p class="project_desc">' + pub.resum + '</p> </div>'
	publication += '<div class="bibtex"> <span class="bibtitle"> <b>Latex Bibtex Citation:</b></span><br>' + bibtexLine + '</div>';
	publication += '<a class="ext_link" href="' + strLinkFile + '"><i class="fa fa-external-link"></i></a> <div style="clear:both"></div>'
	publication += '</div> </div>'

	//document.getElementById(destination).insertAdjacentHTML('beforeend', publication);
	$("#" + destination).append(publication);

	if (selected)
		document.getElementById("selected_" + cvcref).insertAdjacentHTML('beforeend', 'Selected');

	// Add extra content from the files
	addExtraContent2(reference, cvcref);
}

function addPublication_(pub, destination) {

	var n = pub.cvcref.indexOf(';');
	var cvcref = pub.cvcref.substring(0, n != -1 ? n : pub.cvcref.length);
	var reference = destination + cvcref;


	// Parse authors
	/*
	str = pub.author.replace(/;/g,",");
	if(  str.indexOf( "," ) > 0 && str.indexOf( "," ) != str.lastIndexOf( "," )  ) { // tests for >1 character group in string
	     str = str.slice( 0, str.lastIndexOf( "," ) ) + " and " + str.substring( str.lastIndexOf( "," )+1 );
	}
	strAuthors = str.replace("Antonio Lopez", "Antonio M. Lopez");
	*/

	str = pub.author.replace(/;/g,",");
	var authors_split = str.split(", ");
	//console.log(authors_split)
	var strAuthors = "";

	for (var i=0; i<authors_split.length; i++)
	{
    	//console.log(authors_split[i]);
		author_split = authors_split[i].split(' ');
		//console.log(author_split);

		for (var j=0; j<author_split.length; j++)
		{
			//console.log(author_split[i]);
			if (j==0)
				strAuthors += author_split[j].charAt(0) + '.';
			else
				strAuthors += ' ' + author_split[j];
		}

		if (authors_split.length>1 && i<(authors_split.length-2))
			strAuthors += ', ';

		if (authors_split.length>1 && i==(authors_split.length-2))
			strAuthors +=' and ';
	}
	strAuthors = strAuthors.replace("A. Lopez", "A. M. Lopez");
	//console.log(strAuthors);

	// Parse paper link
	if (pub.file!="")
      		strLinkFile = 'http://refbase.cvc.uab.es/files/' + pub.file;
	else
	      	strLinkFile = "";

	// Parse conference name and type
	strConf = '';
	pubType = 'CONFERENCES';
	pubType2 = 'Conferences';
	label = 'label-success';
	bibtexLine = ''
	cvLine = ''
	selected = false;
	author_bibtex = pub.author.replace(/;/g," and");
	switch (pub.type){
		case "Conference Article":
			pubType = 'CONFERENCES';
			pubType2 = 'Conferences';
			label = 'label-primary';
			strConf = pub.publication + ' (<b>' + pub.conference + '</b>), ' + pub.year;
			bibtexLine = '@INPROCEEDINGS {' + cvcref + ',<br> &nbsp;&nbsp; author &nbsp;&nbsp;&nbsp; = {' + author_bibtex + '}, <br> &nbsp;&nbsp; title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.title + '},<br> &nbsp;&nbsp; booktitle = {' + pub.publication + '}, <br> &nbsp;&nbsp; year &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.year + '}<br>}';
			cvLine = '\\showPub{' + strLinkFile + '}{' + pub.title + '}{Conference}{' + strAuthors + '}{' + pub.publication + '}{' + pub.conference + '}{}{' + pub.year + '}';
			break;
		case "Abstract":
			pubType = 'DEMONSTRATIONS';
			pubType2 = 'Demonstrations';
			label = 'label-warning';
			strConf = pub.publication + ' (<b>' + pub.conference + '</b>), ' + pub.year;
			bibtexLine = '@INPROCEEDINGS {' + cvcref + ',<br> &nbsp;&nbsp; author &nbsp;&nbsp;&nbsp; = {' + author_bibtex + '}, <br> &nbsp;&nbsp; title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.title + '},<br> &nbsp;&nbsp; booktitle = {' + pub.publication + '}, <br> &nbsp;&nbsp; year &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.year + '}<br>}';
			cvLine = '\\showPub{' + strLinkFile + '}{' + pub.title + '}{Demo}{' + strAuthors + '}{' + pub.publication + '}{' + pub.conference + '}{}{' + pub.year + '}';
			break;
		case "Report":
			pubType = 'THESES';
			pubType2 = 'Theses';
			label = 'label-default';
			strConf = pub.publication + ' (<b>' + pub.conference + '</b>), ' + pub.year;
			bibtexLine = '@INPROCEEDINGS {' + cvcref + ',<br> &nbsp;&nbsp; author &nbsp;&nbsp;&nbsp; = {' + author_bibtex + '}, <br> &nbsp;&nbsp; title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.title + '},<br> &nbsp;&nbsp; booktitle = {' + pub.publication + '}, <br> &nbsp;&nbsp; year &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.year + '}<br>}';
			cvLine = '\\showPub{' + strLinkFile + '}{' + pub.title + '}{Thesis}{' + strAuthors + '}{' + pub.publication + '}{' + pub.conference + '}{}{' + pub.year + '}';
			break;
		case "Miscellaneous":
			pubType = 'DEMONSTRATIONS';
			pubType2 = 'Demonstrations';
			label = 'label-warning';
			strConf = pub.publication + ' (<b>' + pub.conference + '</b>), ' + pub.year;
			bibtexLine = '@INPROCEEDINGS {' + cvcref + ',<br> &nbsp;&nbsp; author &nbsp;&nbsp;&nbsp; = {' + author_bibtex + '}, <br> &nbsp;&nbsp; title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.title + '},<br> &nbsp;&nbsp; booktitle = {' + pub.publication + '}, <br> &nbsp;&nbsp; year &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.year + '}<br>}';
			cvLine = '\\showPub{' + strLinkFile + '}{' + pub.title + '}{Demo}{' + strAuthors + '}{' + pub.publication + '}{' + pub.conference + '}{}{' + pub.year + '}';
			break;
		case "Journal Article":
			pubType = 'JOURNAL PAPERS';
			pubType2 = 'Journal papers';
			label = 'label-success';
			selected = true;
			strVol = "";
			if (pub.volume != "")
				strVol += pub.volume;
			if (pub.issue != "")
				strVol += '(' + pub.issue + '), ';
			if (pub.issue == "" && pub.volume != "")
				strVol += ', ';
			if (pub.pages != "")
				strVol += 'pp. ' + pub.pages + ', ';
		  	strConf = pub.publication + ' (<b>' + pub.abbjournal + '</b>), ' + strVol + pub.year;
			bibtexLine = '@ARTICLE {' + cvcref + ',<br> &nbsp;&nbsp; author &nbsp;= {' + author_bibtex + '}, <br> &nbsp;&nbsp; title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.title + '},<br> &nbsp;&nbsp; journal = {' + pub.publication + '}, <br> &nbsp;&nbsp; year &nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.year + '}, <br> &nbsp;&nbsp; volume = {' + pub.volume + '}, <br> &nbsp;&nbsp; issue &nbsp;&nbsp;&nbsp; = {' + pub.issue + '}, <br> &nbsp;&nbsp; pages &nbsp;&nbsp; = {' + pub.pages + '}  <br>}';
			cvLine = '\\showPub{' + strLinkFile + '}{' + pub.title + '}{Journal}{' + strAuthors + '}{' + pub.publication + '}{' + pub.abbjournal + '}{' + strVol + '}{' + pub.year + '}';
			break;
		case "Book Whole":
			pubType = 'BOOK';
			pubType2 = 'Book';
			label = 'label-info';
			strConf = 'Book: ' + pub.publication + ', ' + pub.year;
			bibtexLine = '@BOOK {' + cvcref + ',<br> &nbsp;&nbsp; author &nbsp;&nbsp;&nbsp; = {' + author_bibtex + '}, <br> &nbsp;&nbsp; title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.title + '},<br> &nbsp;&nbsp; booktitle = {' + pub.publication + '}, <br> &nbsp;&nbsp; year &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.year + '}<br>}';
			cvLine = '\\showPub{' + strLinkFile + '}{' + pub.title + '}{Book}{' + strAuthors + '}{' + pub.publication + '}{}{}{' + pub.year + '}';
			break;
		case "Book Chapter":
			pubType = 'BOOK CHAPTERS';
			pubType2 = 'Book Chapters';
			label = 'label-danger';
			strConf = 'Book chapter: ' + pub.publication + ', ' + pub.year;
			bibtexLine = '@INBOOK {' + cvcref + ',<br> &nbsp;&nbsp; author &nbsp;&nbsp;&nbsp; = {' + author_bibtex + '}, <br> &nbsp;&nbsp; title &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.title + '},<br> &nbsp;&nbsp; booktitle = {' + pub.publication + '}, <br> &nbsp;&nbsp; year &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp; = {' + pub.year + '}<br>}';
			cvLine = '\\showPub{' + strLinkFile + '}{' + pub.title + '}{Book chapter}{' + strAuthors + '}{' + pub.publication + '}{}{}{' + pub.year + '}';
			break;
		default:
			pubType = 'NAN';
			pubType2 = 'Nan';
			strConf = 'NAN';
	}
	strConfUp = strConf.toUpperCase();
	//console.log(bibtexLine)
	console.log(cvLine)


	// Parse mini summary
	max_resum_length = 200;
	if (pub.resum.length > max_resum_length)
		mini_resum = pub.resum.substr(0, Math.min(pub.resum.length, max_resum_length)) + '...';
	else
		mini_resum = pub.resum;


	// Upercase title
	var title = pub.title.toUpperCase();

	// Add an element
	publication = '<div class="publication_item" data-groups="[&quot;all&quot;,&quot;' + pubType + '&quot;]" data-date-publication="'+ pub.year + '-01-01">'
	publication += '<div class="media"> <a href=".publication-detail' + cvcref + '" class="ex-link open_popup" data-effect="mfp-zoom-out"><i class="fa fa-plus-square-o"></i></a>'
	publication += '<div class="date pull-left"> <span class="day" id="mini_image_' + cvcref + '"></span> <span class="year">'+ pub.year + '</span></div>'
	publication += '<div class="media-body"> <h3><a class="ext_link" href="' + strLinkFile + '">' + title + '</a></h3> <h4>' + strConfUp + '</h4> <span class="publication_description">' + mini_resum + '</span> </div>'
	publication += '<hr style="margin:8px auto"> <span class="label ' + label + '">' + pubType2 + '</span><span class="label selected" id="selected_' + cvcref + '"></span> <span class="publication_authors">' + strAuthors + '</span> </div>'
	publication += '<div class="mfp-hide mfp-with-anim publication-detail' + cvcref + ' publication-detail"> <div class="image_work" id="image_work_' + cvcref + '"></div>'
	publication += '<div class="project_content"> <h3 class="publication_title">' + title + '</h3> <span class="publication_authors">'+ strAuthors +'</span> <span class="label ' + label + '">' + pubType2 + '</span> <span class="label selected">Selected</span> <p class="project_desc">' + pub.resum + '</p> </div>'
	publication += '<div class="bibtex"> <span class="bibtitle"> <b>Latex Bibtex Citation:</b></span><br>' + bibtexLine + '</div>';
	publication += '<a class="ext_link" href="' + strLinkFile + '"><i class="fa fa-external-link"></i></a> <div style="clear:both"></div>'
	publication += '</div> </div>'

	//document.getElementById(destination).insertAdjacentHTML('beforeend', publication);
	$("#" + destination).append(publication);

	if (selected)
		document.getElementById("selected_" + cvcref).insertAdjacentHTML('beforeend', 'Selected');

	// Add extra content from the files
	addExtraContent2(reference, cvcref);
}


function addExtraContent(reference, cvcref)
{
	var result="";
	$.ajax(
	{
		type:"GET",
		url: urlReadExtra+cvcref,
		dataType: "json",
		async: false,
		success: function(data) {
			result = data;
			//console.log(data);
 		}
	});
   return result;
}


function addExtraContent2(reference, cvcref)
{
	$.ajax(
	{
		type:"GET",
		url: urlReadExtra+cvcref,
		dataType: "json",
		success: function(data) {
			// Add image
			console.log('#image_work_' + cvcref);
			document.getElementById("image_work_" + cvcref).insertAdjacentHTML('beforeend', '<img class="img-responsive" src="' + data.teaser + '" alt="img" height="200" width="480">');
			document.getElementById("mini_image_" + cvcref).insertAdjacentHTML('beforeend', '<img class="img-responsive" src="' + data.teaser + '" alt="img" height="200" width="200">');
			// $('#image_work' + reference).html('<img class="img-responsive" src="' + data.teaser + '" alt="img" height="200" width="480">');
		}
	});
}
