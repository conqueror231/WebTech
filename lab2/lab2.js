let button = document.getElementById("btn");
let output = document.getElementById("output");

button.addEventListener("click", function () {

    let text = "";
    function findMinMax(arr) {
        let min = arr[0];
        let max = arr[0];

        for (let i = 1; i < arr.length; i++) {
            if (arr[i] < min) min = arr[i];
            if (arr[i] > max) max = arr[i];
        }

        return { min: min, max: max };
    }

    let numbers = [5, 2, 9, 1, 7];
    let result = findMinMax(numbers);
    text += "Мін: " + result.min + ", Макс: " + result.max + "<br>";

    function isInRange(number, min, max) {
        return number >= min && number <= max;
    }

    text += "5 в діапазоні 1-10: " + isInRange(5, 1, 10) + "<br>";
    let isActive = true;
    isActive = !isActive;
    text += "NOT true = " + isActive + "<br>";

    function getGrade(score) {
        if (score >= 90) return "Відмінно";
        else if (score >= 75) return "Добре";
        else if (score >= 60) return "Задовільно";
        else return "Незадовільно";
    }

    text += "Оцінка 85: " + getGrade(85) + "<br>";

    output.innerHTML = text;

});