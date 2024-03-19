class table {
    constructor(len, height, bombs) {
        this.pop = function (i, j) {
            let a = document.getElementById(i + " " + j);
            if (a.getAttribute("popped")=="true")
                return;
            a.setAttribute("popped", "true");
            if(!arr[i][j])a.innerHTML = numb[i][j];
            console.log("arr" + arr[i][j]);
            console.log("numb" + numb[i][j]);
        }
        const arr = bombsCreate(len, height, bombs);
        const numb = this.Numbers(arr, len, height);
        const bigness = 20;
        const that = this;
        const div = document.createElement("div");
        let left = 0;
        let top = 0;
        div.style.width = len * bigness + "px";
        div.style.height = height * bigness + "px";
        div.id = "table";
        div.setAttribute("popped", "false");
        div.setAttribute("lunghezza", len);
        div.setAttribute("altezza", height);
        document.body.appendChild(div);
        for (let i = 0; i < len; i++) {
            for (let j = 0; j < height; j++) {
                let node = document.createElement("div");
                node.style.width = bigness + "px";
                node.style.height = bigness + "px";
                node.style.left = left + "px";
                node.style.top = top + "px";
                node.className = "casella";
                node.id = i + " " + j;
                node.onclick = function () { that.pop(i, j) };
                node.setAttribute("popped", "false");
                document.getElementById("table").appendChild(node);
                top += bigness;
            }
            top = 0;
            left += bigness;
        }
        printArray(arr,len,height);
    }
    Numbers(arr, i, j) {
        let numb = new Array(i);
        for (let a = 0; a < i; a++) {
            numb[a] = new Array(j);
        }
        for (let a = 0; a < i; a++) {
            for (let b = 0; b < j; b++) {
                if (arr[a][b] == 0) {
                    numb[a][b] = intorno(arr, a, b, i, j);
                }
                else
                    numb[a][b] = 0;
            }
        }
        return numb;
    }
}
function intorno(arr, a, b, len, height) {
    let count = 0;
    let left = -1, right = 1, top = -1, down = 1;
    if (a == 0) left = 0;
    if (b == 0) top = 0;
    if (a == len - 1) right = 0;
    if (b == height - 1) down = 0;
    //console.log(left, right, top, down, a, b);
    for (let left1 = left; left1 <= right; left1++) {
        for (let top1 = top; top1 <= down; top1++) {
            if (arr[left1 + a][top1 + b] == 1) {
                count++;
            }
        }
    }
    return count;
}
function main(len, height, bombs) {
    let tavola = new table(len, height, bombs);
}

function printArray(arr, i, j) {
    for (let a = 0; a < i; a++) {
        for (let b = 0; b < j; b++) {
            console.log(arr[a][b]);
        }
    }
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function bombsCreate(i, j, bombs) {
    let arr = new Array(i);
    for (let a = 0; a < i; a++) {
        arr[a] = new Array(j);
    }
    for (let a = 0; a < i; a++) {
        for (let b = 0; b < j; b++) {
            arr[a][b] = 0;
        }
    }
    while (bombs!=0) {
        for (let a = 0; a < i; a++) {
            for (let b = 0; b < j; b++) {
                if (getRandomInt(bombs*5)==0 && arr[a][b] == 0) {
                    arr[a][b] = 1;
                    bombs--;
                    console.log("aa");
                }
                else if (arr[a][b] == 0)
                    arr[a][b] = 0;
                if (bombs == 0)
                    return arr;
            }
        }
    }
}