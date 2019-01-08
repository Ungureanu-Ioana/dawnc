var id = 1;
var pieces = [];
var sx = 0, sy = 0;

function drawImage(category) {
    
    if (document.getElementById("pick") != null) {
        document.getElementById("pick").remove();
    }

    if (category == 1) {
        numOfPieces = 3;
    } else if (category == 2) {
        numOfPieces = 4;
    } else {
        numOfPieces = 5;
    }

    for (var i = 1; i <= numOfPieces * numOfPieces; i++) {
        let promise = loadImage(sessionStorage.getItem("imgPath"));

        promise.then(
            image => draw(sessionStorage.getItem("imgPath"), numOfPieces),
            error => alert(`Error: ${error.message}`)
        );
    }
    
}


function loadImage(src) {
    return new Promise(function(resolve, reject) {
        var image = new Image();
        image.src = src;

        image.onload = () => resolve(src);
        image.onerror = () => reject(new Error("Image load error: " + src));
    });
}

function draw(img, numOfPieces) {
    var canvas = document.createElement("canvas");
    var context = canvas.getContext("2d");
    var image = new Image();
    
    image.src = img;
    let w = image.width/numOfPieces, h = image.height/numOfPieces;

    let x = w/4, y = h/4;
    let top = [];
    let right = [];
    let bottom = [];
    let left = [];

    canvas.width = 2 * x + w/8 * 7 - 5;
    canvas.height = 2 * y + h/8 * 7 - 5;
    canvas.setAttribute("id", id);

    canvas = setPosition(canvas);

    let piece = new Piece(x, y, w, h, id);
    piece.establishMargins();
    top = piece.top;
    right = piece.right;
    bottom = piece.bottom;
    left = piece.left;
    
    context.save();
    context.beginPath();
    context.moveTo(x, y);

    // top
    if (id <= numOfPieces) {
        context.lineTo(x + w, y);
    } else {
        top = pieces[id - numOfPieces - 1].bottom;

        context.lineTo(top[2].x, top[2].y - h);
        context.lineTo(top[1].x, top[1].y - h);
        context.lineTo(top[0].x, top[0].y - h);
        context.lineTo(x + w, y);
    }

    // right
    if (id % numOfPieces == 0) {
        context.lineTo(x + w, y + h);
    } else {
        context.lineTo(right[0].x, right[0].y);
        context.lineTo(right[1].x, right[1].y);
        context.lineTo(right[2].x, right[2].y);
        context.lineTo(x + w, y + h);
    }

    // bottom
    if (id <= numOfPieces * numOfPieces && id > numOfPieces * numOfPieces - numOfPieces) {
        context.lineTo(x, y + h);
    } else {
        context.lineTo(bottom[0].x, bottom[0].y);
        context.lineTo(bottom[1].x, bottom[1].y);
        context.lineTo(bottom[2].x, bottom[2].y);
        context.lineTo(x, y + h);
    }

    // left
    if (id % numOfPieces == 1) {
        context.lineTo(x, y);
    } else {
        left = pieces[id - 2].right;

        context.lineTo(left[2].x - w, left[2].y);
        context.lineTo(left[1].x - w, left[1].y);
        context.lineTo(left[0].x - w, left[0].y);
        context.lineTo(x, y);
    }
    context.closePath();
    context.clip();

    context.drawImage(image, sx, sy, image.width, 449, 0, 0, image.width, 449);

    context.restore();

    document.getElementById("photo").appendChild(canvas);

    dragAndDrop(id);
    pieces.push(piece);

    sx = sx + w;
    if (sx >= image.width) {
        sx = 0;
        sy = sy + h;
    }
    id++;
}

class Piece {
    constructor(x, y, w, h, id) {
        this.top = [];
        this.right = [];
        this.bottom = [];
        this.left = [];
        this.w = w;
        this.h = h;
        this.x = x;
        this.y = y;
        this.id = id;
    }

