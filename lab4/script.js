function task1() {
    let fruits = ["яблуко", "банан", "груша", "апельсин"];

    fruits.pop();
    console.log("1. Після видалення останнього:", fruits);

    fruits.unshift("ананас");
    console.log("1. Після додавання ананаса:", fruits);

    fruits.sort().reverse();
    console.log("1. В зворотному порядку:", fruits);

    let index = fruits.indexOf("яблуко");
    console.log("1. Індекс яблука:", index);
}


function task2() {
    let colors = ["червоний", "синій", "зелений", "темно-синій", "жовтий"];

    let longest = colors.reduce((a, b) => a.length > b.length ? a : b);  
    let shortest = colors.reduce((a, b) => a.length < b.length ? a : b);

    console.log("2. Найдовший:", longest);
    console.log("2. Найкоротший:", shortest);

    let filtered = colors.filter(c => c === "синій");
    console.log("2. Тільки синій:", filtered);

    let joined = colors.join(", ");
    console.log("2. Об'єднаний рядок:", joined);
}

function task3() {
    let workers = [
        {name: "Іван", age: 25, position: "розробник"},
        {name: "Олег", age: 30, position: "дизайнер"},
        {name: "Анна", age: 22, position: "розробник"}
    ];

    workers.sort((a, b) => a.name.localeCompare(b.name));
    console.log("3. Відсортовано:", workers);

    let devs = workers.filter(w => w.position === "розробник");
    console.log("3. Розробники:", devs);

    workers = workers.filter(w => w.age > 28);
    console.log("3. Після видалення:", workers);

    workers.push({name: "Марія", age: 28, position: "тестер"});
    console.log("3. Після додавання:", workers);
}

function task4() {
    let students = [
        {name: "Олексій", age: 20, course: 2},
        {name: "Ірина", age: 22, course: 3},
        {name: "Максим", age: 19, course: 1}
    ];

    students = students.filter(s => s.name !== "Олексій");
    console.log("4. Після видалення:", students);

    students.push({name: "Олена", age: 21, course: 2});
    console.log("4. Після додавання:", students);

    students.sort((a, b) => b.age - a.age); 
    console.log("4. Відсортовано:", students);

    let thirdCourse = students.find(s => s.course === 3);
    console.log("4. Студент 3 курсу:", thirdCourse);
}


function task5() {
    let numbers = [1, 2, 3, 4, 5];

    let squared = numbers.map(n => n * n);
    console.log("5. Квадрати:", squared);

    let even = numbers.filter(n => n % 2 === 0);
    console.log("5. Парні:", even);

    let sum = numbers.reduce((acc, n) => acc + n, 0); 
    console.log("5. Сума:", sum);

    let newNumbers = [6, 7, 8, 9, 10];
    numbers = numbers.concat(newNumbers);
    console.log("5. Після додавання:", numbers);

    numbers.splice(0, 3);
    console.log("5. Після видалення 3 елементів:", numbers);
}


function libraryManagement() {

    let books = [
        {title: "Книга1", author: "Автор1", genre: "Фантастика", pages: 300, isAvailable: true},
        {title: "Книга2", author: "Автор2", genre: "Драма", pages: 200, isAvailable: true}
    ];

    function addBook(title, author, genre, pages) {
        books.push({title, author, genre, pages, isAvailable: true});
    }

    function removeBook(title) {
        books = books.filter(b => b.title !== title); 
    }

    function findBooksByAuthor(author) {
        return books.filter(b => b.author === author);
    }

    function toggleBookAvailability(title, isBorrowed) {
        let book = books.find(b => b.title === title);
        if (book) {
            book.isAvailable = !isBorrowed;
        }
    }

    function sortBooksByPages() {
        books.sort((a, b) => a.pages - b.pages); 
    }

    function getBooksStatistics() {
        let total = books.length;
        let available = books.filter(b => b.isAvailable).length; 
        let borrowed = total - available;
        let avgPages = books.reduce((sum, b) => sum + b.pages, 0) / total;

        return {total, available, borrowed, avgPages};
    }

    addBook("Книга3", "Автор1", "Пригоди", 150);
    removeBook("Книга2");
    toggleBookAvailability("Книга1", true);
    sortBooksByPages();

    console.log("6. Книги:", books);
    console.log("6. Книги автора Автор1:", findBooksByAuthor("Автор1"));
    console.log("6. Статистика:", getBooksStatistics());
}

function task7() {
    let student = {
        name: "Іван",
        age: 20,
        course: 2
    };

    student.subjects = ["Математика", "Програмування"];
    delete student.age;

    console.log("7. Оновлений студент:", student);
}