function print(text) {
    document.getElementById("output").innerHTML += "<p>" + text + "</p>";
}

function task1() {
    let i = 1;
    let sum = 0;

    while (i <= 50) {
        sum += i;
        i++;
    }

    print("1. Сума перших 50 чисел: " + sum);
}

function task2() {
    let num = parseInt(prompt("Введіть число для факторіалу:"));
    let factorial = 1;

    for (let i = 1; i <= num; i++) {
        factorial *= i;
    }

    print("2. Факторіал числа " + num + " = " + factorial);
}

function task3() {
    let month = parseInt(prompt("Введіть число від 1 до 12:"));
    let name;

    switch (month) {
        case 1: name = "Січень"; break;
        case 2: name = "Лютий"; break;
        case 3: name = "Березень"; break;
        case 4: name = "Квітень"; break;
        case 5: name = "Травень"; break;
        case 6: name = "Червень"; break;
        case 7: name = "Липень"; break;
        case 8: name = "Серпень"; break;
        case 9: name = "Вересень"; break;
        case 10: name = "Жовтень"; break;
        case 11: name = "Листопад"; break;
        case 12: name = "Грудень"; break;
        default: name = "Невірне число";
    }

    print("3. Місяць: " + name);
}

function task4(arr) {
    let sum = 0;

    for (let num of arr) {
        if (num % 2 === 0) {
            sum += num;
        }
    }

    return sum;
}

const task5 = (str) => {
    let vowels = "aeiouAEIOUаеєиіїоуюяАЕЄИІЇОУЮЯ";
    let count = 0;

    for (let char of str) {
        if (vowels.includes(char)) {
            count++;
        }
    }

    return count;
};

function task6(base, exponent) {
    let result = 1;

    for (let i = 0; i < exponent; i++) {
        result *= base;
    }

    return result;
}

function runAll() {
    document.getElementById("output").innerHTML = "";

    task1();
    task2();
    task3();

    let arr = [1, 2, 3, 4, 5, 6, 7, 8];
    print("4. Сума парних чисел: " + task4(arr));

    let text = prompt("Введіть рядок:");
    print("5. Кількість голосних: " + task5(text));

    let base = parseInt(prompt("Введіть base:"));
    let exp = parseInt(prompt("Введіть exponent:"));
    print("6. Результат: " + task6(base, exp));
}