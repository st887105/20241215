const vocabulary = [
    { word: 'a', meaning: '一(個)', options: ['一(個)', '兩個', '三個', '四個'] },
    { word: 'A.M.', meaning: '上午', options: ['上午', '下午', '晚上', '凌晨'] },
    { word: 'ability', meaning: '能力、才能', options: ['能力、才能', '智慧', '體力', '精神'] },
    { word: 'able', meaning: '能夠的、有才能的', options: ['能夠的、有才能的', '困難的', '簡單的', '複雜的'] },
    { word: 'about', meaning: '大約、關於', options: ['大約、關於', '準確地', '完全地', '絕對地'] },
    { word: 'above', meaning: '在…上面、超過、大於', options: ['在…上面、超過、大於', '在下面', '在旁邊', '在中間'] },
    { word: 'above', meaning: '上文、前文', options: ['上文、前文', '下文', '結論', '摘要'] },
    { word: 'abroad', meaning: '在國外、到國外', options: ['在國外、到國外', '在國內', '在家裡', '在學校'] },
    { word: 'absent', meaning: '缺席的、不在場的、心不在焉的', options: ['缺席的、不在場的、心不在焉的', '出席的', '專注的', '積極的'] }
];

let currentQuestionIndex = 0;
let score = 0;
let timer;
let timeLeft;
let answers = [];

const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
};

const questions = shuffleArray([...vocabulary]).slice(0, 10);

function startQuiz() {
    currentQuestionIndex = 0;
    score = 0;
    answers = [];
    showQuestion();
    document.getElementById('quiz-container').classList.remove('hidden');
    document.getElementById('results-container').classList.add('hidden');
}

function showQuestion() {
    if (currentQuestionIndex >= questions.length) {
        showResults();
        return;
    }

    const question = questions[currentQuestionIndex];
    document.getElementById('word').textContent = question.word;
    document.getElementById('progress').textContent = `題目 ${currentQuestionIndex + 1}/10`;
    
    const optionsContainer = document.getElementById('options-container');
    optionsContainer.innerHTML = '';
    
    const shuffledOptions = shuffleArray([...question.options]);
    shuffledOptions.forEach(option => {
        const button = document.createElement('button');
        button.className = 'option-btn';
        button.textContent = option;
        button.onclick = () => checkAnswer(option);
        optionsContainer.appendChild(button);
    });

    document.getElementById('feedback').classList.add('hidden');
    startTimer();
}

function startTimer() {
    timeLeft = 15;
    updateTimerDisplay();
    
    if (timer) clearInterval(timer);
    
    timer = setInterval(() => {
        timeLeft--;
        updateTimerDisplay();
        
        if (timeLeft <= 0) {
            clearInterval(timer);
            handleTimeout();
        }
    }, 1000);
}

function updateTimerDisplay() {
    document.getElementById('timer').textContent = `剩餘時間：${timeLeft}秒`;
}

function checkAnswer(selectedAnswer) {
    clearInterval(timer);
    const question = questions[currentQuestionIndex];
    const correct = selectedAnswer === question.meaning;
    
    const feedback = document.getElementById('feedback');
    feedback.textContent = correct ? '✅ 答對了！' : `❌ 答錯了！正確答案是：${question.meaning}`;
    feedback.className = `feedback-${correct ? 'correct' : 'incorrect'}`;
    feedback.classList.remove('hidden');

    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(button => {
        button.disabled = true;
        if (button.textContent === question.meaning) {
            button.classList.add('correct');
        } else if (button.textContent === selectedAnswer && !correct) {
            button.classList.add('incorrect');
        }
    });

    answers.push({
        word: question.word,
        correct: correct,
        selected: selectedAnswer,
        correct_answer: question.meaning
    });

    if (correct) score += 10;

    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 2000);
}

function handleTimeout() {
    const question = questions[currentQuestionIndex];
    answers.push({
        word: question.word,
        correct: false,
        selected: '未作答',
        correct_answer: question.meaning
    });

    const feedback = document.getElementById('feedback');
    feedback.textContent = `⏰ 時間到！正確答案是：${question.meaning}`;
    feedback.className = 'feedback-incorrect';
    feedback.classList.remove('hidden');

    const buttons = document.querySelectorAll('.option-btn');
    buttons.forEach(button => {
        button.disabled = true;
        if (button.textContent === question.meaning) {
            button.classList.add('correct');
        }
    });

    setTimeout(() => {
        currentQuestionIndex++;
        showQuestion();
    }, 2000);
}

function showResults() {
    document.getElementById('quiz-container').classList.add('hidden');
    document.getElementById('results-container').classList.remove('hidden');
    
    document.getElementById('score').textContent = `總分：${score}分`;
    
    const answerList = document.getElementById('answer-list');
    answerList.innerHTML = '';
    
    answers.forEach((answer, index) => {
        const item = document.createElement('div');
        item.className = `answer-item ${answer.correct ? 'answer-correct' : 'answer-incorrect'}`;
        item.innerHTML = `
            第${index + 1}題：${answer.word}<br>
            您的答案：${answer.selected}<br>
            正確答案：${answer.correct_answer}<br>
            結果：${answer.correct ? '✅ 正確' : '❌ 錯誤'}
        `;
        answerList.appendChild(item);
    });
}

document.getElementById('restart-btn').onclick = startQuiz;

document.getElementById('speak-btn').onclick = function() {
    const word = document.getElementById('word').textContent;
    const utterance = new SpeechSynthesisUtterance(word);
    utterance.lang = 'en-US';
    speechSynthesis.speak(utterance);
};

// 開始測驗
startQuiz();
