function addDot(x, y, desc, id) {
    $(".compass").append('<div id="dot_'+ id +'" class="dot" alt="'+ desc + '" style="top:'+y+';left:'+x+';"><span class="tooltiptext">'+desc+'</span></div>');
}
function createOptions(id, desc) {
    $(".optionContainer").append('<div id="'+id+'" class="checkbox"><label><input type="checkbox"> '+ desc +'</label></div>');
}
function getActiveDots() {
    var arr = [];
    for (var key in dots) {
        if (dots.hasOwnProperty(key)) {
            if(dots[key].active) {
                arr.push(key);
            }
        }
    }
    return arr;
}
function removeChildrenbyId(id) {
    var ele = document.getElementById(id);
    while (ele.lastChild) {
        ele.removeChild(ele.lastChild);
    }
}
function makeSVG(tag, attrs) {
    var el= document.createElementNS('http://www.w3.org/2000/svg', tag);
    for (var k in attrs)
        el.setAttribute(k, attrs[k]);
    return el;
}
function drawLines(arr) {
    if(arr.length > 0) {
        var pivot = arr.pop();
        var x1 = dots[pivot].x + 4;
        var y1 = dots[pivot].y + 4;
        var x2 = 0;
        var y2 = 0;
        var len = arr.length;
        for(var i = 0; i < len; i++) {
            x2 = dots[arr[i]].x + 4;
            y2 = dots[arr[i]].y + 4 ;

            var svg = makeSVG('line',{'x1':x1,'y1':y1,'x2':x2,'y2':y2, stroke: 'black', 'stroke-width': 2});
            document.getElementById('svg').appendChild(svg);
        }
        drawLines(arr);
    }
}
function drawArc(first, second, third, fourth) {
    var y1 = dots[first].y;
    var x1 = dots[first].x;
    var y2 = dots[second].y;
    var x2 = dots[second].x;
    var y3 = dots[third].y;
    var x3 = dots[third].x;
    var y4 = dots[fourth].y;
    var x4 = dots[fourth].x;

    var x12_distance = x2 - x1;
    var y12_distance = y2 - y1;
    var x23_distance = x3 - x2;
    var y23_distance = y3 - y2;
    var x34_distance = x4 - x3;
    var y34_distance = y4 - y3;
    var x41_distance = x1 - x4;
    var y41_distance = y1 - y4;

    var arc1 = 'M '+ x1+ ','+y1+' a .5,.6 0 0,1 ' + x12_distance + ',' + y12_distance + ' ';
    var arc2 = ' a .5,.6 0 0,1 ' + x23_distance + ',' + y23_distance + ' ';
    var arc3 = ' a .6,.5 0 0,1 ' + x34_distance + ',' + y34_distance + ' ';
    var arc4 = ' a .5,.6 0 0,1 ' + x41_distance + ',' + y41_distance + ' z';


    var svg = makeSVG('path',{'d':arc1+arc2+arc3+arc4, stroke: 'black', 'stroke-width': 2, 'stroke-linejoin': 'round'});

    document.getElementById('svg').appendChild(svg);
}
function findLowest (arr) {
    var oarr = [];
    oarr= arr.slice();
    var pivot = oarr.pop();
    var py = dots[pivot].y;
    var px = dots[pivot].x;
    var largestX = pivot;
    var largestY = pivot;
    for (var key in dots) {
        if (dots.hasOwnProperty(key)) {
            if(dots[key].active) {
                if(py < dots[key].y) {
                    py = dots[key].y
                    largestY = key;
                }
                if(px < dots[key].x) {
                    px = dots[key].x
                    largestX = key;
            }
        }
    }
}
var narr = [];
narr.push(largestX);
narr.push(largestY);
return narr;

}
function findLargest(arr) {
    var oarr = [];
    oarr= arr.slice();
    var pivot = oarr.pop();
    var py = dots[pivot].y;
    var px = dots[pivot].x;
    var largestX = pivot;
    var largestY = pivot;
    for (var key in dots) {
        if (dots.hasOwnProperty(key)) {
            if(dots[key].active) {
                if(py > dots[key].y) {
                    py = dots[key].y
                    largestY = key;
                }
                if(px > dots[key].x) {
                    px = dots[key].x
                    largestX = key;
            }
        }
    }
}
var narr = [];
narr.push(largestX);
narr.push(largestY);
return narr;
}
function findExtremes (arr) {
    var large = findLargest(arr);
    var small = findLowest(arr);
    console.log("Large X,Y: " + large);
    console.log("Small X,Y: " + small);
    var farr = large.concat(small);
    drawArc(large[0], large[1], small[0], small[1]);

    return large.concat(small);
}
function renderBox() {
    for (var key in dots) {
        if (dots.hasOwnProperty(key)) {
            createOptions(key, dots[key].title);
            addDot(dots[key].x, dots[key].y, dots[key].title, key);
        }
    }
    $(".checkbox").on("change", function(e){
        removeChildrenbyId('svg');
        var id = e.currentTarget.id;
        var checked = e.target.checked;
        if(checked) {
            $("#dot_"+id).css('background-color', "green");
            dots[id]['active'] =  true;
        }
        else {
            $("#dot_"+id).css('background-color', "red");
            dots[id]['active']  = false;
        }
        var arr = getActiveDots();
        if(arr.length >= 2) {
            if(arr.length <= 3) {
                drawLines(arr);
            }
            else {
                findExtremes(arr);
            }
        }
        console.log(dots);
    });
}