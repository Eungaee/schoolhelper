const amountNum = document.getElementById('amountInput');
const rangeNum = document.getElementById('rangeInput');
const goButton = document.getElementById('goButton');
const saveimgButton = document.getElementById('savimgButton');

const classNames = {
    amtn: amountNum.className,
    rngn: rangeNum.className,
    gob: goButton.className,
    savib: saveimgButton.className
};

const goButtonRestart ='<svg class="w-1/2 h-1/2" fill="currentColor" viewBox="0 0 20 20" xmlns="http://www.w3.org/2000/svg"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path></svg>';

let restart = false;

/**
 * When user change value of Amount
 */
amountNum.addEventListener("change", function()    {
    if (checkLimit(amountNum))  {
        return;
    }
    updateTable(amountNum, rangeNum);
})

/**
 * When user change value of Range
 */
rangeNum.addEventListener("change", function() {
    if (checkLimit(rangeNum))   {
        return;
    }
    updateTable(amountNum, rangeNum);
})

/**
 * When user click Go Button
 */
goButton.addEventListener("click", function()  {
    if (checkLimit(studentNum))  {
        return;
    }
    if (goButton.innerText === 'GO !') {
        amountNum.disabled = true;
        amountNum.className += ' cursor-not-allowed';
        rangeNum.disabled = true;
        rangeNum.className += ' cursor-not-allowed';
        saveimgButton.className = classNames.savib.slice(0, -10);
        goButton.innerHTML = goButtonRestart;
        restart = false;
        main(amountNum, rangeNum);
    }   else if (goButton.innerHTML === goButtonRestart)    {
        amountNum.value = null;
        amountNum.disabled = false;
        amountNum.className = classNames.amtn;
        rangeNum.value = null;
        rangeNum.disabled = false;
        rangeNum.className = classNames.rngn;
        /** 자리 배치 저장하기 버튼이 애니메이션 재생 중 보여지는 버그 있음. */
        saveimgButton.className = classNames.savib;
        goButton.innerText = 'GO !';
        restart = true;
        updateTable(amountNum, rangeNum);
    }
})

/**
 * When user click Save Image Button
 */
saveimgButton.addEventListener("click", function()  {
    PrintDiv(document.getElementById('numbersfield'));
})

/**
 * Main Function
 * anim 함수 끝나기 전에 mainProcess 가 실행되는 버그 있음.
 */
function main(amtNum, rngNum) {
    if (rusure(amtNum, rngNum))  {
        anim(amtNum, rngNum);
        mainProcess(amtNum, rngNum);
    }   else    {
        return;
    }
}

/**
 * Main Processes
 */
function mainProcess(amtNum, rngNum)  {
    const randArr = randArrange(amtNum.value);
}

/**
 * Check amount of Amount and Range
 */
function checkLimit(input)   {
    if (input.id === 'amountInput')   {
        if (input.value < 0 || input.value > 499)   {
            alert('개수는 1개 이상, 499개 이하만 입력 가능합니다.');
            input.value = null;
            return true;
        }
    }   else if (input.id === 'rangeInput') {
        if (input.value < 0 || input.value > 500)   {
            alert('범위는 1 이상, 500 이하만 입력 가능합니다.');
            input.value = null;
            return true;
        }
    }
}

/**
 * Are you sure?
 */
function rusure(amtNum, rngNum)    {
    if (confirm(`정말 "뽑을 번호 개수 ${amtNum.value}개, 범위 1 ~ ${rngNum.value}" 로 할까요?`))  {
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