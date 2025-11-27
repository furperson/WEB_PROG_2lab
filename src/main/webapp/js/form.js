class FormDataHandler {
    constructor() {
        this.form = document.getElementById('coordinates-form');
        this.clearForm = document.getElementById('clear-form');
        this.xButtons = document.querySelectorAll('#X-button-group button');
        this.yInput = document.getElementById('y-text');
        this.yError = document.getElementById('y-error');
        this.rRadioButtons = document.querySelectorAll('input[name="R"]');
        this.rError = document.getElementById('r-error');
        this.selectedXSpan = document.getElementById('selectedX');
        this.xHiddenInput = document.getElementById('x-hidden');

        this.selectedX = 0; //нач значение X
        this.selectedR = 3; //нач значение R
        this.lastValidYValue = '';

        this.initEventListeners();
        this.updateSelectedXDisplay();
        this.initSelectedRButton();
    }

    initEventListeners() {
        if (!this.form) return;

        // Валидация поля Y при вводе
        this.yInput.addEventListener('input', this.handleYInput.bind(this));

        // Обработка выбора X через кнопки
        this.xButtons.forEach(button => {
            button.addEventListener('click', this.handleXSelection.bind(this));
        });

        // Обработка выбора R через радиокнопки
        this.rRadioButtons.forEach(radio => {
            radio.addEventListener('change', this.handleRSelection.bind(this));
        });

        // Обработка отправки основной формы
        this.form.addEventListener('submit', this.handleSubmit.bind(this));

        // Обработка отправки формы очистки
        if (this.clearForm) {
            this.clearForm.addEventListener('submit', this.handleClearSubmit.bind(this));
        }
    }

    initSelectedRButton() {
        const selectedRadio = document.querySelector('input[name="R"][value="3"]');
        if (selectedRadio) {
            selectedRadio.checked = true;
            this.selectedR = 3;
        }
    }

    handleYInput() {
        const currentValue = this.yInput.value;
        if (isNaN(Number(currentValue)) && currentValue !== '' && currentValue !== '-') {
            this.yInput.value = this.lastValidYValue;
        } else {
            this.lastValidYValue = currentValue;
        }
    }

    handleXSelection(event) {
        // Сброс активного состояния у всех кнопок
        this.xButtons.forEach(btn => btn.classList.remove('active'));

        // Установка активного состояния для нажатой кнопки
        event.target.classList.add('active');

        // Сохранение выбранного значения
        this.selectedX = parseFloat(event.target.value);

        // Обновление скрытого поля
        this.xHiddenInput.value = this.selectedX;

        // Обновление отображения выбранного X
        this.updateSelectedXDisplay();
    }

    updateSelectedXDisplay() {
        if (this.selectedXSpan) {
            this.selectedXSpan.textContent = this.selectedX;
        }
    }

    handleRSelection(event) {
        if (event.target.checked) {
            this.selectedR = parseFloat(event.target.value);
            this.rError.textContent = '';
        }
    }

    handleSubmit(event) {
        if (!this.validateForm()) {
            event.preventDefault();
            return;
        }
    }

    handleClearSubmit(event) {
        if (!confirm('Вы уверены, что хотите очистить всю историю результатов?')) {
            event.preventDefault();
        }
    }

    validateForm() {
        let isValid = true;
        this.yError.textContent = '';
        this.rError.textContent = '';


        const yValue = this.yInput.value.trim().replace(',', '.');
        if (yValue === '') {
            this.yError.textContent = 'Поле Y не может быть пустым.';
            isValid = false;
        } else if (isNaN(yValue)) {
            this.yError.textContent = 'Значение Y должно быть числом.';
            isValid = false;
        }

        const selectedRadio = document.querySelector('input[name="R"]:checked');
        if (!selectedRadio) {
            this.rError.textContent = 'Необходимо выбрать значение R.';
            isValid = false;
        } else {
            this.selectedR = parseFloat(selectedRadio.value);
        }

        return isValid;
    }
}

document.addEventListener('DOMContentLoaded', function() {
    window.formHandler = new FormDataHandler();
});