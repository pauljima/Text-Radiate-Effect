var radiusX = 100,
	radiusY = 100,
	softSpread = 0.1,
	moveSpace = 20,
	
	textArray = [];

window.addEventListener("load", init, false);

function init() {
	setupTextArray();
	setupAffectedText();
}

function setupAffectedText() {
	var clickables = holder.getElementsByTagName("span");
	for (var i = 0; i < clickables.length; i++) {
		var clickable = clickables[i];

		clickable.addEventListener("mouseenter", rollOn, false);
		clickable.addEventListener("mouseleave", rollOff, false);
	}
}

function setupTextArray() {
	textArray = holder.innerHTML.split(" ");

	var txtHTML = "";
	for (var i = 0; i < textArray.length; i++) {
		var txt = textArray[i];

		txtHTML += "<div class='txt'>" + txt + "</div>";
	}

	holder.innerHTML = txtHTML;
}

function calcDist(a, b) {
	return Math.sqrt(Math.pow(a - b, 2));
}
function getDist(a1, a2, b1, b2) {
	return Math.sqrt(Math.pow(a1 - a2, 2) + Math.pow(b1 - b2, 2));
}



function rollOn(evt) {
	var coreX = evt.target.parentElement.offsetLeft + (evt.target.parentElement.offsetWidth/2),
		coreY = evt.target.parentElement.offsetTop + (evt.target.parentElement.offsetHeight/2);

	for (var i = 0; i < holder.children.length; i++) {
		var word = holder.children[i],
			w = word.offsetWidth,
			h = word.offsetHeight,
			x = word.offsetLeft + (w/2),
			y = word.offsetTop + (h/2),

			newX = 0,
			newY = 0,
			calcX = calcDist(coreX, x),
			calcY = calcDist(coreY, y),
			dist = getDist(coreX, x, coreY, y);

		if (word != evt.target.parentElement) {

			// Only move the X of words in lines within range
			if (coreY > y || coreY < y && calcY < radiusY) { newX = (coreX > x) ? -calcX/radiusX : calcX/radiusX; }

			// Same line
			if (coreY == y) {
				newX = (coreX > x) ? -moveSpace : moveSpace;
				newY = 0;
			}

			// Above
			else if (coreY > y) {
				if (dist <= radiusX && dist <= radiusY) {
					newY = -(radiusY - dist) * softSpread;
				}
			}

			// Below
			else if (coreY < y) {
				if (dist <= radiusX && dist <= radiusY) {
					newY = (radiusY - dist) * softSpread;
				}
			}

			TweenLite.to(word, 0.75, {x:newX, y:newY, ease:Power4.easeOut});
		}
	}
}

function rollOff(evt) {
	for (var i = 0; i < holder.children.length; i++) {
		TweenLite.to(holder.children[i], 0.75, {x:0, y:0, ease:Power4.easeOut});
	}
}
