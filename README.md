# The Finding of Isaac

This is a tool to help identify that item that just dropped in your Binding of Isaac run.  Just start typing something descriptive, like *"syringe", "gross blood", or "blue fly"*, etc, to narrow down the item.  Results are linked to the [gamepedia.com wiki](http://bindingofisaacrebirth.gamepedia.com/Binding_of_Isaac:_Rebirth_Wiki).

Currently, the wiki items are scraped in a semi-manual process, see isaacWikiScrape.js for details.

## Implementation Notes

Written in pure javascript and HTML, no frameworks.  All game data lives in the linked JSON files, and was scraped from the wiki (see isaacWikiScrape.js for details).  The code has not been optimized at all, but is very simple and seems to run well enough on Chrome, Firefox, and IE.

See isaacWikiScrape.js for instructions on how to update the data files.

To improve performance and reduce memory and download overhead, the app uses a spritesheet for all the item icons.  ADD DETAILS HERE

### TO DO:
- ~~add new runes and cards, tag for correct dlc~~
- do another tagging pass

- refresh Antibirth and Afterbirth+ items as they get updated in the wiki
- score items better when terms match exactly

- more functionality
	- search by transformation
	- room type, etc

- still slow in FF on the production site?
- return focus to text box after clicking link
- add search options options
    - AND vs. OR
    - exact match, etc
    - serialize the settings
- score sub-word matching differently from whole word (i.e. "red" shouldn't match "credit" ?)
	- or have a check-box
- add description to the sort options

### DONE:
- ~~caching causes display of incorrect score~~
- ~~deal with duplicate item names~~
- ~~move *.json files to a data subdir~~
- ~~dig deep on performance tuning~~
	- ~~diagnose bottleneck~~
	- issue has to do with loading all those images.  Use a sprite sheet instead
		- ~~got TexturePacker working~~
			- ~~need to escape CSS names, use https://github.com/mathiasbynens/CSS.escape~~
				- ~~in css.qs~~
				- escaped names still not working 
		- ~~need to parse filename out of thumbnail~~
		- ~~STOPPING - scaling images is surprisingly messy, and name escaping has broken.  Backing out for now and using a scheme where we URI-encode all the images instead.  This will work across more browsers, and be easier to maintain long-term.  Will make a browser script like isaacWikiScrape.js to generate the base64~~
- ~~Antibirth items~~
	- ~~scrape the wiki~~
	- ~~tag the items~~
	- fix fixUpRelativeUrls to point to the correct wiki
- ~~checkboxes to filter by DLC~~
- ~~Afterbirth+ items~~
- ~~BUG: filters don't work the first time a page is ever opened (i.e. set the options to a new seed)~~
- ~~performance tuning - cache tr's~~
- ~~test and tweak tagging, (i.e. The Mind and other symbols inconsistent, add more descriptors and colors)~~
- ~~test on mobile~~
- ~~type "all" to see the entire item list~~
- ~~serialize the last entry and load it upon page start~~
	- ~~put a default sample search~~
	- ~~highlight the entire text in the input box so it deletes by typing~~
- ~~alias the colors~~
- ~~RELEASE BETA~~
- ~~fix broken images~~
- ~~fix rune data (scraping broken?)~~
- ~~1. data merge~~
- ~~2. hook up searching~~
- ~~fully render results~~
- ~~scored sort~~
- ~~hand-tune Tags data~~
- ~~hook up aliases~~
- ~~test in FF and IE~~
- ~~add help text below the search~~
- ~~publish this somewhere~~
- ~~search with AND~~
- ~~make anchors open in new page~~
- ~~fix relative links in description~~

