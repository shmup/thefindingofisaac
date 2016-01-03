# The Finding of Isaac

This is a tool to help identify that item that just dropped in your Binding of Isaac Rebirth/Afterbirth run.  Just start typing something descriptive, like *"syringe", "gross blood", or "blue fly"*, etc, to narrow down the item.  Results are linked to the [gamepedia.com wiki](http://bindingofisaacrebirth.gamepedia.com/Binding_of_Isaac:_Rebirth_Wiki).

## Implementation Notes

Written in pure javascript and HTML, no frameworks.  All game data lives in the linked JSON files, and was scraped from the wiki (see isaacWikiScrape.js for details).  The code has not been optimized at all, but is very simple and seems to run well enough on Chrome, Firefox, and IE.

### TODO

TO DO:
xxxx1. data merge
xxxx2. hook up searching
xxxxfully render results
xxxxscored sort
xxxxxhand-tune supplemental data
xxxxhook up aliases
xxxxtest in FF and IE
xxxxadd help text below the search
xxxxpublish this somewhere
xxxxsearch with AND
xxxxmake anchors open in new page
xxxxfix relative links in description
- fix broken images
- fix rune data (scraping broken?)
- test and tweak results, (i.e. The Mind and other symbols inconsistent)
- RELEASE BETA
- add search options options
    - AND vs. OR
    - exact match, etc
    - serialize the settings
- sub-word matching (i.e. "red" shouldn't match "credit" ?)
- serialize the last entry
	- put a default sample search
- add description to the sort options
- test on mobile

ALSO
- add pills