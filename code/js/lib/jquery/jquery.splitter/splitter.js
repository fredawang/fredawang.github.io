/*
 * jQuery.splitter.js - animated splitter plugin
 *
 * version 1.0 (2010/01/02)
 *
 * Dual licensed under the MIT and GPL licenses:
 *   http://www.opensource.org/licenses/mit-license.php
 *   http://www.gnu.org/licenses/gpl.html
 */
/**
 * jQuery.splitter() plugin implements a two-pane resizable animated window, using existing DIV elements for layout.
 * For more details and demo visit: http://krikus.com/js/splitter
 *
 * @example $("#splitterContainer").splitter({splitVertical:true,A:$('#leftPane'),B:$('#rightPane'),closeableto:0});
 * @desc Create a vertical splitter with toggle button
 *
 * @example $("#splitterContainer").splitter({minAsize:100,maxAsize:300,splitVertical:true,A:$('#leftPane'),B:$('#rightPane'),slave:$("#rightSplitterContainer"),closeableto:0});
 * @desc Create a vertical splitter with toggle button, with minimum and maximum width for plane A and bind resize event to the slave element
 *
 * @name splitter
 * @type jQuery
 * @param Object options Options for the splitter ( required)
 * @cat Plugins/Splitter
 * @return jQuery
 * @author Kristaps Kukurs (contact@krikus.com)
 */;
