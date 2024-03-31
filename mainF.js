class table {
    constructor(len, height, bombs) {
        this.len = len;
        this.height = height;
        this.bombs = bombs;
        const that = this;
        let lost = false;
        let won = false;
        this.won = won;
        this.lost = lost;
        let arr;
        let numb;
        this.flag = function (i, j) {
            let a = document.getElementById(i + " " + j);
            if (a.getAttribute("popped") == "true")
                return;
            if (a.getAttribute("flag") == "false")
                a.setAttribute("flag", "true");
            else
                a.setAttribute("flag", "false");
        }
        this.pop = function (i, j) {
            if (document.getElementById("table").getAttribute("popped") == "false") {
                arr = bombsCreate(len, height, bombs, i, j);
                numb = that.Numbers(arr, len, height);
                that.numb = numb;
                document.getElementById("table").setAttribute("popped", "true");
            }
            let a = document.getElementById(i + " " + j);
            if (a.getAttribute("popped") == "true") {
                deleteDone(i, j, numb, len, height, that)
                return;
            }
            if (a.getAttribute("flag") == "true")
                return;
            a.setAttribute("popped", "true");
            if (!arr[i][j]) {
                if (numb[i][j] != 0) {
                    a.innerHTML = numb[i][j];
                }
            }
            else {
                a.innerHTML = "B";
                if (!that.lost && !that.won) {
                    that.lost = true;
                    loss(len, height, that, bombs)
                }
                return;
            }
            if (check(len, height, bombs)) {
                setTimeout(() => {
                    that.won = true;
                    alert("Hai vinto!")
                }, 500);
            }
            if (!numb[i][j]) {
                let left = -1, right = 1, top = -1, down = 1;
                if (i == 0) left = 0;
                if (j == 0) top = 0;
                if (i == len - 1) right = 0;
                if (j == height - 1) down = 0;
                for (let left1 = left; left1 <= right; left1++) {
                    for (let top1 = top; top1 <= down; top1++) {
                        if (document.getElementById((left1 + i) + " " + (top1 + j)).getAttribute("popped") == "false")
                            this.pop(i + left1, j + top1);
                    }
                }
            }
        }
        const bigness = 20;
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
                node.addEventListener('contextmenu', function (ev) {
                    ev.preventDefault();
                    that.flag(i, j);
                    return false;
                }, false);
                node.className = "casella";
                node.id = i + " " + j;
                node.setAttribute("flag", "false");
                node.onclick = function () { that.pop(i, j) };
                node.setAttribute("popped", "false");
                document.getElementById("table").appendChild(node);
                top += bigness;
            }
            top = 0;
            left += bigness;
        }
        //printArray(arr, len, height);
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
class button {
    constructor(tavola) {
        const a = document.getElementById("table");
        const b = document.createElement("button");
        b.onclick = function () { godo(tavola) };
        b.innerHTML = "Vai";
        a.appendChild(b);
    }
}
function godo(tavola) {
    for (let index = 0; index < tavola.len; index++) {
        for (let index1 = 0; index1 < tavola.height; index1++) {
            if (document.getElementById(index + " " + index1).getAttribute("popped") == "true") {
                deleteDone(index,index1,tavola.numb,tavola.len,tavola.height,tavola);
            }
        }
    }
}
function intorno(arr, a, b, len, height) {
    let count = 0;
    let left = -1, right = 1, top = -1, down = 1;
    if (a == 0) left = 0;
    if (b == 0) top = 0;
    if (a == len - 1) right = 0;
    if (b == height - 1) down = 0;
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
    let bottone = new button(tavola);
    console.log("Main Called");
}

function printArray(arr, i, j) {
    for (let a = 0; a < i; a++) {
        for (let b = 0; b < j; b++) {
            console.log(arr[a][b]);
        }
    }
}
function check(len, height, bombs) {
    let count = 0;
    for (let index = 0; index < len; index++) {
        for (let index1 = 0; index1 < height; index1++) {
            if (document.getElementById(index + " " + index1).getAttribute("popped") == "true")
                count++;
        }
    }
    let a = len * height;
    if (a - bombs == count)
        return true;
    return false;

}
function loss(len, height, that, bombs) {
    for (let index = 0; index < len; index++) {
        for (let index1 = 0; index1 < height; index1++) {
            that.pop(index, index1);
        }
    }
    setTimeout(() => {
        if (confirm('You lost! Wanna play again?')) {
            document.getElementById("table").remove();
            main(len, height, bombs);
        }
    }, 100);
}
function getRandomInt(max) {
    return Math.floor(Math.random() * max);
}
function deleteDone(a, b, numb, len, height, that) {
    let count = 0;
    let left = -1, right = 1, top = -1, down = 1;
    if (a == 0) left = 0;
    if (b == 0) top = 0;
    if (a == len - 1) right = 0;
    if (b == height - 1) down = 0;
    //console.log(left, right, top, down, a, b);
    for (let left1 = left; left1 <= right; left1++) {
        for (let top1 = top; top1 <= down; top1++) {
            if (document.getElementById((left1 + a) + " " + (top1 + b)).getAttribute("flag") == "true") {
                count++;
            }
        }
    }
    if (count == numb[a][b]) {
        for (let left1 = left; left1 <= right; left1++) {
            for (let top1 = top; top1 <= down; top1++) {
                if (document.getElementById((left1 + a) + " " + (top1 + b)).getAttribute("popped") == "false")
                    that.pop(a + left1, b + top1);
            }
        }
    }
}
function bombsCreate(i, j, bombs, len, hei) {
    let arr = new Array(i);
    for (let a = 0; a < i; a++) {
        arr[a] = new Array(j);
    }
    for (let a = 0; a < i; a++) {
        for (let b = 0; b < j; b++) {
            arr[a][b] = 0;
        }
    }
    while (bombs != 0) {
        for (let a = 0; a < i; a++) {
            for (let b = 0; b < j; b++) {
                if (getRandomInt(bombs * 5) == 0 && arr[a][b] == 0 && (len != a || hei != b)) {
                    arr[a][b] = 1;
                    bombs--;
                    //console.log("aa");
                }
                else if (arr[a][b] == 0)
                    arr[a][b] = 0;
                if (bombs == 0)
                    return arr;
            }
        }
    }
}