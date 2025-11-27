<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Веб-лабораторная работа №1</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>с
<body>

<div class="container">
    <table id="main-table">
        <tr>
            <td style="width: 50%;">
                <div id="input-table-container">
                    <div>
                        <input type="button" id="connect-ble-button" value="ПОДКЛЮЧИТЬ BLE ДИСПЛЕЙ">
                    </div>
                    <div id="header">
                        <div>ФИО: Сыщиков Никита Сергеевич</div>
                        <div>Группа: P3231</div>
                        <div>Вариант: 409658</div>
                    </div>
                    <table style="width: 100%;">
                        <tr>
                            <td style="width: 50%; vertical-align: middle;">
                                <canvas id="graph-canvas" width="300" height="300"></canvas>
                            </td>
                            <td style="width: 50%; vertical-align: middle;">
                                <form id="coordinates-form">
                                    <div class="form-group">
                                        <label for="x-select">Изменение X</label>
                                        <select id="x-select" name="x">
                                            <option value="-4">-4</option>
                                            <option value="-3">-3</option>
                                            <option value="-2">-2</option>
                                            <option value="-1">-1</option>
                                            <option value="0" selected>0</option>
                                            <option value="1">1</option>
                                            <option value="2">2</option>
                                            <option value="3">3</option>
                                            <option value="4">4</option>
                                        </select>
                                    </div>
                                    <div class="form-group">
                                        <label for="y-text">Изменение Y (-3 ... 5)</label>
                                        <input type="text" id="y-text" name="y" placeholder="Введите число от -3 до 5">
                                        <div id="y-error" class="error-message"></div>
                                    </div>
                                    <div class="form-group">
                                        <label>Изменение R</label>
                                        <div class="r-buttons">
                                            <input type="button" value="1">
                                            <input type="button" value="2">
                                            <input type="button" class="active" value="3">
                                            <input type="button" value="4">
                                            <input type="button" value="5">
                                        </div>
                                        <input type="hidden" id="r-hidden" name="r" value="3">
                                        <div id="r-error" class="error-message"></div>
                                    </div>
                                    <input type="submit" value="Проверить">
                                    <input type="button" id="clear-button" value="Очистить">
                                </form>
                            </td>
                        </tr>
                    </table>
                </div>
            </td>

            <td style="width: 50%;">
                <div id="results-container">
                    <h2>Таблица результатов</h2>
                    <table id="res-table">
                        <thead>
                        <tr>
                            <th>Результат</th>
                            <th>X</th>
                            <th>Y</th>
                            <th>R</th>
                            <th>Время</th>
                            <th>Время работы (наносек)</th>
                        </tr>
                        </thead>
                        <tbody id="res-body">
                        <c:if test="${not empty sessionScope.history.results}">
                            <c:forEach var="result" items="${sessionScope.history.results}">
                                <tr>
                                    <td>${result.hit ? 'Попадание' : 'Промах'}</td>
                                    <td>${result.x}</td>
                                    <td>${result.y}</td>
                                    <td>${result.r}</td>
                                    <td>${result.onTime}</td>
                                    <td>${result.workTime}</td>
                                </tr>
                            </c:forEach>
                        </c:if>
                        </tbody>
                    </table>
                </div>
            </td>
        </tr>
    </table>
</div>

<script>
    const contextPath = "${pageContext.request.contextPath}";
</script>
<script src="${pageContext.request.contextPath}/js/ble.js"></script>
<script src="${pageContext.request.contextPath}/js/table.js"></script>
<script src="${pageContext.request.contextPath}/js/graph.js"></script>
<script src="${pageContext.request.contextPath}/js/form.js"></script>
<script src="${pageContext.request.contextPath}/js/main.js"></script>

</body>
</html>