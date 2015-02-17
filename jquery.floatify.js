//	jQuery.floatify - floating headers from tables or divs, etc..
//	Copyright (c) 2013 jsguy
//	MIT licensed

$.fn.floatify = function (headerSelector) {
	var $that = $(this),
		fHeadStyle = { position: "fixed", _position: "absolute", top:0, _top: "expression(eval(document.body.scrollTop))", visibility: "hidden", zIndex: 1000, opacity: 0.9 },
		fHeadSettleStyle = { position: "static", visibility: "visible", marginTop: 0, opacity: 1, marginTop: 0, marginLeft: 0 },
		updateHeaders = function () {
			$that.each(function () {
				var el = $(this),
					offset = el.offset(),
					scrollTop = $(window).scrollTop(),
					scrollLeft = $(window).scrollLeft(),
					elHeight = el.height(),
					floatingHeader = $(".floatingHeader", this),
					dummyHeader = $(".dummyHeader", this),
					flHeight = floatingHeader.height();

				if ((scrollTop > offset.top) && (scrollTop < offset.top + elHeight)) {

					floatingHeader.removeClass("settleDown");
					floatingHeader.css(fHeadStyle);
					dummyHeader.show();

					if ((scrollTop > offset.top) && (scrollTop < offset.top + elHeight - flHeight)) {
						//  Display at top of viewport
						floatingHeader.css({
							"visibility": "visible",
							"margin-left": -scrollLeft + "px",
							"margin-top": "0px"
						});
					} else {
						//  Smoothly scroll out of viewport
						floatingHeader.css({
							"visibility": "visible",
							"margin-left": -scrollLeft + "px",
							"margin-top": (offset.top + elHeight - flHeight - scrollTop) + "px"
						});
					}

				} else {
					floatingHeader.addClass("settleDown");
					floatingHeader.css(fHeadSettleStyle);
					dummyHeader.hide();
				};
			});
		},
		// debouncing function from John Hann
		// http://unscriptable.com/index.php/2009/03/20/debouncing-javascript-methods/
		debounce = function (func, threshold, execAsap) {
			var timeout;

			return function debounced () {
				var obj = this, args = arguments;
				function delayed () {
					if (!execAsap){
						func.apply(obj, args);
					}
					timeout = null;
				}

				if (timeout)
					clearTimeout(timeout);
				else if (execAsap)
					func.apply(obj, args);

				timeout = setTimeout(delayed, threshold || 100);
			};
		};


	//  Smart scroll - debounced scroll
	$.fn.smartscroll = function(fn){  return fn ? this.on('scroll.smartScroll', debounce(fn, 13)) : this.trigger('smartscroll'); };

	$that.each(function () {
		var $this = $(this),
			$h = $(headerSelector, this),
			isTable = false,
			tHeight = 0;

		//	If it contains a table, set width of each TH, or TR so it
		//  is preserved when scrolling in small windows
		$h.find('th').css("width", function (i, val) {
			var $e = $h.find('th').eq(i);
			isTable = true;
			tHeight = Math.max(tHeight, $e.outerHeight())
			return $e.css("width");
		});
		$h.find('tr').css("width", function (i, val) {
			isTable = true;
			return $h.find('tr').eq(i).css("width");
		});

		tHeight = tHeight || $h.outerHeight();

		//  Add a dummy header
		$h.before("<div class='dummyHeader' style='height: "+$h.outerHeight()+"px; width: "+$h.outerWidth()+"px; display: none'></div>");
		//$h.before("<div class='dummyHeader' style='height: "+tHeight+"px; width: "+$h.outerWidth()+"px; display: none'></div>");

		if (!isTable) {
			$h.wrap("<div class='floatingHeader'></div>").parent().css(fHeadStyle);
		} else {
			//  Note: IE7 needs a full table rendered - seems to work with the thead inserted
			$h.wrap("<div class='floatingHeader'><table cellspacing='0'><thead></thead></table></div>").parent().parent().parent().css(fHeadStyle);
		}

		//  Set width of header, so it is preserved when scrolling in small windows
		if(!$h.css("width")) {
			$h.css("width", $h.outerWidth() + "px");
		}
	});

	$(window)
		.smartscroll(updateHeaders)
		.trigger("scroll");
};

