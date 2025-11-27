
document.addEventListener('DOMContentLoaded', function() {
    console.log('Приложение инициализировано');

    console.log('Все компоненты успешно загружены');
});

// Глобальный объект приложения
window.app = {
    contextPath: contextPath,
    init: function() {
        console.log('Инициализация приложения...');
    }
};

window.app = {
    contextPath: contextPath,
};