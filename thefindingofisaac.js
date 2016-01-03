// TO DO:
// xxxx1. data merge
// xxxx2. hook up searching
// xxxxfully render results
// xxxxscored sort
// xxxxxhand-tune supplemental data
// xxxxhook up aliases
// xxxxtest in FF and IE
// xxxxadd help text below the search
// xxxxpublish this somewhere
// xxxxsearch with AND
// xxxxmake anchors open in new page
// xxxxfix relative links in description
// - fix broken images
// - fix rune data (scraping broken?)
// - test and tweak results, (i.e. The Mind and other symbols inconsistent)
// - RELEASE BETA
// - add search options options
//     - AND vs. OR
//     - exact match, etc
//     - serialize the settings
// - sub-word matching (i.e. "red" shouldn't match "credit" ?)
// - serialize the last entry
//		- start with something 
// - add description to the sort options
// - test on mobile
//
// ALSO
// - add pills
var g_data = 
{
	items: {},
	aliases: {}
};
var g_classes = "collectible passive trinket card rune pill"
function prepareData(data)
{
	mergeItems(data, 
		[afterbirthTrinkets, afterbirthTrinketsSupplemental, rebirthTrinkets, rebirthTrinketsSupplemental], 
		function(item) {  item.itemClass = "trinket"; });
	mergeItems(data, 
		[afterbirthCollectibles, afterbirthCollectiblesSupplemental, rebirthCollectibles, rebirthCollectiblesSupplemental], 
		function(item) {  item.itemClass = "activated"; });
	mergeItems(data, 
		[afterbirthPassives, afterbirthPassivesSupplemental, rebirthPassives, rebirthPassivesSupplemental], 
		function(item) {  item.itemClass = "passive"; });
	mergeItems(data, 
		[cards, cardsSupplemental, cardsOther, cardsOtherSupplemental, cardsPlaying, cardsPlayingSupplemental, cardsSpecial, cardsSpecialSupplemental], 
		function(item) { item.itemClass = "card"; });
	mergeItems(data, [runes1, runes2, runes1Supplemental, runes2Supplemental], function(item) { item.itemClass = "rune"; })

	fixUpRelativeURLs(data);

	console.log("Item merge steps: " + mergeItems.totalMerged);

	var aliasLookup = createAliasLookup(g_aliases);
	explodeItemAliases(g_data, aliasLookup);
}
mergeItems.totalMerged = 0;
function mergeItems(data, itemTableArray, override)
{
	itemTableArray.forEach(function(itemTable)
	{
		for (var key in itemTable)
		{
			var source = itemTable[key];
			var keyLower = key.toLowerCase().trim();  // some whitespace snuck into names during scraping, thought I trimmed everything
			var merged = data.items[keyLower] || {};

			merged.properName = key;
			merged.wikiPage = merged.wikiPage || source.wikiPage;
			merged.thumbnail = merged.thumbnail || source.thumbnail;
			merged.descriptionHTML = merged.descriptionHTML || source.descriptionHTML;
			merged.itemClass = merged.itemClass || source.itemClass;
			merged.itemType = merged.itemType || source.itemType;
			merged.itemColor = merged.itemColor || source.itemColor;
			merged.itemTags = merged.itemTags || source.itemTags;

			if (override)
			{
				override(merged);
			}
			data.items[keyLower] = merged;

			++mergeItems.totalMerged;
		}
	});
}
function createAliasLookup(aliasList)
{
	var retval = {};

	aliasList.forEach(function(aliasSpec)
	{
		var aliasTerms = aliasSpec.split(/\s+/);
		aliasTerms.forEach(function(alias)
		{
			if (retval[alias])
			{
				console.error("Alias '" + alias + "' used multiple times, ignoring repeats");
			}
			else
			{
				retval[alias] = aliasTerms;
			}
		});
	});
	return retval;
}
Array.prototype.unique = function() {
    var a = [];
    for (var i=0, l=this.length; i<l; i++)
        if (a.indexOf(this[i]) === -1)
            a.push(this[i]);
    return a;
}
function explodeItemAliases(data, aliasLookup)
{
	// search each item for alias matches, and shove the alternate search terms into the item itself
	for (var key in data.items)
	{
		var item = data.items[key];

		item.itemTypeWithAliases = explodeAliases(aliasLookup, item.itemType);
		item.itemTagsWithAliases = explodeAliases(aliasLookup, item.itemTags);
	}	
}
function explodeAliases(aliasLookup, termsString)
{
	var termsArray = termsString.split(/\s+/);
	var newTermsArray = [].concat(termsArray);

	termsArray.forEach(function(term)
	{
		if (aliasLookup[term])
		{
			newTermsArray = newTermsArray.concat(aliasLookup[term]);
		}
	});

	newTermsArray.sort();
	newTermsArray = newTermsArray.unique();
	return newTermsArray.join(' ');
}
function fixUpRelativeURLs(data)
{
	// HACK: fix up the relative links in the description HTML until this hosted on the wiki
	for (var key in data.items)
	{
		var item = data.items[key];
		item.descriptionHTML = item.descriptionHTML.replace(/href="/g, "target=\"_blank\" href=\"http://bindingofisaacrebirth.gamepedia.com");
	}
}
function retrieveHits(data, searchText, searchTermsWithAND)
{
	console.log("-> retrieveHits");

	// split search into multiple terms
	var terms = searchText.toLowerCase().split(' ');  // KAI: should maybe regexp for whitespace instead
	var nTerms = terms.length;

	var hits = [];
	for (var key in data.items)
	{
		var item = data.items[key];
		var score = 0;

		for (var i = 0; i < nTerms; ++i)
		{
			var term = terms[i];
			var termScore = 0;

			// item name match
			if (key.indexOf(term) >= 0)
			{
				termScore += 10;
			}
			// class
			if (item.itemClass.indexOf(term) >= 0)
			{
				termScore += 5;
			}
			// type
			if (item.itemTypeWithAliases.indexOf(term) >= 0)
			{
				termScore += 3;
			}
			// color
			if (item.itemColor.indexOf(term) >= 0)
			{
				termScore += 2;
			}
			// tag hits
			if (item.itemTagsWithAliases.indexOf(term) >= 0)
			{
				termScore += 1;
			}
			// with AND, all terms must generate some kind of score
			if (searchTermsWithAND && !termScore)
			{
				score = 0;
				break;
			}
			score += termScore;
		}
		// full item name match
		if (key.indexOf(searchText) >= 0)
		{
			score += 20;
		}
		if (score)
		{
			hits.push({ item: item, score: score });
		}
	}
	console.log("<- retrieveHits");
	return hits;
}
function renderHits(hits)
{
	console.log("-> renderHits");
	hitsContainer.innerHTML = tableTemplate.textContent;
	hits.forEach(function(hit) {

		var row = document.createElement('tr');

		// name column
		var cell = document.createElement('td');
		var nameParent = cell;
		if (hit.item.wikiPage)
		{
			var anchor = document.createElement('a');
			anchor.href = hit.item.wikiPage;
			anchor.target = "_blank";
			nameParent = anchor;

			cell.appendChild(anchor);
		}
		nameParent.appendChild(document.createTextNode(hit.item.properName));
		row.appendChild(cell);

		// image column
		cell = document.createElement('td');
		cell.className = "itemIconCell";

		var img = document.createElement('img');
		img.src = hit.item.thumbnail;
		img.className = "itemIcon";

		cell.appendChild(img);
		row.appendChild(cell);

		// description
		cell = document.createElement('td');
		cell.innerHTML = hit.item.descriptionHTML;
		row.appendChild(cell);

		// type
		cell = document.createElement('td');
		cell.appendChild(document.createTextNode(hit.item.itemClass));
		cell.className = "itemTypeCell";
		row.appendChild(cell);

		// score
		cell = document.createElement('td');
		cell.appendChild(document.createTextNode(hit.score));
		cell.className = "scoreCell";
		row.appendChild(cell);

		hitsTable.tBodies[0].appendChild(row);
	});
	console.log("<- renderHits");
}
function renderClear()
{
	hitsContainer.innerHTML = "";
}
update.lastTerms = null;
function update(event)
{
	var terms = event.currentTarget.value.trim();
	if (update.lastTerms != terms)
	{
		if (terms.length)
		{
			//KAI: search also for the fully entered text, score it more highly
			var hits = retrieveHits(g_data, terms, true);
			hits.sort(function(hitA, hitB){
				return hitB.score - hitA.score;
			});
			renderHits(hits);
		}
		else
		{
			renderClear();
		}
		update.lastTerms = terms;
	}
}
prepareData(g_data);
loading.style.display = "none";