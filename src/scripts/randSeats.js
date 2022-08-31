const studentNum = document.getElementById('studentInput');
const columnNum = document.getElementById('columnSelect');
const goButton = document.getElementById('goButton');
const saveimgButton = document.getElementById('savimgButton');
const arrangementTable = document.getElementById('table');

const classNames = {
    stdn: studentNum.className,
    coln: columnNum.className,
    gob: goButton.className,
    savib: saveimgButton.className
};

const goButtonRestart ='<svg class="w-1/2 h-1/2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path></svg>';

let restart = false;

/**
 * When user change value of Students
 */
studentNum.addEventListener("change", function()    {
    if (checkLimit(studentNum))  {
        return;
    }
    updateTable(studentNum, columnNum, arrangementTable);
})

/**
 * When user change value of Columns
 */
columnNum.addEventListener("change", function() {
    updateTable(studentNum, columnNum, arrangementTable);
})

/**
 * When user click Go Button
 */
goButton.addEventListener("click", function()  {
    if (checkLimit(studentNum))  {
        return;
    }
    if (goButton.innerText === 'GO !') {
        studentNum.disabled = true;
        studentNum.className += ' cursor-not-allowed';
        columnNum.disabled = true;
        columnNum.className += ' cursor-not-allowed';
        saveimgButton.className = classNames.savib.slice(0, -10);
        goButton.innerHTML = goButtonRestart;
        restart = false;
        main(studentNum, columnNum, arrangementTable);
    }   else if (goButton.innerHTML === goButtonRestart)    {
        studentNum.value = null;
        studentNum.disabled = false;
        studentNum.className = classNames.stdn;
        columnNum.disabled = false;
        columnNum.className = classNames.coln;
        /** 자리 배치 저장하기 버튼이 애니메이션 재생 중 보여지는 버그 있음. */
        saveimgButton.className = classNames.savib;
        goButton.innerText = 'GO !';
        restart = true;
        updateTable(studentNum, columnNum, arrangementTable);
    }
})

/**
 * When user click Save Image Button
 */
saveimgButton.addEventListener("click", function()  {
    PrintDiv(document.getElementById('tablefield'));
})

/**
 * Main Function
 * anim 함수 끝나기 전에 mainProcess 가 실행되는 버그 있음.
 */
function main(stdNum, colNum, arrmentTable) {
    if (rusure(stdNum, colNum))  {
        anim(stdNum, colNum, arrmentTable);
        mainProcess(stdNum, colNum, arrmentTable);
    }   else    {
        return;
    }
}

/**
 * Main Processes
 */
function mainProcess(stdNum, colNum, arrmentTable)  {
    const randArr = randArrange(stdNum.value);
    const finalTable = resultTable(stdNum, colNum, randArr);
    arrmentTable.innerHTML = finalTable;
}

/**
 * Check amount of students
 */
function checkLimit(stdNum)   {
    if (stdNum.value <= 0 || stdNum.value > 500)    {
        alert('학생 수는 1명 이상, 500명 이하만 입력 가능합니다.');
        stdNum.value = null;
        return true;
    }
}

/**
 * Are you sure?
 */
function rusure(stdNum, colNum)    {
    if (confirm(`정말 "학생 수 ${stdNum.value}명, 열 개수 ${colNum.value}개" 로 배치할까요?`))  {
        return true;
    }   else    {
        return false;
    }
}

/**
 * Make Random Arrray
 */
function randArrange(num)   {
    let randArr = {};
    for (let i = 0; i < num; i++)   {
        randArr[i] = Math.floor(Math.random() * num) + 1;
        for (let j = 0; j < i; j++)   {
            if (randArr[i] === randArr[j])   {
                i--;
            }
        }
    }
    return randArr;
}

/**
 * Animation
 * @todo 마지막 테이블 출력 시 화면 흔들리는 효과
 */
function anim(stdNum, colNum, arrmentTable) {
    let delay = 10;
    //while 문으로 사용할 시 js eventloop 내부 구조상 렌더링이 while 문 실행이 완료된 이후 진행됨.
    function loop() {
        if (restart === true)   {
            return;
        }
        if (delay > 350)    {
            return;
        }
        const animRandArr = randArrange(stdNum.value);
        const animTable = resultTable(stdNum, colNum, animRandArr);
        arrmentTable.innerHTML = animTable;
        sleep(delay);
        if (delay < 300)    {
            delay += 5;
        }   else    {
            delay += 25;
        }
        setTimeout(loop, 0);
    }
    loop();
}

/**
 * Delay
 */
function sleep(ms)  {
    const wakeUpTime = Date.now() + ms;
    while (Date.now() < wakeUpTime) {}
}

/**
 * Update arrangement of Table
 */
function updateTable(stdNum, colNum, arrmentTable)   {
    let table = '';
    let stdnum = stdNum.value;
    if (stdnum === '')    {
        stdnum = 20;
    }
    table += '<table class="border-separate border-spacing-2">';
    for (let i = 0; i < parseInt(stdnum / colNum.value); i++)    {
        table += '<tr align="center">';
        for (let j = 0; j < colNum.value; j++)   {
            table += '<td class="p-1 w-12 h-12 border bg-white bg-opacity-25"><img src="../../src/images/undefined_24.png"></td>';
        }
        table += '</tr>';
    }
    if (stdnum % colNum.value != 0)    {
        table += '<tr align="center">';
        for (let i = 0; i < stdnum % colNum.value; i++)    {
            table += `<td class="p-1 w-12 h-12 border bg-white bg-opacity-25"><img src="../../src/images/undefined_24.png"></td>`;
        }
    }
    table += '</table><br/>';
    arrmentTable.innerHTML = table;
}

/**
 * Show Result Table
 */
function resultTable(stdNum, colNum, randArr)    {
    let count = 0;
    let table = '';
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

/**
 * html2canvas
 */
function PrintDiv(div)  {
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