
const SERVICE_UUID = '9a8ca9ef-e43f-4157-9fee-c37a3d7dc12d';
const CHARACTERISTIC_UUID = 'c8f25217-425a-4285-8e75-6d92ce9f656a';
let fireCharact;


function populateTable(dataArray) {

    const resTableBody = document.getElementById('res-body');


    resTableBody.innerHTML = '';

    dataArray.forEach(item => {

        const row = resTableBody.insertRow();


        const cellIsHit = row.insertCell(0);
        const cellX = row.insertCell(1);
        const cellY = row.insertCell(2);
        const cellR = row.insertCell(3);
        const cellCurTime = row.insertCell(4);
        const cellWorkTime = row.insertCell(5);



        cellIsHit.innerHTML = item.isHit ? 'Попадание' : 'Промах';
        cellX.innerHTML = item.X;
        cellY.innerHTML = item.Y;
        cellR.innerHTML = item.R;
        cellCurTime.innerHTML = item.OnTime;
        cellWorkTime.innerHTML = item.WorkTime;
    });
}

// Подключение ble устройства и сохранение его id
async function connect(){
    try {
        const device = await navigator.bluetooth.requestDevice({
            filters: [{ services: [SERVICE_UUID] }]
        });

        localStorage.setItem('bleDeviceId', device.id);


        const server = await device.gatt.connect();
        console.log('Устройство подключено!');

        console.log('Получение сервиса ');
        const service = await server.getPrimaryService(SERVICE_UUID);


        console.log('Получение характеристики ');
        fireCharact = await service.getCharacteristic(CHARACTERISTIC_UUID);


    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// если ранее подключалось устройство - его подключение , иначе  ничего не делает
async function reconnect() {
    try {
        const deviceId = localStorage.getItem('bleDeviceId');
        if (!deviceId) {
            console.log('Нет сохраненных устройств');
            return;
        }

        const permittedDevices = await navigator.bluetooth.getDevices();

        const device = permittedDevices.find(d => d.id === deviceId);

        if (!device) {
            console.log('Ранее разрешенное устройство не найдено');
            return;
        }

        const server = await device.gatt.connect();
        console.log('Устройство переподключено!');

        console.log('Получение сервиса ');
        const service = await server.getPrimaryService(SERVICE_UUID);


        console.log('Получение характеристики ');
        fireCharact = await service.getCharacteristic(CHARACTERISTIC_UUID);

    } catch (error) {
        console.error('Ошибка:', error);
    }
}

// Отправка данных на дисплей
async function fireDisplay(text) {
    if (!fireCharact) {
        console.error('Характеристика не найдена. Сначала подключитесь.');
        return;
    }

    try {
        const encoder = new TextEncoder();
        const data = encoder.encode(text);

        console.log(`Отправка данных: ${text}`);
        await fireCharact.writeValueWithResponse(data);

        console.log('Данные успешно отправлены ');

    } catch (error) {
        console.error('Ошибка при записи в характеристику:', error);
    }
}

window.onload = reconnect;

async function actualDataGet() {
    try {
        // Измененный URL для запроса
        const response = await fetch(`${contextPath}/controller?action=actual`);
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        const posts = await response.json();
        console.log('Полученные данные ::', posts);
        populateTable(posts);
    } catch (error) {
        console.error('Не удалось получить данные:', error);
    }
}

async function clearDataGet() {
    try {
        // Измененный URL для запроса
        const response = await fetch(`${contextPath}/controller?action=clear`);
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        const posts = await response.json();
        console.log('Данные после очистки:', posts);
        populateTable(posts);
    } catch (error) {
        console.error('Не удалось очистить данные:', error);
    }
}

document.getElementById("clear-button").addEventListener("click", function () {
    clearDataGet();
});

document.getElementById("connect-ble-button").addEventListener("click", connect);

document.addEventListener('DOMContentLoaded', function() {

    const canvas = document.getElementById('graph-canvas');
    const ctx = canvas.getContext('2d');

    const img1 = new Image();
    img1.src = "/images/gol.jpg"
    const img2 = new Image();
    img2.src = "/images/ehh.jpg"

    async function createPost(postData) {
        try {
            const params = new URLSearchParams(postData);
            // Измененный URL для запроса
            let url = new URL(`${contextPath}/controller`, window.location.origin);
            url.search = params.toString();
            // Добавляем action=fire
            url.searchParams.append('action', 'fire');

            const response = await fetch(url);

            if (!response.ok) {
                throw new Error(`Ошибка HTTP: ${response.status}`);
            }

            const newPost = await response.json();
            console.log(newPost);

            // Логика обновления таблицы и картинки
            await actualDataGet(); // Получаем всю историю, включая новый результат

            if (newPost.hit) {
                fireDisplay('yes');
                ctx.drawImage(img1, 0, 0, 300, 300);
            } else {
                fireDisplay('no');
                ctx.drawImage(img2, 0, 0, 300, 300);
            }

        } catch (error) {
            console.error('Ошибка:', error);
        }
    }


    const form = document.getElementById('coordinates-form');
    const xInput = document.getElementById('x-select');
    const yInput = document.getElementById('y-text');
    const yError = document.getElementById('y-error');
    const rButtons = document.querySelectorAll('.r-buttons input[type="button"]');
    const rHiddenInput = document.getElementById('r-hidden');
    const rError = document.getElementById('r-error');

    let lastValidValue = '';

    yInput.addEventListener('input', function() {
        const currentValue = this.value;
        if (isNaN(Number(currentValue)) && currentValue !== '' && currentValue !== '-') {
            this.value = lastValidValue;
        } else {
            lastValidValue = currentValue;
        }
    });

    let selectedR = 3;

    actualDataGet();


    function drawGraph(R) {
        const width = canvas.width;
        const height = canvas.height;
        const center = width / 2;
        const scale = center * 0.8 / 5;
        const r_pixels = R * scale;


        ctx.clearRect(0, 0, width, height);


        ctx.fillStyle = 'rgba(54, 162, 235, 0.6)';
        ctx.strokeStyle = 'rgba(54, 162, 235, 1)';
        ctx.lineWidth = 2;


        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.arc(center, center, r_pixels, Math.PI, 1.5 * Math.PI);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();


        ctx.beginPath();
        ctx.rect(center - r_pixels, center, r_pixels, r_pixels / 2);
        ctx.fill();
        ctx.stroke();


        ctx.beginPath();
        ctx.moveTo(center, center);
        ctx.lineTo(center + r_pixels, center);
        ctx.lineTo(center, center + r_pixels);
        ctx.closePath();
        ctx.fill();
        ctx.stroke();


        ctx.strokeStyle = '#333';
        ctx.fillStyle = '#333';
        ctx.lineWidth = 1;


        ctx.beginPath();
        ctx.moveTo(0, center);
        ctx.lineTo(width, center);
        ctx.lineTo(width - 10, center - 5);
        ctx.moveTo(width, center);
        ctx.lineTo(width - 10, center + 5);
        ctx.stroke();
        ctx.fillText('x', width - 15, center - 10);


        ctx.beginPath();
        ctx.moveTo(center, height);
        ctx.lineTo(center, 0);
        ctx.lineTo(center - 5, 10);
        ctx.moveTo(center, 0);
        ctx.lineTo(center + 5, 10);
        ctx.stroke();
        ctx.fillText('y', center + 10, 15);


        const labels = ['-R', '-R/2', 'R/2', 'R'];
        const positions = [-r_pixels, -r_pixels / 2, r_pixels / 2, r_pixels];

        ctx.font = '12px Segoe UI';
        labels.forEach((label, i) => {
            const pos = positions[i];

            ctx.beginPath();
            ctx.moveTo(center + pos, center - 5);
            ctx.lineTo(center + pos, center + 5);
            ctx.stroke();
            ctx.fillText(label, center + pos - 10, center + 20);


            ctx.beginPath();
            ctx.moveTo(center - 5, center - pos);
            ctx.lineTo(center + 5, center - pos);
            ctx.stroke();
            ctx.fillText(label, center + 10, center - pos + 5);
        });
    }


    rButtons.forEach(button => {
        button.addEventListener('click', function() {
            rButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');
            selectedR = this.value;
            rHiddenInput.value = selectedR;
            rError.textContent = '';
            drawGraph(selectedR);
        });
    });

    form.addEventListener('submit', function(event) {
        let isValid = true;
        yError.textContent = '';
        rError.textContent = '';

        const yValue = yInput.value.trim().replace(',', '.');
        if (yValue === '') {
            yError.textContent = 'Поле Y не может быть пустым.';
            isValid = false;
        } else if (isNaN(yValue)) {
            yError.textContent = 'Значение Y должно быть числом.';
            isValid = false;
        } else {
            const yNum = parseFloat(yValue);
            if (yNum <= -3 || yNum >= 5) {
                yError.textContent = 'Y должен быть в диапазоне (-3 ... 5).';
                isValid = false;
            }
        }


        if (!selectedR) {
            rError.textContent = 'Необходимо выбрать значение R.';
            isValid = false;
        }

        if (!isValid) {
            event.preventDefault();
        }
        else {
            const newData = {
                X: xInput.value ,
                Y: parseFloat(yValue) ,
                R: selectedR
            }
            createPost(newData)
            event.preventDefault();

        }
    });

    drawGraph(selectedR);
});