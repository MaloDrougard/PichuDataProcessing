
// GOAL

/*
    This script allow to transform horc boxes position into png marker or json file.
    This is done to process horc file generate by tesseract. 
*/

// HOW TO USE IT

/*
1) Generate the horc file using tesseract
     $ tesseract --tessdata-dir /usr/share/tessdata DeadTreesSantaJuana_square-2-numbers.png numbers-square -c hocr_char_boxes=2 hocr
2) Insert this script into the horc file or inject this script via the web console
  <script src="file:///home/makem/VirtualBox/shared/Forest/ExtractData/fromHocrToPosition.js" type="text/javascript"></script>
  make sure the script is able to run, change the hocr file to a standard html file by removing the xml tag.  
*/

// inject script from browser console (copy & paste) 
/*
var script = document.createElement('script');
script.src = 'file:///home/makem/VirtualBox/shared/Forest/ExtractData/fromHocrToPosition.js';
script.type = 'text/javascript';
document.getElementsByTagName('head')[0].appendChild(script);
*/


// PROCESS THE DATA CONTAINS IN HORC

let words = Array.from(document.getElementsByClassName('ocrx_word'));
let markers  = []; 


function bboxToPxPosition(bbox) {
    let boxe = bbox.split(/ |;/);
    boxe = boxe.slice(1,5);
    let x = (parseFloat(boxe[0]) + parseFloat(boxe[2]) )/ 2.0;  
    let y = (parseFloat(boxe[1]) + parseFloat(boxe[3]) )/ 2.0;  
    return {x:x, y:y} ; 
}; 

words.forEach(element => {
    let record = {};
    record.id = element.innerHTML;
    record.pxPosition = bboxToPxPosition(element.title);
    markers.push(record);         
});  



// DRAW THE DATA IN A CANVAS 

function drawInCanvas(data){

    let canvas = document.createElement("canvas");
    canvas.width = 2370;
    canvas.height = 2553;
    canvas.style.position = "absolute";
    canvas.style.left = 0;
    canvas.style.top = 0; 
    document.body.appendChild(canvas);
    let ctx = canvas.getContext("2d");
    
    data.forEach(i => {
        ctx.beginPath();
        ctx.rect(i.pxPosition.x - 8 ,i.pxPosition.y - 8,16,16);
        ctx.fillStyle = "red";
        ctx.fill();
    }); 

    // Create a link to download the image 
    var url = canvas.toDataURL();
    var a = document.createElement('a');
    a.download = 'data.png';
    a.href = url;
    a.textContent = 'Download PNG';
    document.body.appendChild(a);
}



// DRAW IN HTML: 

function createDiv(x_pos, y_pos, content) {
    // create a new div element 
  var newDiv = document.createElement("div"); 
  newDiv.style.position = "absolute";
  newDiv.style.left = x_pos+'px';
  newDiv.style.top = y_pos+'px';

  // and give it some content 
  var newContent = document.createTextNode(content); 
  // add the text node to the newly created div
  newDiv.appendChild(newContent);  

  // add the newly created element and its content into the DOM 
  var currentDiv = document.getElementById("div1"); 
  document.body.appendChild(newDiv); 
}

function drawInHTML(data){
    data.forEach(i=>{
        createDiv(i.pxPosition.x, i.pxPosition.y, i.id); 
    })
}


// CREATE A JSON LINK 

function createJSONLink(data) {
    let text = JSON.stringify(data); 
    let a = document.createElement('a');
    let url = 'data:text/plain;charset=utf-8,' + encodeURIComponent(text) ;
    a.href = url;
    a.download = 'data.json';
    a.textContent = 'Download JSON';
    document.body.appendChild(a);
}  


// MAIN
createJSONLink(markers); 
drawInHTML(markers); 
