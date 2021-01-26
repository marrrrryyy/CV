
var coll = document.getElementsByClassName("collapsible");
var i;

for (i = 0; i < coll.length; i++) {
  coll[i].addEventListener("click", function() {
    this.classList.toggle("active");
    var content = this.nextElementSibling;
    if (content.style.maxHeight){
      content.style.maxHeight = null;
    } else {
      content.style.maxHeight = content.scrollHeight + "px";
    }
  });
}
//parallax items and functions
var itemsHTMLCollection = document.getElementsByClassName("parallax-item");
var itemsArray = Array.from(itemsHTMLCollection);
var html = document.documentElement;


//console.log("itemsArray", itemsArray)

var input = {
  scrollY: {
    start:0,
    end: html.scrollHeight - window.innerHeight,
    current:0,
  },
    mouseX: {
        start: 0,
        end: window.innerWidth,
        current:0,
    },
    mouseY: {
        start: 0,
        end: window.innerHeight,
        current:0,
    }
};

input.scrollY.range = input.scrollY.end - input.scrollY.start;
input.mouseX.range = input.mouseX.end - input.mouseX.start;
input.mouseY.range = input.mouseY.end - input.mouseY.start;


var output = {
    x: {
        start: -1,
        end: 1,
        current:0,
    },
    y: { 
        start: -1000,
        end: 10,
        current:0,
    },
    zIndex: {
        range: 20000,
    },
    scale: {
        start: 1,
        end: -0.2,
    },
    blur: {
        startingDepth: -0.4,
        range: 20,
    }
};

output.scale.range = output.scale.end - output.scale.start;
output.x.range = output.x.end - output.x.start;
output.y.range = output.y.end - output.y.start;

var mouse = {
    x: window.innerWidth * .5,
    y: window.innerHeight * .5,
}

var updateInputs = function() {
    input.mouseX.current = mouse.x;
    input.mouseX.fraction = (input.mouseX.current - input.mouseX.start) / input.mouseX.range;

    input.mouseY.current = mouse.y;
    input.mouseY.fraction = (input.mouseY.current - input.mouseY.start) / input.mouseY.range;

    input.scrollY.current = html.scrollTop;
    input.scrollY.fraction = (input.scrollY.current - input.scrollY.start) / input.scrollY.range;
    // var scrollMax = html.scrollHeight - window.innerHeight;
    // console.log("scrolling!", scrollAmt, "scrollMax", scrollMax)
}

var updateOutputs = function() {
    // output.x.current = output.x.start + (input.mouseX.fraction * output.x.range);
    // output.y.current = output.y.start + (input.mouseY.fraction * output.y.range);
    output.y.current = output.y.end - (input.scrollY.fraction * output.y.range);

}

var updateEachItem = function() {
itemsArray.forEach(function (item, k) {
    var depth = parseFloat(item.dataset.depth, 10);
    var itemOutput = {
        x: output.x.current - (output.x.current * depth),
        y: output.y.current - (output.y.current * depth),
        zIndex: output.zIndex.range - (output.zIndex.range * depth),
        scale: output.scale.start + (output.scale.range * depth),
        blur: (depth - output.blur.startingDepth) * output.blur.range
    };
    //console.log(k, "depth", depth)
    item.style.filter = "blur("+ itemOutput.blur +"px)"
    item.style.zIndex = itemOutput.zIndex;
    item.style.transform = "scale("+itemOutput.scale+") translate("+ itemOutput.x +"px, "+ itemOutput.y +"px)";
});
}

var handleMouseMove = function(event) {
    mouse.x = event.clientX;
    mouse.y = event.clientY;

    updateInputs();
    updateOutputs();
    updateEachItem();
}

var handleScroll = function() {
  updateInputs();
  updateOutputs();
  updateEachItem();
}

var handleResize = function() {
    input.mouseX.end = window.innerWidth;
    input.mouseX.range = input.mouseX.end - input.mouseX.start;

    input.mouseY.end = window.innerHeight;
    input.mouseY.range = input.mouseY.end - input.mouseY.start;

    input.scrollY.end = html.scrollHeight - window.innerHeight;
    input.scrollY.range = input.scrollY.end - input.scrollY.start;

}


//window.addEventListener("mousemove", handleMouseMove);
document.addEventListener("scroll", handleScroll);
window.addEventListener("resize", handleResize);


updateInputs();
updateOutputs();
updateEachItem();