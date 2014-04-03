/*
 The MIT License (MIT)

 Copyright (c) 2014 Kairat Rakhimov

 Permission is hereby granted, free of charge, to any person obtaining a copy
 of this software and associated documentation files (the "Software"), to deal
 in the Software without restriction, including without limitation the rights
 to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
 copies of the Software, and to permit persons to whom the Software is
 furnished to do so, subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all
 copies or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
 IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
 FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
 LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
 OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
 SOFTWARE.

 This script is customised version of this script: http://www.scriptiny.com/2008/06/javascript-tooltip/
 */

var tooltip=function(){
    var id = 'toolTip';
    var top = 3;
    var left = -60;
    var maxWidth = 300;
    var speed = 10;
    var timer = 20;
    var endAlpha = 95;
    var startAlpha = 0;
    var toolTipDiv, n_height;
    var mustDie = document.all ? true : false;
    return{
        show:function(s_text, n_width, s_typeClass){
            if(toolTipDiv == null){
                toolTipDiv = document.createElement('div');
                toolTipDiv.setAttribute('id',id);
                document.body.appendChild(toolTipDiv);
                toolTipDiv.style.opacity = 0;
                toolTipDiv.style.filter = 'alpha(opacity=0)';
                document.onmousemove = this.position;
            }
            toolTipDiv.className = s_typeClass;
            toolTipDiv.style.display = 'block';
            toolTipDiv.innerHTML = s_text;
            toolTipDiv.style.width = n_width ? n_width + 'px' : 'auto';
            if(!n_width && mustDie){
                toolTipDiv.style.width = toolTipDiv.offsetWidth;
            }
            if(toolTipDiv.offsetWidth > maxWidth){toolTipDiv.style.width = maxWidth + 'px'}
            n_height = parseInt(toolTipDiv.offsetHeight) + top;
            clearInterval(toolTipDiv.timer);
            toolTipDiv.timer = setInterval(function(){tooltip.fade(1)},timer);
        },
        position:function(e){
            var u = mustDie ? event.clientY + document.documentElement.scrollTop : e.pageY;
            var l = mustDie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
            toolTipDiv.style.top = (u - n_height) + 'px';
            toolTipDiv.style.left = (l + left) + 'px';
        },
        fade:function(d) {
            var opacity = startAlpha;
            if ((opacity != endAlpha && d == 1) || (opacity != 0 && d == -1)){
                var i = speed;
                if (endAlpha - opacity < speed && d == 1) i = endAlpha - opacity;
                else if (startAlpha < speed && d == -1) i = opacity;
                startAlpha = opacity + (i * d);
                toolTipDiv.style.opacity = startAlpha * .01;
                toolTipDiv.style.filter = 'alpha(opacity=' + startAlpha + ')';
            }else {
                clearInterval(toolTipDiv.timer);
                if(d == -1) toolTipDiv.style.display = 'none';
            }
        },
        hide:function(){
            if (toolTipDiv != null) {
                clearInterval(toolTipDiv.timer);
                toolTipDiv.timer = setInterval(function(){tooltip.fade(-1)},timer);
            }
        }
    };
}();


// Adds own css dynamically to Head
function TooltipInit () {
    var css = '#toolTip{position:absolute;display:block;background-color:#FFF;padding:7px;border:1px solid}.error{border-color:red!important;color:red!important}.info{border-color:#4169e1!important;color:#4169e1!important}.default{border-color:#000;color:#000}';
    var head = document.head || document.getElementsByTagName('head')[0];
    var style = document.createElement('style');
    style.type = 'text/css';
    if (style.styleSheet) style.styleSheet.cssText = css;
    else style.appendChild(document.createTextNode(css));
    head.appendChild(style);


}

function Tip (s_text) {
    tooltip.show (s_text, null, 'default');
}

function TipInfo (s_text) {
    tooltip.show (s_text, null, 'info');
}

function TipErr (s_text) {
    tooltip.show (s_text, null, 'error');
}

function UnTip () {
    tooltip.hide ();
}

TooltipInit();
