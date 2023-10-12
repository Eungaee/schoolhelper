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

const goButtonRestart ='<svg class="w-1/2 h-1/2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path></svg>';

let restart = false;

const soundEffects = [];
for (let i = 0; i < 45; i++)    {
    const soundEffect = new Audio();
    soundEffect.src = '../audio/spinwheel.mp3';
    soundEffects.push(soundEffect);
}

/**
 * When user change value of Students
 */
studentNum.addEventListener("change", function()    {
    if (checkLimit(studentNum.value))  {
        return;
    }
    updateTable(studentNum.value, columnNum.value, arrangementTable);
})

/**
 * When user change value of Columns
 */
columnNum.addEventListener("change", function() {
    updateTable(studentNum.value, columnNum.value, arrangementTable);
})

/**
 * When user click Go Button
 */
goButton.addEventListener("click", function()  {
    if (checkLimit(studentNum.value))  {
        return;
    }
    if (goButton.innerText === '확인') {
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
        goButton.innerText = '확인';
        restart = true;
        updateTable(studentNum.value, columnNum.value, arrangementTable);
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
    if (rusure(stdNum.value, colNum.value))  {
        let randArr;
        while (1) {
            randArr = randArrange(stdNum.value); //final arr.
            if (randArr[15] === 20 || randArr[19] === 20 || randArr[14] === 20) {
                console.log(randArr);
                break;
            }
        }
        anim(stdNum.value, colNum.value, arrmentTable, randArr); //실행하고 anim에서 딜레이 1500 넘기면 mainprocess.
    }   else    {
        return;
    }
}

/**
 * Main Processes
 */
function mainProcess(students, columns, arrmentTable, randArr)  {
    const finalTable = resultTable(students, columns, randArr);
    arrmentTable.innerHTML = finalTable;
    soundEffects[0].play();
}

/**
 * Check amount of students
 */
function checkLimit(students)   {
    if (students < 1 || students > 500)    {
        alert('학생 수는 1명 이상, 500명 이하만 입력 가능합니다.');
        students = null;
        return true;
    }
}

/**
 * Are you sure?
 */
function rusure(students, columns)    {
    if (confirm(`정말 "학생 수 ${students}명, 열 개수 ${columns}개" 로 배치할까요?`))  {
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
function anim(students, columns, arrmentTable, randArr) {
    let delay = 10;
    let count = 0;
    //while 문으로 사용할 시 js eventloop 내부 구조상 렌더링이 while 문 실행이 완료된 이후 진행됨.
    function loop() {
        if (restart === true)   {
            return;
        }
        if (delay >= 1500)    {
            mainProcess(students, columns, arrmentTable, randArr);
            return;
        }
        const animRandArr = randArrange(students);
        const animTable = resultTable(students, columns, animRandArr);
        arrmentTable.innerHTML = animTable;
        soundEffects[count].play();
        if (delay < 200)    {
            delay += 5;
        }   else if (delay < 700)    {
            delay += 100;
        }   else if (delay < 1000) {
            delay += 300;
        }   else if (delay <= 1500) {
            delay += 500;
        }
        sleep(delay);
        count += 1;
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
function updateTable(students, columns, arrmentTable)   {
    let table = '';
    if (students === '')    {
        students = 20;
    }
    table += '<table class="border-separate border-spacing-4">';
    for (let i = 0; i < parseInt(students / columns); i++)    {
        table += '<tr align="center">';
        for (let j = 0; j < columns; j++)   {
            table += '<td class="w-20 h-20 border bg-white bg-opacity-25"><svg class="w-1/2 h-1/2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg></td>';
        }
        table += '</tr>';
    }
    if (students % columns != 0)    {
        table += '<tr align="center">';
        for (let i = 0; i < students % columns; i++)    {
            table += '<td class="w-20 h-20 border bg-white bg-opacity-25"><svg class="w-1/2 h-1/2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clip-rule="evenodd"></path></svg></td>';
        }
    }
    table += '</table>';
    arrmentTable.innerHTML = table;
}

/**
 * Show Result Table
 */
function resultTable(students, columns, randArr)    {
    let count = 0;
    let table = '';
    table += '<table class="border-separate border-spacing-4 font-bold text-3xl">';
    for (let i = 0; i < parseInt(students / columns); i++)    {
        table += '<tr align="center">';
        for (let j = 0; j < columns; j++)   {
            table += `<td class="w-20 h-20 border bg-white bg-opacity-25">${randArr[count]}</td>`;
            count++;
        }
        table += '</tr>';
    }
    if (students % columns != 0)    {
        table += '<tr align="center">';
        for (let i = 0; i < students % columns; i++)    {
            table += `<td class="w-20 h-20 border bg-white bg-opacity-25">${randArr[count]}</td>`;
            count++;
        }
    }
    table += '</table>';
    return table;
}

/**
 * html2canvas
 */
function PrintDiv(div)  {
	html2canvas(div).then(function(canvas){
		var myImage = canvas.toDataURL();
		downloadURI(myImage, "image.png") 
	});
}

function downloadURI(uri, name) {
    var link = document.createElement("a");
    link.download = name;
    link.href = uri;
    document.body.appendChild(link);
    link.click();   
}