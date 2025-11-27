class Graph {
    constructor(canvasId) {
        this.canvas = document.getElementById(canvasId);
        if (!this.canvas) return;

        this.ctx = this.canvas.getContext('2d');
        this.width = this.canvas.width;
        this.height = this.canvas.height;
        this.center = this.width / 2;

        this.rButtons = document.querySelectorAll('input[name="R"]');

        this.currentR = parseFloat(document.querySelector('input[name="R"]:checked')?.value) || 3;

        this.initEventListeners();
        this.draw(this.currentR);
    }

    initEventListeners() {
        this.rButtons.forEach(radio => {
            radio.addEventListener('change', this.handleRchange.bind(this));
        });
        this.canvas.addEventListener('click', this.handleCanvasClick.bind(this));
    }

    handleRchange(event){
        if (event.target.checked) {
           this.draw(parseFloat(event.target.value))
        }
    }

    handleCanvasClick(event) {
        const rect = this.canvas.getBoundingClientRect();
        const scaleX = this.canvas.width / rect.width;
        const scaleY = this.canvas.height / rect.height;

        const x = (event.clientX - rect.left) * scaleX;
        const y = (event.clientY - rect.top) * scaleY;


        const maxR = 3;
        const scale = this.center * 0.8 / maxR;

        const graphX = (x - this.center) / scale;
        const graphY = -(y - this.center) / scale; // Инвертируем Y

        console.log(`Клик по координатам: X=${graphX.toFixed(2)}, Y=${graphY.toFixed(2)}`);


        const selectedRadio = document.querySelector('input[name="R"]:checked');
        if (!selectedRadio) {
            alert('Пожалуйста, сначала выберите значение R!');
            return;
        }


        this.fillAndSubmitForm(graphX, graphY);
    }

    fillAndSubmitForm(x, y) {
        const form = document.getElementById('coordinates-form');
        if (!form) return;

        // Заполняем поля формы
        document.getElementById('x-hidden').value = x.toFixed(2);
        document.getElementById('y-text').value = y.toFixed(2);


        const xButtons = document.querySelectorAll('#X-button-group button');
        const closestButton = Array.from(xButtons).reduce((closest, button) => {
            const btnValue = parseFloat(button.value);
            const currentDiff = Math.abs(btnValue - x);
            const closestDiff = closest ? Math.abs(parseFloat(closest.value) - x) : Infinity;
            return currentDiff < closestDiff ? button : closest;
        }, null);

        if (closestButton) {
            xButtons.forEach(btn => btn.classList.remove('active'));
            closestButton.classList.add('active');
            document.getElementById('selectedX').textContent = closestButton.value;
        }


        form.requestSubmit();
    }

    draw(R) {
        if (!this.ctx) return;

        this.currentR = R;
        const maxR = 3;
        const scale = this.center * 0.8 / maxR;
        const r_pixels = R * scale;
        const r_half_pixels = (R / 2) * scale;

        // Очистка холста
        this.ctx.clearRect(0, 0, this.width, this.height);

        // Настройки стилей для заштрихованных областей
        this.ctx.fillStyle = 'rgba(54, 162, 235, 0.6)';
        this.ctx.strokeStyle = 'rgba(54, 162, 235, 1)';
        this.ctx.lineWidth = 2;

        this.ctx.beginPath();
        this.ctx.rect(
            this.center - r_half_pixels,
            this.center - r_pixels,
            r_half_pixels,
            r_pixels
        );
        this.ctx.fill();
        this.ctx.stroke();

        this.ctx.beginPath();
        this.ctx.arc(
            this.center,
            this.center,
            r_half_pixels,
            -(Math.PI / 2),
            0
        );

        this.ctx.lineTo(this.center, this.center);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();


        this.ctx.beginPath();
        this.ctx.moveTo(this.center, this.center);
        this.ctx.lineTo(this.center + r_half_pixels, this.center);
        this.ctx.lineTo(this.center, this.center + r_half_pixels);
        this.ctx.closePath();
        this.ctx.fill();
        this.ctx.stroke();


        this.ctx.strokeStyle = '#333';
        this.ctx.fillStyle = '#333';
        this.ctx.lineWidth = 1;

        // Ось X
        this.ctx.beginPath();
        this.ctx.moveTo(0, this.center);
        this.ctx.lineTo(this.width, this.center);
        this.ctx.lineTo(this.width - 10, this.center - 5);
        this.ctx.moveTo(this.width, this.center);
        this.ctx.lineTo(this.width - 10, this.center + 5);
        this.ctx.stroke();
        this.ctx.fillText('x', this.width - 15, this.center - 10);

        // Ось Y
        this.ctx.beginPath();
        this.ctx.moveTo(this.center, this.height);
        this.ctx.lineTo(this.center, 0);
        this.ctx.lineTo(this.center - 5, 10);
        this.ctx.moveTo(this.center, 0);
        this.ctx.lineTo(this.center + 5, 10);
        this.ctx.stroke();
        this.ctx.fillText('y', this.center + 10, 15);

        // Метки на осях
        const labels = ['-R', '-R/2', 'R/2', 'R'];
        const positions = [-r_pixels, -r_half_pixels, r_half_pixels, r_pixels];

        this.ctx.font = '12px Segoe UI';

        // Метки по оси X
        labels.forEach((label, i) => {
            const pos = positions[i];
            this.ctx.beginPath();
            this.ctx.moveTo(this.center + pos, this.center - 5);
            this.ctx.lineTo(this.center + pos, this.center + 5);
            this.ctx.stroke();
            this.ctx.fillText(label, this.center + pos - 10, this.center + 20);
        });

        // Метки по оси Y
        labels.forEach((label, i) => {
            const pos = positions[i];
            this.ctx.beginPath();
            this.ctx.moveTo(this.center - 5, this.center - pos);
            this.ctx.lineTo(this.center + 5, this.center - pos);
            this.ctx.stroke();
            this.ctx.fillText(label, this.center + 10, this.center - pos + 5);
        });

        // Отрисовка точек из истории
        this.drawHistoryPoints();
    }

    drawHistoryPoints() {
        if (!this.ctx) return;

        const hiddenPoints = document.querySelectorAll('.hidden-point');
        if (hiddenPoints.length === 0) return;

        const maxR = 3;
        const scale = this.center * 0.8 / maxR;

        hiddenPoints.forEach(pointEl => {
            const x = parseFloat(pointEl.dataset.x);
            const y = parseFloat(pointEl.dataset.y);
            const r = parseFloat(pointEl.dataset.r);
            const hit = pointEl.dataset.hit === 'true';

            if (isNaN(x) || isNaN(y) || isNaN(r)) return;


            const x_pixel = this.center + x * scale;
            const y_pixel = this.center - y * scale;


            const color = hit ? '#00ff00' : '#ff0000';

            // Рисуем точку
            this.ctx.beginPath();
            this.ctx.arc(x_pixel, y_pixel, 4, 0, Math.PI * 2);
            this.ctx.fillStyle = color;
            this.ctx.fill();
            this.ctx.strokeStyle = '#000';
            this.ctx.stroke();

            // Добавляем подпись с номером точки
            this.ctx.fillStyle = '#000';
            this.ctx.font = '10px Arial';
            this.ctx.fillText(`#${pointEl.dataset.id}`, x_pixel + 6, y_pixel - 6);
        });
    }
}


document.addEventListener('DOMContentLoaded', function() {
    window.graph = new Graph('graph-canvas');
});

window.Graph = Graph;