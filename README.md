jQuery Chaos Fontsize Selector
==============================

A Fontsize selector to allow more accessible website content. The goal of this plugin as opposed to other solutions is to create a drop in solution for a Text Size selector without having to make CSS changes and adaptations to existing sites designs. Minor sizing changes will always be necessary, like using min-width or min-height instead of width and height in certain designs, but this plugin should handle the most common issues, like absolute font-sizes and line-heights.

Example Usage
-------------

```
<html>
	<head>
		<script src="http://ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
		<script src="jquery.fontsize.js" />
		<script>
			jQuery(document).ready(function($) {
				$('body').fontsizes({ 
					fontSizes: ['100%', '125%', '150%'],
					menuContainer: $('#font-size-menu'),
					includeChildren: ['h1', 'h2', 'h3', 'h4', 'h5']
					});
			});
		</script>
	</head>
	<body>
		<div id="font-size-menu"></div>
		<h1>jQuery Chaos Fontsize Selector Example</h1>
		<h2>Headline</h2>
		<p>Content goes here</p>
	</body>
</html>
```

Features
--------

* Stand alone JS file. No additional CSS file required.
* Handles percentage resizing of font-size.
* Fixes line-height to non-unit values for better CSS compatibility.
* Hyphenates included children that overflow their width.
* Uses "M" height font-size calculation.

Options
-------

* fontSizes
	* Array of percentage fontsizes to allow for selection.
* sampleChar
	* String to use as sample text in the selector.
* menuContainer
	* jQuery object to append selector HTML to.
* menuTitleText
	* String to prepend to selector HTML. 
* includeChildren
	* Child selectors to explictly scale the fontsize on. Useful to override CSS styles.

Default Option Values
---------------------

```
defaults = { fontSizes: ['100%', '125%', '150%'], 
			sampleChar: 'A',
			menuContainer: thisElement, 
			menuTitleText: 'Change Text Size:&nbsp;',
			includeChildren: ['h1', 'h2', 'h3', 'h4', 'h5'] }
```