    establishMargins() {
        let w = this.w;
        let h = this.h;
        let x = this.x;
        let y = this.y;

        this.top.push(new Point(randomInRange(x + w/4 - 5, x + w/4 + 5), randomInRange(y + h/8 - 5, y + h/8 + 5)));
        this.top.push(new Point(randomInRange(x + w/2 - 5, x + w/2 + 5), randomInRange(y, y + 5)));
        this.top.push(new Point(randomInRange(x + w/4*3 - 5, x + w/4*3 + 5), randomInRange(y + h/8 - 5, y + h/8 + 5)));
        this.right.push(new Point(randomInRange(x + w/8*7 - 5, x + w/8*7 + 5), randomInRange(y + h/4 - 5, y + h/4 + 5)));
        this.right.push(new Point(randomInRange(x + w - 5, x + w), randomInRange(y + h/2 - 5, y + h/2 + 5)));
        this.right.push(new Point(randomInRange(x + w/8*7 - 5, x + w/8*7 + 5), randomInRange(y + h/4*3 - 5, y + h/4*3 + 5)));
        this.bottom.push(new Point(randomInRange(x + w/4*3 - 5, x + w/4*3 + 5), randomInRange(y + h/8*7 - 5, y + h/8*7 + 5)));
        this.bottom.push(new Point(randomInRange(x + w/2 - 5, x + w/2 + 5), randomInRange(y + h - 5, y + h)));
        this.bottom.push(new Point(randomInRange(x + w/4 - 5, x + w/4 + 5), randomInRange(y + h/8*7 - 5, y + h/8*7 + 5)));
        this.left.push(new Point(randomInRange(x + w/8 - 5, x + w/8 + 5), randomInRange(y + h/4*3 - 5, y + h/4*3 + 5)));
        this.left.push(new Point(randomInRange(x, x + 5), randomInRange(y + h/2 - 5, y + h/2 + 5)));
        this.left.push(new Point(randomInRange(x + w/8 - 5, x + w/8 + 5), randomInRange(y + h/4 - 5, y + h/4 + 5)));
    }
}

function Point(x, y) {
    this.x = x;
    this.y = y;
}

function randomInRange(min, max) {
    return(Math.floor((Math.random() * (max - min) + 1) + min));    
}

function setPosition(canvas) {
    var div = document.getElementById("photo");

    canvas.style.position = "absolute";
    canvas.style.top = "" + randomInRange(750, 600 + div.offsetHeight) + "px";
    if (Math.random() < 0.5) {
        canvas.style.left = "" + randomInRange(20, div.offsetWidth/6*2) + "px";
    } else {
        canvas.style.left = "" + randomInRange(div.offsetWidth/6*4, div.offsetWidth - 200) + "px";
    }

    return canvas;
}

function dragAndDrop(id) {
    var dragItem = document.getElementById(id);
    var container = document.getElementById("photo");

    var active = false;
    var currentX;
    var currentY;
    var initialX;
    var initialY;
    var xOffset = 0;
    var yOffset = 0;

    container.addEventListener("touchstart", dragStart, false);
    container.addEventListener("touchend", dragEnd, false);
    container.addEventListener("touchmove", drag, false);

    container.addEventListener("mousedown", dragStart, false);
    container.addEventListener("mouseup", dragEnd, false);
    container.addEventListener("mousemove", drag, false);

    function dragStart(e) {
      if (e.type === "touchstart") {
        initialX = e.touches[0].clientX - xOffset;
        initialY = e.touches[0].clientY - yOffset;
      } else {
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;
      }

      if (e.target === dragItem) {
        active = true;
      }
    }

    function dragEnd(e) {
      initialX = currentX;
      initialY = currentY;

      active = false;
    }

    function drag(e) {
      if (active) {
      
        e.preventDefault();
      
        if (e.type === "touchmove") {
          currentX = e.touches[0].clientX - initialX;
          currentY = e.touches[0].clientY - initialY;
        } else {
          currentX = e.clientX - initialX;
          currentY = e.clientY - initialY;
        }

        xOffset = currentX;
        yOffset = currentY;

        setTranslate(currentX, currentY, dragItem);
      }
    }

    function setTranslate(xPos, yPos, el) {
      el.style.transform = "translate3d(" + xPos + "px, " + yPos + "px, 0)";
    }
}