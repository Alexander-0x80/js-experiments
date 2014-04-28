
var canvas = document.querySelector("canvas");
var text_input = document.querySelector("input[type='text']");
var sliders = document.querySelectorAll("input[type='range']");
var button = document.querySelector("button");

var ctx = canvas.getContext("2d");
var imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

var buf = new ArrayBuffer(imageData.data.length);
var buf8 = new Uint8ClampedArray(buf);
var data32 = new Uint32Array(buf);

var widthLog = Math.log(canvas.width) / Math.log(2);

/* Keep the right proportions */ 
canvas.style.width = canvas.width + "px";
canvas.style.height = canvas.height + "px";

function getQuadrant(x,y){
    var q=0;
    var mask = 1 << (widthLog-1) ; 
    for (var i=0; i<widthLog; i++) {
        q<<=1;
        q |= ((x & mask ) === mask);
        q<<=1;
        q |= ((y & mask) === mask);
        x<<=1; 
        y<<=1;      
    }

    return q;
}

function quadrantToNum(q){
    var res = 0;
    var bitIndex = 2*widthLog ;
    var mask = 3 << (bitIndex);
    while( mask ) {
        var qi = (q & mask) >> bitIndex ;
        bitIndex -=2 ;
        mask >>= 2;
        res = 10*res + qi ;
    }
    
    return res.toString();
}

function updateCanvas(re){
    for(var i=0; i<data32.length; i++){
        var q = quadrantToNum(getQuadrant(i, Math.floor(i/canvas.width)));
        var res = q.match(re);
        if (res){
            /* Change this shit with sin !!!! */
            data32[i] = ( 255 << 24 |            // Alpha
                (res[0]||"").length*32 << 16 |   // Blue
                (res[1]||"").length*32 << 8  |   // Green
                (res[2]||"").length*32);         // Red
        } else {
            data32[i] = 0xffffffff;     // White
        }
    }

    imageData.data.set(buf8);
    ctx.putImageData(imageData, 0, 0);
}

function onButtonClick(){
    var re = new RegExp(text_input.value, "g");
    updateCanvas(re);
}

button.addEventListener("click", onButtonClick);
onButtonClick();

