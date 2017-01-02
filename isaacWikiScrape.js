// Current workflow:
//
// 1) open the isaac wiki page to scrape (i.e. http://bindingofisaacrebirth.gamepedia.com/Trinkets)
// 2) paste this file directly in the dev console
// 3) type copy(scrapeTable(i)) and copy(scrapeTableForTagging(i)) to scrape the ith table, paste the output of 
//    each in separate .json files
// 3.5) there may be more than one table of items to scrape per page, so run for several i's
// 4) wire the files up in index.html and prepareData() to pull them in at page load time
//
// Why two files per scrape:  we want to be able to tag each item with our own descriptive search terms, but we also want
// to be able to re-scrape the items as they get updated, without nuking those tags.

var g_descriptionCol = 2; // changes for cards and runes
function scrapeTable(tableIndex)
{
	return JSON.stringify(extractToJSON(getTable(tableIndex), rowImageAndThumbnailScrape), null, '\t');
}
function scrapeTableForTagging(tableIndex)
{
	return JSON.stringify(extractToJSON(getTable(tableIndex), rowMetadataTemplateScrape), null, '\t');
}
function extractToJSON(table, rowScraper)
{
	var retval = {};

	var nRows = table.rows.length;
	for (var r = 1; r < nRows; ++r)
	{
		var row = table.rows[r];
		var nCols = row.cells.length;

		var name = row.cells[0].textContent.trim();
		retval[name] = rowScraper(row);
	}
	return retval;
}
function rowImageAndThumbnailScrape(row)
{
	var entry = {};

	var anchor = getChildTag(row.cells[0], "a");
	if (anchor)
	{
		entry.wikiPage = anchor.href;
	}

	// var img = getChildTag(row, "img", 1) || getChildTag(row, "img"); // cards/runes have the "DLC" icon before the item icon
	var img = getChildTag(row, "img");
	entry.thumbnail = img.src;

	var description = row.cells[g_descriptionCol];
	entry.descriptionHTML = description.innerHTML.trim();
	return entry;
}
function rowMetadataTemplateScrape(row)
{
	var entry = {};
	entry.itemType = "";
	entry.itemColor = "";
	entry.itemTags = "";
	return entry;
}
function getTable(index)
{
	return document.body.getElementsByTagName("table")[index];
}
function getChildTag(el, tagName, index)
{
	index = index || 0;

	var elements = el.getElementsByTagName(tagName);
	return elements && (elements.length > index) && elements[index];
}