var tooltip=function(){
	var id = 'toolTip';
	var top = 3;
	var left = -60;
	var maxWidth = 300;
	var speed = 10;
	var timer = 20;
	var endAlpha = 95;
	var startAlpha = 0;
	var toolTip, n_height;
	var mustDie = document.all ? true : false;
	return{
		show:function(s_text, n_width, s_typeClass){
			if(toolTip == null){
				toolTip = document.createElement('div');
				toolTip.setAttribute('id',id);
				document.body.appendChild(toolTip);
				toolTip.style.opacity = 0;
				toolTip.style.filter = 'alpha(opacity=0)';
				document.onmousemove = this.position;
			}
            toolTip.className = s_typeClass;
			toolTip.style.display = 'block';
			toolTip.innerHTML = s_text;
			toolTip.style.width = n_width ? n_width + 'px' : 'auto';
			if(!n_width && mustDie){
				toolTip.style.width = toolTip.offsetWidth;
			}
			if(toolTip.offsetWidth > maxWidth){toolTip.style.width = maxWidth + 'px'}
			n_height = parseInt(toolTip.offsetHeight) + top;
			clearInterval(toolTip.timer);
			toolTip.timer = setInterval(function(){tooltip.fade(1)},timer);
		},
		position:function(e){
			var u = mustDie ? event.clientY + document.documentElement.scrollTop : e.pageY;
			var l = mustDie ? event.clientX + document.documentElement.scrollLeft : e.pageX;
			toolTip.style.top = (u - n_height) + 'px';
			toolTip.style.left = (l + left) + 'px';
		},
		fade:function(d) {
			var opacity = startAlpha;
			if ((opacity != endAlpha && d == 1) || (opacity != 0 && d == -1)){
				var i = speed;
				if (endAlpha - opacity < speed && d == 1) i = endAlpha - opacity;
				else if (startAlpha < speed && d == -1) i = opacity;
				startAlpha = opacity + (i * d);
				toolTip.style.opacity = startAlpha * .01;
				toolTip.style.filter = 'alpha(opacity=' + startAlpha + ')';
			}else {
				clearInterval(toolTip.timer);
				if(d == -1) toolTip.style.display = 'none';
			}
		},
		hide:function(){
			clearInterval(toolTip.timer);
			toolTip.timer = setInterval(function(){tooltip.fade(-1)},timer);
		}
	};
}();

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