const lamp = document.getElementById("lamp");

function toggleLamp() {
    lamp.classList.toggle("on");
    lamp.classList.toggle("off");
}

function setBrightness() {
    let value = prompt("Яскравість (0-100)");
    lamp.style.opacity = value / 100;
}

let current = 0;
const lights = ["red", "yellow", "green"];

function clearLights() {
    lights.forEach(id => {
        document.getElementById(id).classList.remove("active");
    });
}

function nextLight() {
    clearLights();
    document.getElementById(lights[current]).classList.add("active");
    current = (current + 1) % lights.length;
}

function startTraffic() {
    setInterval(nextLight, 3000);
}

function updateClock() {
    const now = new Date();
    document.getElementById("clock").innerText =
        now.toLocaleTimeString();
}
setInterval(updateClock, 1000);

let timerInterval;

function startCountdown() {
    clearInterval(timerInterval);

    const target = new Date(document.getElementById("targetDate").value);

    timerInterval = setInterval(() => {
        const now = new Date();
        const diff = target - now;

        if (diff <= 0) {
            document.getElementById("countdown").innerText = "Час вийшов!";
            clearInterval(timerInterval);
            return;
        }

        let sec = Math.floor(diff / 1000) % 60;
        let min = Math.floor(diff / 1000 / 60) % 60;
        let hrs = Math.floor(diff / 1000 / 60 / 60) % 24;
        let days = Math.floor(diff / 1000 / 60 / 60 / 24);

        document.getElementById("countdown").innerText =
            `${days}д ${hrs}г ${min}хв ${sec}с`;
    }, 1000);
}

function calcBirthday() {
    const input = document.getElementById("birthday").value;
    if (!input) return;

    const now = new Date();
    const birth = new Date(input);

    let next = new Date(now.getFullYear(), birth.getMonth(), birth.getDate());

    if (next < now) {
        next.setFullYear(now.getFullYear() + 1);
    }

    const diff = next - now;

    let days = Math.floor(diff / 1000 / 60 / 60 / 24);
    let hrs = Math.floor(diff / 1000 / 60 / 60) % 24;
    let min = Math.floor(diff / 1000 / 60) % 60;
    let sec = Math.floor(diff / 1000) % 60;

    document.getElementById("birthdayResult").innerText =
        `${days}д ${hrs}г ${min}хв ${sec}с`;
}



const products = new Map();
const categories = new Set();
const productMeta = new WeakMap();
const viewedProducts = new WeakSet();

let id = 0;

function addProduct() {
    const name = document.getElementById("name").value;
    const price = document.getElementById("price").value;
    const qty = document.getElementById("qty").value;
    const category = document.getElementById("category").value;

    const product = { name, price, qty, category };

    products.set(id++, product);
    categories.add(category);
    productMeta.set(product, { createdAt: new Date() });

    renderProducts();
    renderCategories();
}

function renderProducts() {
    const list = document.getElementById("products");
    list.innerHTML = "";

    products.forEach((product, key) => {
        const li = document.createElement("li");

        li.innerText =
            `${product.name} - ${product.price} грн (${product.qty})`;

        viewedProducts.add(product);

        if (viewedProducts.has(product)) {
            li.style.background = "#d4ffd4";
        }

        const meta = productMeta.get(product);
        if (meta) {
            const span = document.createElement("span");
            span.innerText = ` | ${meta.createdAt.toLocaleTimeString()}`;
            li.appendChild(span);
        }

        const delBtn = document.createElement("button");
        delBtn.innerText = " ❌";

        delBtn.onclick = () => {
            products.delete(key);
            renderProducts();
        };

        li.appendChild(delBtn);
        list.appendChild(li);
    });
}

function renderCategories() {
    const list = document.getElementById("categories");
    list.innerHTML = "";

    categories.forEach(cat => {
        const li = document.createElement("li");
        li.innerText = cat;
        list.appendChild(li);
    });
}