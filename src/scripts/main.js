const studentNum = document.getElementById('studentInput');
const columnNum = document.getElementById('columnSelect');
const confirmButton = document.getElementById('confirmInput');
const saveimgButton = document.getElementById('saveimgInput');

let stdnClass = studentNum.className;
let colnClass = columnNum.className;
let savibClass = saveimgButton.className;

var arrangementTable = document.getElementById('table');

studentNum.addEventListener("change", function()    {
    if (studentNum.value <= 0 || studentNum.value > 500)    {
        alert('학생 수는 1명 이상, 500명 이하만 입력 가능합니다.');
        studentNum.value = null;
    }
    updateTable(studentNum, columnNum, arrangementTable);
})

columnNum.addEventListener("change", function() {
    updateTable(studentNum, columnNum, arrangementTable);
})

confirmButton.addEventListener("click", function()  {
    if (confirmButton.value === '자리 배정') {
        studentNum.disabled=true;
        columnNum.disabled=true;
        studentNum.className += ' cursor-not-allowed';
        columnNum.className += ' cursor-not-allowed';
        confirmButton.value = '다시 하기';
        saveimgButton.className = savibClass.slice(0, -10);
        main(studentNum, columnNum, arrangementTable);
    }   else if (confirmButton.value === '다시 하기')    {
        studentNum.value = null;
        studentNum.disabled=false;
        columnNum.disabled=false;
        studentNum.className = stdnClass;
        columnNum.className = colnClass;
        confirmButton.value = '자리 배정';
        saveimgButton.className = savibClass;
        updateTable(studentNum, columnNum, arrangementTable);
    }
})

saveimgButton.addEventListener("click", function()  {
    PrintDiv(document.getElementById('tablefield'));
})

function main(stdNum, colNum, arrmentTable) {
    userInput(stdNum, colNum);
    const randArr = randArrange(stdNum.value);
    finalTable = resultTable(stdNum, colNum, randArr);
    arrmentTable.innerHTML = finalTable;
}

function userInput(stdNum, colNum)    {
    alert('학생 수 ' + stdNum.value + '명, ' + '열 개수 ' + colNum.value + '개');
}

function randArrange(num)   {
    randArr = {};
    for (let i = 0; i < num; i++)   {
        randArr[i] = Math.floor(Math.random() * num) + 1;
        for (let j = 0; j < i; j++)   {
            if (randArr[i] == randArr[j])   {
                i--;
            }
        }
    }
    return randArr;
}

function updateTable(stdNum, colNum, arrmentTable)   {
    var table = '';
    stdnum = stdNum.value;
    if (stdnum === '')    {
        stdnum = 20;
    }
    table += '<table class="border-separate border-spacing-2">';
    for (let i = 0; i < parseInt(stdnum / colNum.value); i++)    {
        table += '<tr align="center">';
        for (let j = 0; j < colNum.value; j++)   {
            table += '<td class="p-1 w-12 h-12 border bg-white bg-opacity-25"><img src="./src/images/undefined_24.png"></td>';
        }
        table += '</tr>';
    }
    if (stdnum % colNum.value != 0)    {
        table += '<tr align="center">';
        for (let i = 0; i < stdnum % colNum.value; i++)    {
            table += `<td class="p-1 w-12 h-12 border bg-white bg-opacity-25"><img src="./src/images/undefined_24.png"></td>`;
        }
    }
    table += '</table><br/>';
    arrmentTable.innerHTML = table;
}

function resultTable(stdNum, colNum, randArr)    {
    let count = 0;
    var table = '';
    table += '<table class="border-separate border-spacing-2 font-bold">';
    for (let i = 0; i < parseInt(stdNum.value / colNum.value); i++)    {
        table += '<tr align="center">';
        for (let j = 0; j < colNum.value; j++)   {
            table += `<td class="p-1 w-12 h-12 border bg-white bg-opacity-25"> ${randArr[count]}</td>`;
            count++;
        }
        table += '</tr>';
    }
    if (stdNum.value % colNum.value != 0)    {
        table += '<tr align="center">';
        for (let i = 0; i < stdNum.value % colNum.value; i++)    {
            table += `<td class="p-1 w-12 h-12 border bg-white bg-opacity-25"> ${randArr[count]}</td>`;
            count++;
        }
    }
    table += '</table><br/>';
    return table;
}

function PrintDiv(div){
	html2canvas(div).then(function(canvas){
		var myImage = canvas.toDataURL();
		downloadURI(myImage, "seatingchart.png") 
	});
}

function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();   
}