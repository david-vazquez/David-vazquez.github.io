urlPubs = "http://www.cvc.uab.es/~dvazquez/wordpress/Pubs/"
urlReadPubDB = "./gitanstealer.php?reference=";
urlReadExtra = "./supergitanstealer.php?reference=";

function mainF(reference, showPlots){
	getPublications(urlReadPubDB+reference, showPlots);
	$('#tabContentAll').slideDown("slow");
	$('#tabAll').css("background-color", "Aqua");
	$('#tab' + "All").click(function(){tabClick("All");});
	$('#tab' + "Journals").click(function(){tabClick("Journals");});
	$('#tab' + "Conferences").click(function(){tabClick("Conferences");});
	$('#tab' + "Books").click(function(){tabClick("Books");});
	$('#tab' + "Chapters").click(function(){tabClick("Chapters");});
	$('#tab' + "Reports").click(function(){tabClick("Reports");});
}

function tabOut(id){
	$('#tab' + id).animate({ background:"white" }, 5, function() { $('#tab' + id).css("background","white");} );
}

function tabOver(id){
	$('#tab' + id).animate({ background:"Aqua" }, 5, function() { $('#tab' + id).css("background","Aqua");} );
}

function tabClick(id){
	$('.tab').animate({ background:"White" }, 5, function() { $('.tab').css("background","White");} );
	$('.tabContent').slideUp("fast");
	$('#tab' + id).animate({ background:"Aqua" }, 5, function() { $('#tab' + id).css("background","Aqua");} );
	$('#tabContent' + id).slideToggle("slow");
}

// Load data from publications
function getPublications(ref, showPlots){
	$.ajax(
	{
		// Get the data from the json of the CVC refbase
		type: "GET",	 
		url: ref,
		dataType: "json",
		success: function(data){
			// Show publications
      showPublications(data, "tabContentAll");
      showPublications2(data, "tabContentJournals", "Journal Article");
      showPublications2(data, "tabContentConferences", "Conference Article");
      showPublications2(data, "tabContentBooks", "Book Whole");
      showPublications2(data, "tabContentChapters", "Book Chapter");
      showPublicationsReport(data, "tabContentReports");
      
      // Draw chart
      if (showPlots) 
      {
      	google.charts.load('current', {'packages':['corechart']});
      	google.charts.setOnLoadCallback(function() {drawChart(data);});
      	google.charts.setOnLoadCallback(function() {drawChart2(data);});
			}
		}
	});
}

 function drawChart(pubData) {
  
  // Collect data
  var nJournals = 0;
  var nBooks = 0;
  var nChapters = 0;
  var nConferences = 0;
  var nReports = 0;
  
  $.each(pubData, function(i, pub){
		switch (pub.type){
			case "Conference Article":
				nConferences++;
				break;
			case "Journal Article":
				nJournals++;
				break;
			case "Book Whole":
				nBooks++;
				break;
			case "Book Chapter":
				nChapters++;
				break;
			case "Abstract":
			case "Report":
			case "Miscellaneous":
				nReports++;
				break;  
		}	
	});
		
  // Create the data table.  
  var data = new google.visualization.DataTable();
  data.addColumn('string', 'Publication');
  data.addColumn('number', 'Number');
  data.addRows([
    ['Journals', nJournals],
    ['Conferences', nConferences],
    ['Books', nBooks],
    ['Book chapters', nChapters],
    ['Technical Reports', nReports]
  ]);

  // Set chart options
  var options = {'title':'Publications distribution', 'width':500, 'height':300};

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.PieChart(document.getElementById('chart_div'));
  chart.draw(data, options);
}

 function drawChart2(pubData) {
  
  // Collect data
  var nYears = 4;
  var currentYear = new Date().getFullYear();
  var years = [];
  var nJournalsYear = [];
  var nBooksYear = [];
  var nChaptersYear = [];
  var nConferencesYear = [];
  var nReportsYear = [];
  for (i=nYears; i>=0; i--)
  {
  	years.push(currentYear-i);
  	nJournalsYear.push(0);
  	nBooksYear.push(0);
  	nChaptersYear.push(0);
  	nConferencesYear.push(0);
  	nReportsYear.push(0);
  }
  
  $.each(pubData, function(i, pub){
  	if (pub.year>=currentYear-nYears)
			switch (pub.type){
				case "Conference Article":
					nConferencesYear[nYears-(currentYear-pub.year)]++;
					break;
				case "Journal Article":
					nJournalsYear[nYears-(currentYear-pub.year)]++;
					break;
				case "Book Whole":
					nBooksYear[nYears-(currentYear-pub.year)]++;
					break;
				case "Book Chapter":				
					nChaptersYear[nYears-(currentYear-pub.year)]++;
					break;
				case "Abstract":
				case "Report":
				case "Miscellaneous":
					nReportsYear[nYears-(currentYear-pub.year)]++;
					break;  
			}	
	});
	  
  // Create the data table.
  var data = google.visualization.arrayToDataTable([
    ['Publications', 'Journals', 'Conferences', 'Books', 'Book Chapters', 'Technical Reports', { role: 'annotation' } ],
    [years[0].toString(), nJournalsYear[0], nConferencesYear[0], nBooksYear[0], nChaptersYear[0], nReportsYear[0], ''],
    [years[1].toString(), nJournalsYear[1], nConferencesYear[1], nBooksYear[1], nChaptersYear[1], nReportsYear[1], ''],
    [years[2].toString(), nJournalsYear[2], nConferencesYear[2], nBooksYear[2], nChaptersYear[2], nReportsYear[2], ''],
    [years[3].toString(), nJournalsYear[3], nConferencesYear[3], nBooksYear[3], nChaptersYear[3], nReportsYear[3], ''],
    [years[4].toString(), nJournalsYear[4], nConferencesYear[4], nBooksYear[4], nChaptersYear[4], nReportsYear[4], '']
  ]);

  // Set chart options
  var options = {'title':'Publications distribution (Last 5 years)', 'width':500, 'height':300, legend: { position: 'top', maxLines: 3 },
        bar: { groupWidth: '75%' },
        isStacked: true,};

  // Instantiate and draw our chart, passing in some options.
  var chart = new google.visualization.ColumnChart(document.getElementById('chart_div2'));
  chart.draw(data, options);
}


