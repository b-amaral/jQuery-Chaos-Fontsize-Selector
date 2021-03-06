/*
 * jQuery Chaos Fontsize Selector
 * By Matthew Sigley
 * Version 1.1.1
 */

(function ($) {
    var opts;

    $.fn.fontsizes = function (options) {
        //Default options
        var thisElement = $(this),
            defaults = {
                fontSizes: ['100%', '125%', '150%'],
                sampleChar: 'A',
                menuContainer: thisElement,
                menuTitleText: 'Change Text Size:&nbsp;',
                includeChildren: ['h1', 'h2', 'h3', 'h4', 'h5'],
                storageKey: 'fontSize'
            };
        opts = $.extend({}, defaults, options);

        if ($.isEmptyObject(opts.fontSizes) || !opts.menuContainer.length)
            return this;

        var currentFontsize = thisElement.getFontsize();
        thisElement.fixLineHeight();

        var menuHtml = $('<div class="jquery-fontsize-menu"></div>'),
            menuTitle = $('<span class="fontsize-title">' + opts.menuTitleText + '</span>'),
            menuItem = '',
            largestValue = 0;
        $.each(opts.fontSizes, function (key, value) {
            value = value.trim();
            computedValue = value;
            if (value.endsWith('%'))
                computedValue = (parseInt(value, 10)) / 100 * currentFontsize;
            if (largestValue < computedValue)
                largestValue = computedValue;

            menuItem = $('<span class="fontsize-selector" data-fontsize="' + value + '" style="font-size: ' + computedValue + 'px">' + opts.sampleChar + '</span>');
            menuItem.on('click', function (e) {
                var menuItemElement = $(this),
                    fontsize = menuItemElement.data('fontsize');
                menuItemElement.siblings('.fontsize-selector').removeClass('active');
                menuItemElement.addClass('active');
                if (fontsize) {
                    window.localStorage[opts.storageKey] = fontsize;
                    thisElement.changeFontsize({fontSize: fontsize, includeChildren: opts.includeChildren});
                } else {
                    thisElement.changeFontsize({fontSize: '', includeChildren: opts.includeChildren});
                }
            });
            menuHtml.append(menuItem);
        });

        menuTitle.css('font-size', largestValue + 'px');
        menuTitle.prependTo(menuHtml);

        opts.menuContainer.prepend(menuHtml);

        return this;
    };

    $.fn.refreshFontsize = function (options) {
        var fontSize = window.localStorage.getItem(opts.storageKey) || '100%';

        var defaults = {
                fontSize: fontSize,
                includeChildren: opts.includeChildren || []
            },
            options = $.extend({}, defaults, options);

        var thisEl = this;
        setTimeout(function() {
            return thisEl.changeFontsize(options);
        }, 500);
    };

    $.fn.changeFontsize = function (options) {
        //Default options
        var thisElement = $(this),
            defaults = {
                fontSize: '100%',
                includeChildren: []
            },
            options = $.extend({}, defaults, options);

        if ($.isEmptyObject(options.fontSize))
            return this;

        var fontSizeInt = (parseInt(options.fontSize, 10)) / 100;
        $.each(options.includeChildren, function (key, value) {
            var children = thisElement.find(value);
            children.each(function () {
                var thisElement = $(this);
                childFontsize = thisElement.getFontsize(),
                    hyphenated = thisElement.data('hyphenated');
                if (hyphenated) {
                    thisElement.hyphenateWords(false);
                    thisElement.data('hyphenated', false);
                }
                thisElement.fixLineHeight();
                thisElement.css('font-size', (fontSizeInt * childFontsize) + 'px');

                if (thisElement.innerWidth() < thisElement.get(0).scrollWidth) {
                    thisElement.hyphenateWords(true);
                    thisElement.data('hyphenated', true);
                }
            });
        });

        thisElement.css('font-size', options.fontSize);

        return this;
    };

    //Calculate font size based on M height (ems).
    $.fn.getFontsize = function (options) {
        var thisElement = $(this),
            defaults = {useCache: true},
            options = $.extend({}, defaults, options),
            mLine = $('<span style="display: inline-block; padding: 0; line-height: 1; position: absolute; visibility: hidden; font-size: 1em;">M</span>'),
            fontsize = 0,
            cachedFontsize = thisElement.data('fontsize');
        if (options.useCache && notEmpty(cachedFontsize)) {
            fontsize = cachedFontsize;
        } else {
            thisElement.append(mLine);
            fontsize = mLine.height();
            if (fontsize == 0) {
                fontsize = parseInt(mLine.css('font-size'), 10);
            }
            mLine.remove();
            thisElement.data('fontsize', fontsize);
        }
        return fontsize;
    };

    $.fn.fixLineHeight = function () {
        var thisElement = $(this),
            lineheight = thisElement.css('line-height'),
            fixedLineheight = thisElement.data('fixed-line-height');
        if (fixedLineheight) return;
        if (notEmpty(lineheight) && lineheight.endsWith('px')) { //Convert to relative line height if absolute
            var fontSize = thisElement.getFontsize();
            thisElement.css('line-height', ( (parseInt(lineheight, 10)) / fontSize ));
        }
        thisElement.data('fixed-line-height', true);

        return this;
    };

    $.fn.hyphenateWords = function (hyphenate) {
        var thisElement = $(this);
        if (hyphenate) {
            thisElement.css({
                'hyphens': 'auto',
                'word-break': 'break-word'
            });
        } else {
            thisElement.css({
                'hyphens': 'manual',
                'word-break': 'normal'
            });
        }

        return this;
    };

    function notEmpty(value) {
        if (value)
            return true;
        return false;
    }
})(jQuery);

if (!String.prototype.endsWith) {
    String.prototype.endsWith = function (searchString, position) {
        var subjectString = this.toString();
        if (position === undefined || position > subjectString.length) {
            position = subjectString.length;
        }
        position -= searchString.length;
        var lastIndex = subjectString.indexOf(searchString, position);
        return lastIndex !== -1 && lastIndex === position;
    };
}
if (!String.prototype.trim) {
    (function () {
        // Make sure we trim BOM and NBSP
        var rtrim = /^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g;
        String.prototype.trim = function () {
            return this.replace(rtrim, '');
        };
    })();
}

jQuery(document).ready(function ($) {
    if ($.cssHooks) {
        function styleSupport(prop) {
            var vendorProp, supportedProp,
                capProp = prop.charAt(0).toUpperCase() + prop.slice(1),
                prefixes = ["Moz", "Webkit", "O", "ms"],
                div = document.createElement("div");
            if (prop in div.style) {
                supportedProp = prop;
            } else {
                for (var i = 0; i < prefixes.length; i++) {
                    vendorProp = prefixes[i] + capProp;
                    if (vendorProp in div.style) {
                        supportedProp = vendorProp;
                        break;
                    }
                }
            }
            div = null;
            $.support[prop] = supportedProp;
            return supportedProp;
        }

        var wordBreak = styleSupport("wordBreak"),
            hyphens = styleSupport("hyphens");
        $.cssHooks.wordBreak = {
            get: function (elem, computed, extra) {
                return $.css(elem, wordBreak);
            },
            set: function (elem, value) {
                elem.style[wordBreak] = value;
            }
        };
        $.cssHooks.hyphens = {
            get: function (elem, computed, extra) {
                return $.css(elem, hyphens);
            },
            set: function (elem, value) {
                elem.style[hyphens] = value;
            }
        };
    }
});