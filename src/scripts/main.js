const myButton = document.getElementById('confirmButton');
const studentNum = document.getElementById('studentInput');
const columnNum = document.getElementById('columnSelect');

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
        main(studentNum, columnNum, arrangementTable);
        myButton.value = '다시 하기';
    }   else if (myButton.value === '다시 하기')    {
        studentNum.value = null;
        studentNum.disabled=false;
        columnNum.disabled=false;
        updateTable(studentNum, columnNum, arrangementTable);
        myButton.value = '자리 배정';
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
        alert('학생 수 ' + stdNum.value + '명을, ' + '열 개수 ' + colNum.value + '개를 입력하셨습니다.');
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
        table += '<tr>';
        for (let j = 0; j < colNum.value; j++)   {
            table += '<td class="p-1 border w-12 h-12"><img src="./src/images/undefined_24.png"></td>';
        }
        table += '</tr>';
    }
    if (stdNum.value % colNum.value != 0)    {
        table += '<tr>';
        for (let i = 0; i < stdNum.value % colNum.value; i++)    {
            table += `<td class="p-1 border w-12 h-12"><img src="./src/images/undefined_24.png"></td>`;
        }
    }
    table += '</table><br/>';
    arrmentTable.innerHTML = table;
}

function resultTable(stdNum, colNum, randArr)    {
    let count = 0;
    var table = '';
    table += '<table class="border-separate border-spacing-2">';
    for (let i = 0; i < parseInt(stdNum.value / colNum.value); i++)    {
        table += '<tr>';
        for (let j = 0; j < colNum.value; j++)   {
            table += `<td class="p-2 border w-12 h-12"> ${randArr[count]}</td>`;
            count++;
        }
        table += '</tr>';
    }
    if (stdNum.value % colNum.value != 0)    {
        table += '<tr>';
        for (let i = 0; i < stdNum.value % colNum.value; i++)    {
            table += `<td class="p-2 border w-12 h-12"> ${randArr[count]}</td>`;
            count++;
        }
    }
    table += '</table><br/>';
    return table;
}