const amountNum = document.getElementById('amountInput');
const rangeNum = document.getElementById('rangeInput');
const goButton = document.getElementById('goButton');
const saveimgButton = document.getElementById('savimgButton');
const resultDiv = document.getElementById('resultDiv');

const classNames = {
    amtn: amountNum.className,
    rngn: rangeNum.className,
    gob: goButton.className,
    savib: saveimgButton.className
};

const goButtonRestart ='<svg class="w-1/2 h-1/2" fill="currentColor" viewBox="0 0 20 20"><path fill-rule="evenodd" d="M4 2a1 1 0 011 1v2.101a7.002 7.002 0 0111.601 2.566 1 1 0 11-1.885.666A5.002 5.002 0 005.999 7H9a1 1 0 010 2H4a1 1 0 01-1-1V3a1 1 0 011-1zm.008 9.057a1 1 0 011.276.61A5.002 5.002 0 0014.001 13H11a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0v-2.101a7.002 7.002 0 01-11.601-2.566 1 1 0 01.61-1.276z" clip-rule="evenodd"></path></svg>';

let restart = false;
let wait = true;
let waitNum = 9;

const soundEffects = [];
for (let i = 0; i < 45; i++)    {
    const soundEffect = new Audio();
    soundEffect.src = '../audio/spinwheel.mp3';
    soundEffects.push(soundEffect);
}

function loop() {
    if (wait === false)   {
        return;
    }
    const waitRandArr = randArrange(waitNum, waitNum);
    const waitDiv = makeResultDiv(waitRandArr);
    resultDiv.innerHTML = waitDiv;
    sleep(50);
    setTimeout(loop, 0);
}
loop();

/**
 * When user change value of Amount
 */
amountNum.addEventListener("change", function()    {
    if (checkLimit(amountNum.value, rangeNum.value))  {
        return;
    }
    waitNum = amountNum.value;
})

/**
 * When user change value of Range
 */
rangeNum.addEventListener("change", function() {
    if (checkLimit(amountNum.value, rangeNum.value))    {
        return;
    }
    waitNum = amountNum.value;
})

/**
 * When user click Go Button
 */
goButton.addEventListener("click", function()  {
    if (checkLimit(amountNum.value, rangeNum.value))  {
        return;
    }
    if (goButton.innerText === '확인') {
        amountNum.disabled = true;
        amountNum.className += ' cursor-not-allowed';
        rangeNum.disabled = true;
        rangeNum.className += ' cursor-not-allowed';
        saveimgButton.className = classNames.savib.slice(0, -10);
        goButton.innerHTML = goButtonRestart;
        restart = false;
        wait = false;
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
        goButton.innerText = '확인';
        restart = true;
        wait = true;
        loop();
    }
})

/**
 * When user click Save Image Button
 */
saveimgButton.addEventListener("click", function()  {
    PrintDiv(document.getElementById('resultField'));
})

/**
 * Main Function
 * anim 함수 끝나기 전에 mainProcess 가 실행되는 버그 있음.
 */
function main(amtNum, rngNum) {
    if (rusure(amtNum.value, rngNum.value))  {
        anim(amtNum.value, rngNum.value, resultDiv);
        mainProcess(amtNum.value, rngNum.value, resultDiv);
    }   else    {
        return;
    }
}

/**
 * Main Processes
 */
function mainProcess(amount, range, resultDiv)  {
    const adjustedRange = (range === '') ? 10 : range;
    const randArr = randArrange(amount, adjustedRange);
    const finalDiv = makeResultDiv(randArr);
    resultDiv.innerHTML = finalDiv;
    soundEffects[0].play();
}

/**
 * Check amount of Amount and Range
 */
function checkLimit(amount, range)   {
    if (amount === '' || range === '')  {
        return;
    }   else if (parseInt(amount) > parseInt(range) || amount < 1)   {
        alert(`개수 "${amount}" 는 범위 "${range}" 내에서 입력해주세요.`);
        amount = null;
        range = null;
        return true;
    }   else if (range < 1 || range > 500)   {
        alert('범위는 1 이상, 500 이하로 입력해주세요.');
        amount = null;
        range = null;
        return true;
    }
}

/**
 * Are you sure?
 */
function rusure(amount, range)    {
    const adjustedRange = (range === '') ? 10 : range;
    if (confirm(`정말 "뽑을 번호 ${amount}개, 범위 1 ~ ${adjustedRange} 이내" 에서 정할까요?`))  {
        return true;
    }   else    {
        return false;
    }
}

/**
 * Make Random Arrray
 */
function randArrange(amount, range)   {
    let randArr = {};
    const adjustedRange = (range === '') ? 10 : range;
    for (let i = 0; i < amount; i++)   {
        randArr[i] = Math.floor(Math.random() * adjustedRange) + 1;
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
function anim(amount, range, resultDiv) {
    let delay = 10;
    let count = 0;
    //while 문으로 사용할 시 js eventloop 내부 구조상 렌더링이 while 문 실행이 완료된 이후 진행됨.
    function loop() {
        if (restart === true)   {
            return;
        }
        if (delay >= 2000)    {
            return;
        }
        const animRandArr = randArrange(amount, range);
        const animDiv = makeResultDiv(animRandArr);
        resultDiv.innerHTML = animDiv;
        soundEffects[count].play();
        if (delay < 200)    {
            delay += 5;
        }   else if (delay < 700)    {
            delay += 100;
        }   else if (delay < 1000) {
            delay += 300;
        }   else if (delay <= 2000) {
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
 * Show Result Div
 */
function makeResultDiv(randArr) {
    result = '';
    for (let i = 0; i < Object.keys(randArr).length; i++)    {
        result += `<div class="w-20 h-25 m-2 border bg-white bg-opacity-25 flex justify-center items-center">${randArr[i]}</div>`;
    }
    return result;
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