function showPublications(data, destination) {
	console.log(data);
	lastYear=0;
	// Process each publication
	$.each(data, function(i, pub){
			lastYear = addYear(pub, lastYear, destination);
			addPublication(pub, destination);
	});
}

function showPublications2(data, destination, type) {
	//console.log(data);
	var lastYear=0;
	// Process each publication
	$.each(data, function(i, pub){
		if (pub.type==type)
		{	
			lastYear = addYear(pub, lastYear, destination);
			addPublication(pub, destination);
		}
	});
}

function showPublicationsReport(data, destination) {
	//console.log(data);
	var lastYear=0;
	// Process each publication
	$.each(data, function(i, pub){
		if (pub.type=="Abstract" || pub.type=="Report" || pub.type=="Miscellaneous")
		{	
			lastYear = addYear(pub, lastYear, destination);
			addPublication(pub, destination);
		}
	});
}
		
function addYear(pub, lastYear, destination){
	// Add a year title if this is the first publication of this year
	if (pub.year != lastYear) 
	{
		if (lastYear==0)
			$("#" + destination).append('<div class="year" id="year' + pub.year + '"> <font size="5"> <b>' + pub.year + '</b> </font> </div>');
		else
			$("#" + destination).append('<div class="year" id="year' + pub.year + '"> <hr> <br> <font size="5"> <b>' + pub.year + '</b> </font> </div>');
	}
	return pub.year;
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
		
	// Add extra content from the files
	addExtraContent(reference, pub.cvcref);
	
	
  // Add the command for expanding the content
	$('#basic' + reference).click(function(){expand(reference);});
	$('#image' + reference).click(function(){expand(reference);});
	$('#element' + reference).hover(function(){elementOver(reference);}, function(){elementOut(reference);}); 
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

function expand(id){
	$('#extra' + id).slideToggle("slow");
}

function elementOut(id){
	$('#element' + id).animate({ background:"white" }, 5, function() { $('#element' + id).css("background","white");} );
}

function elementOver(id, type){
	$('#element' + id).animate({ background:"Aqua" }, 5, function() { $('#element' + id).css("background","Aqua");} );
}