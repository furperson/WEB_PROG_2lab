// Заполнение таблицы данными
function populateTable(dataArray) {
    const resTableBody = document.getElementById('res-body');
    if (!resTableBody) return;

    resTableBody.innerHTML = '';

    dataArray.forEach((item, index) => {
        const row = resTableBody.insertRow();

        const cellIsHit = row.insertCell(0);
        const cellX = row.insertCell(1);
        const cellY = row.insertCell(2);
        const cellR = row.insertCell(3);
        const cellCurTime = row.insertCell(4);
        const cellWorkTime = row.insertCell(5);

        cellIsHit.innerHTML = item.hit ? 'Попадание' : 'Промах';
        cellX.innerHTML = item.x;
        cellY.innerHTML = item.y;
        cellR.innerHTML = item.r;
        cellCurTime.innerHTML = item.onTime;
        cellWorkTime.innerHTML = item.workTime;
    });
}


window.Table = {
    populate: populateTable
};