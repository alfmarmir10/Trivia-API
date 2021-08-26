// const fetch = require('node-fetch');

// exports.functionName= (req, res) => {
//   const fetchFromURL = async () => await (await fetch('https://yourURL.com')).json();

//   fetchFromURL().then((data) => {
//     // do something with data (received from URL).
//   });
// };

let triviaResponse = [];
let currentQuestion = 0;

function fetchQuestions () {
    if(localStorage.getItem('URL_API')!=undefined){
        fetch(localStorage.getItem('URL_API'))
        .then(promise=>promise.json())
        .then(obj=>{
            console.log(obj);
            if(obj.response_code == 1){
                alert("No encontramos coincidencias con tu selección.");
                location.href = 'home.html';
                return;
            }
            obj.results.forEach(element => {
                const item = {
                    Question : element.question,
                    Correct_Answer : element.correct_answer,
                    Incorrect_Answers : element.incorrect_answers,
                    Already_Answered: false,
                    Correctly_Answered: '',
                    Selected_Answer: '',
                    Posible_Answers: element.correct_answer + "," +element.incorrect_answers
                };
                triviaResponse.push(item);
            });
            localStorage.removeItem('URL_API');
            localStorage.setItem('totalQuestions', triviaResponse.length);
            localStorage.setItem('correctAnswers', 0);
            startTrivia();
        })
        .catch((error)=>{
            console.log(error);
        })
    } else {
        location.href = 'home.html';
    }
} 

function startTrivia(){
    if(currentQuestion >= triviaResponse.length){
        location.href = 'results.html';
    }
    if(triviaResponse.length>0){
        // for(let i = 0; i < triviaResponse.length; i++){
        //     if(triviaResponse[i]["Alredy_Answered"] === true){
        //         currentQuestion = i + 1;
        //     }
        // }
        document.getElementById('question').innerHTML = triviaResponse[currentQuestion]["Question"];
        const arrayPosibleAnswers = triviaResponse[currentQuestion]["Posible_Answers"].split(',');
        arrayPosibleAnswers.sort();

        const answersContainer = document.getElementById('answers-container');
        answersContainer.innerHTML = '';

        arrayPosibleAnswers.forEach(element => {
            const answerContainerItem = document.createElement('div');
            answerContainerItem.classList.add('answer-container-item', 'flex-row-center', 'margin-top-sm');

                const input = document.createElement('input');
                input.classList.add('answer-input');
                input.type = "radio";
                input.id = element;
                input.name = 'answers';
                input.value = element;

                const label = document.createElement('label');
                label.classList.add('answer-label', 'font-size-md', 'color-white');
                const labelFor = document.createAttribute('for');
                labelFor.value = element;
                label.setAttributeNode(labelFor);
                label.innerHTML = element;

                answerContainerItem.appendChild(input);
                answerContainerItem.appendChild(label);

                answersContainer.appendChild(answerContainerItem);
        });

        // triviaResponse[currentQuestion][C].forEach(element => {
            
        // });
    } else {
        alert(`Al parecer no hay preguntas listas para jugar. 
        
Intenta de nuevo por favor.`);
        location.href = 'home.html';
    }
}

function validateAnswer(){
    const selectedAnswer = document.querySelector('input[name="answers"]:checked').value;
    triviaResponse[currentQuestion]["Already_Answered"] = true;
    triviaResponse[currentQuestion]["Selected_Answer"] = selectedAnswer;
    if(selectedAnswer === triviaResponse[currentQuestion]["Correct_Answer"]){
        triviaResponse[currentQuestion]["Correctly_Answered"] = true;
        const currentCorrectAnswers = Number(localStorage.getItem('correctAnswers'));
        localStorage.setItem('correctAnswers', currentCorrectAnswers + 1);
    } else {
        triviaResponse[currentQuestion]["Correctly_Answered"] = false;
    }
    console.log(triviaResponse);
    currentQuestion += 1;
    startTrivia();
}

function printResult(){
    const result = Number(localStorage.getItem('correctAnswers'))/Number(localStorage.getItem('totalQuestions'));
    const percentaje = result * 100;
    let classToAdd = "color-white";
    let imgCalif = '';
    if(percentaje <= 50){
        classToAdd = "color-red";
        imgCalif = './Assets/img/calificaciones_bajo';
    } else if(percentaje > 50 && percentaje < 80){
        classToAdd = "color-gold";
        imgCalif = './Assets/img/calificaciones_medio';
    } else if(percentaje >= 80 && percentaje <= 100){
        classToAdd = 'color-green';
        imgCalif = './Assets/img/calificaciones_alto';
    }
    
    document.getElementById('porcentajeCalificacion').classList.add(classToAdd);
    document.getElementById('porcentajeCalificacion').classList.remove('hide');
    document.getElementById('imgCalificacion').src = imgCalif+".png";
    document.getElementById('imgCalificacion').classList.remove('hidden');
    document.getElementById('porcentajeCalificacion').innerText = percentaje.toFixed(0) + "%";
}