// mod 2012-06-25 jh - add ability to change opts
(function ($) {

    $.fn.splitter = function (args) {
/*		window.onkeydown = function(e) { 
		  return !(e.keyCode == 32);
		};*/
        args = args || {};
        return this.each(function () {
            var _ghost; //splitbar  ghosted element 
            var splitPos; // current splitting position
            var _splitPos; // saved splitting position
            var _initPos; //initial mouse position
            var _ismovingNow = false; // animaton state flag
            // Default opts
            var direction = (args.splitHorizontal ? 'h' : 'v');
            direction = (args.splitVertical2 ? 'v2' : 'v');
            var opts = $.extend({
                removeHeight: 0,
                //minimum height in PX to be removed from the total height.
                minAsize: 0,
                //minimum width/height in PX of the first (A) div.
                maxAsize: 0,
                //maximum width/height  in PX of the first (A) div.
                minBsize: 0,
                //minimum width/height in PX of the second (B) div.
                maxBsize: 0,
                //maximum width/height  in PX of the second (B) div.
                ghostClass: 'working',
                // class name for _ghosted splitter and hovered button
                invertClass: 'invert',
                //class name for invert splitter button
                animSpeed: 0 //animation speed in ms
            }, {
                v: { // Vertical
                    moving: "left",
                    sizing: "width",
                    eventPos: "pageX",
                    splitbarClass: "splitbarV",
                    buttonClass: "splitbuttonV",
                    cursor: "e-resize"
                },
                v2: { // Vertical
                    moving: "left",
                    sizing: "width",
                    eventPos: "pageX",
                    splitbarClass: "splitbarV2",
                    buttonClass: "splitbuttonV2",
                    cursor: "e-resize"
                },
                h: { // Horizontal 
                    moving: "top",
                    sizing: "height",
                    eventPos: "pageY",
                    splitbarClass: "splitbarH",
                    buttonClass: "splitbuttonH",
                    cursor: "n-resize"
                }
            }[direction], args);

            //setup elements
            var splitter = $(this);
            var mychilds = splitter.children(); //$(">*", splitter[0]);
            var A = opts.A; // left/top frame
            var B = opts.B; // right/bottom frame
            var slave = opts.slave; //optional, elemt forced to receive resize event

            //Create splitbar 
            var C = $('<div><span></span></div>');
            A.after(C);
            C.attr({
                "class": opts.splitbarClass,
                unselectable: "on"
            }).css({
                "cursor": opts.cursor,
                "user-select": "none",
                "-webkit-user-select": "none",
                "-khtml-user-select": "none",
                "-moz-user-select": "none"
            }).bind("mousedown", startDrag);
            if (args.splitbarHide) {
              C.css({"display":"none"});
            }

            if (opts.closeableto != undefined) {
                var Bt = $('<div></div>').css("cursor", 'pointer');
                C.append(Bt);
                Bt.attr({
                    "class": opts.buttonClass,
                    unselectable: "on"
                });
                Bt.hover(function () {
                    $(this).addClass(opts.ghostClass);
                }, function () {
                    $(this).removeClass(opts.ghostClass);
                });
                Bt.mousedown(function (e) {
                    if (e.target != this) return;
                    Bt.toggleClass(opts.invertClass).hide();
                    splitTo((splitPos == opts.closeableto) ? _splitPos : opts.closeableto, true);
                    return false;
                });
            }
            //reset size to default.			
            var perc = (((C.position()[opts.moving] - splitter.offset()[opts.moving]) / splitter[opts.sizing]()) * 100).toFixed(1);
            splitTo(perc, false, true);
            
            // resize  event handlers;
            splitter.bind("resize", function (e) {
				this.style.height="100%";
				$(this).height( $(this).height() - opts.removeHeight );
            });
            splitter.bind("resize", function (e, size) {
                if (e.target != this) return;
                splitTo(splitPos, false, true);
            });

	    // mod - allow opts to be updated
	    splitter.bind("changeopts", function (e,newopts) {
		    $.extend(opts,newopts);
	    });
            $(window).bind("resize", function () {
                splitTo(splitPos, false, true);
            });
            splitter.resize();

            //C.onmousedown=startDrag
            function startDrag(e) {
                if (e.target != this) return;
                _ghost = _ghost || C.clone(false).insertAfter(A);
                splitter._initPos = C.position();
                splitter._initPos[opts.moving] -= C[opts.sizing]();
                _ghost.addClass(opts.ghostClass)
					  .css('position', 'absolute')
					  .css('z-index', '250')
					  .css("-webkit-user-select", "none")
					  .width(C.width()).height(C.height()).css(opts.moving, splitter._initPos[opts.moving]);
                mychilds.css("-webkit-user-select", "none"); // Safari selects A/B text on a move
                A._posSplit = e[opts.eventPos];

                $('<div class="splitterMask"></div>').insertAfter($(this));
                $(document).bind("mousemove", performDrag).bind("mouseup", endDrag);
            }
            //document.onmousemove=performDrag
            function performDrag(e) {
                if (!_ghost || !A) return;
                var incr = e[opts.eventPos] - A._posSplit;
                _ghost.css(opts.moving, splitter._initPos[opts.moving] + incr);
            }
            //C.onmouseup=endDrag			
            function endDrag(e) {
                $(".splitterMask").remove();
                var p = _ghost.position();
                _ghost.remove();
                _ghost = null;
                mychilds.css("-webkit-user-select", "text"); // let Safari select text again
                $(document).unbind("mousemove", performDrag).unbind("mouseup", endDrag);
                var perc = (((p[opts.moving] - splitter.offset()[opts.moving]) / splitter[opts.sizing]()) * 100).toFixed(1);
                splitTo(perc, (splitter._initPos[opts.moving] > p[opts.moving]), false);
                splitter._initPos = 0;
            }
            //Perform actual splitting and animate it;					
            function splitTo(perc, reversedorder, fast) {
                if (_ismovingNow || perc == undefined) return; //generally MSIE problem
                _ismovingNow = true;
                if (splitPos && splitPos > 10 && splitPos < 90) //do not save accidental events
                _splitPos = splitPos;
                splitPos = perc;

                var barsize = C[opts.sizing]();// + (2 * parseInt(C.css('border-' + opts.moving + '-width'))); //+ border. cehap&dirty
                var splitsize = splitter[opts.sizing]();
                if (opts.closeableto != perc) {
                    var percpx = Math.max(parseInt((splitsize / 100) * perc), opts.minAsize);
                    if (opts.maxAsize) percpx = Math.min(percpx, opts.maxAsize);
                } else {
                    var percpx = parseInt((splitsize / 100) * perc, 0);
                }
                if (opts.maxBsize) {
                    if ((splitsize - percpx) > opts.maxBsize) percpx = splitsize - opts.maxBsize;
                }
                if (opts.minBsize) {
                    if ((splitsize - percpx) < opts.minBsize) percpx = splitsize - opts.minBsize;
                }

                var neg = 2;
                var sizeA = Math.max(0, (percpx - barsize - neg + (args.splitbarHide ? 10 : 0) ));
                neg = (sizeA === 0) ? 2 : 4;
                var sizeB = Math.max(0, (splitsize - sizeA - barsize - neg));

                if (fast) {
                    A.show().css(opts.sizing, sizeA + 'px');
                    B.show().css(opts.sizing, sizeB + 'px');
                    if (sizeA === 0) { A.hide();}
                    if (sizeB === 0) { B.hide();}
                    Bt.show();
                    if (!$.browser.msie) {
                        mychilds.trigger("resize");
                        if (slave) slave.trigger("resize");
                    }
                    _ismovingNow = false;
                    return true;
                }
                
                //trigger resize evt
                splitter.queue(function () {
                    setTimeout(function () {
                        splitter.dequeue();
                        _ismovingNow = false;
                        mychilds.trigger("resize");
                        if (slave) slave.trigger("resize");
                    }, opts.animSpeed + 5);
                });

            } //end splitTo()




        }); //end each
    }; //end splitter

})(jQuery);
