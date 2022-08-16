const myButton = document.getElementById('confirmButton');
const studentNum = document.getElementById('studentInput');
const columnNum = document.getElementById('columnSelect');

let stdnClass = studentNum.className;
let colnClass = columnNum.className;

var arrangementTable = document.getElementById('table');

studentNum.onchange = function() {
    if (studentNum.value <= 0 || studentNum.value > 100)    {
        alert('학생 수는 1명 이상, 100명 이하만 입력 가능합니다.');
        studentNum.value = null;
    }
    updateTable(studentNum, columnNum, arrangementTable);
};
columnNum.onchange = function() {updateTable(studentNum, columnNum, arrangementTable)};

myButton.onclick = ()=>{
    if (myButton.value === '자리 배정') {
        studentNum.disabled=true;
        columnNum.disabled=true;
        studentNum.className += ' cursor-not-allowed';
        columnNum.className += ' cursor-not-allowed';
        myButton.value = '다시 하기';
        main(studentNum, columnNum, arrangementTable);
    }   else if (myButton.value === '다시 하기')    {
        studentNum.value = null;
        studentNum.disabled=false;
        columnNum.disabled=false;
        studentNum.className = stdnClass;
        columnNum.className = colnClass;
        myButton.value = '자리 배정';
        updateTable(studentNum, columnNum, arrangementTable);
    }
}

function main(stdNum, colNum, arrmentTable) {
    userInput(stdNum, colNum);
    const randArr = randArrange(stdNum.value);
    finalTable = resultTable(stdNum, colNum, randArr);
    arrmentTable.innerHTML = finalTable;
}

function userInput(stdNum, colNum)    {
    if (stdNum.value <= 0 || stdNum.value > 30)   {
        alert('학생 수는 1명 이상, 30명 이하만 입력 가능합니다.');
        stdNum.value = null;
    }   else    {
        alert('학생 수 ' + stdNum.value + '명, ' + '열 개수 ' + colNum.value + '개');
    }
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
    if (stdNum.value === '')    {
        stdNum.value = 20;
    }
    table += '<table class="border-separate border-spacing-2">';
    for (let i = 0; i < parseInt(stdNum.value / colNum.value); i++)    {
        table += '<tr align="center">';
        for (let j = 0; j < colNum.value; j++)   {
            table += '<td class="p-1 w-12 h-12 border bg-white bg-opacity-25"><img src="./src/images/undefined_24.png"></td>';
        }
        table += '</tr>';
    }
    if (stdNum.value % colNum.value != 0)    {
        table += '<tr align="center">';
        for (let i = 0; i < stdNum.value % colNum.value; i++)    {
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