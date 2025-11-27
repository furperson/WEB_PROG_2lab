<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<%@ taglib prefix="c" uri="jakarta.tags.core" %>
<%@ page import="beans.HistoryBean" %>
<%
    String action = request.getParameter("action");
    if ("clear".equals(action)) {
        if (session != null) {
            HistoryBean historyBean = (HistoryBean) session.getAttribute("historyBean");
            if (historyBean != null) {
                historyBean.clearHistory();
            }
        }
        response.sendRedirect(request.getContextPath() + "/controller");
        return;
    }
%>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Веб-лабораторная работа №1</title>
    <link rel="stylesheet" href="${pageContext.request.contextPath}/css/style.css">
</head>
<body>

<div class="container">
    <table id="main-table">
        <tr>
            <td style="width: 50%;">
                <div id="input-table-container">
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
                                <form id="coordinates-form" action="${pageContext.request.contextPath}/controller"  method="get">
                                    <input type="hidden" name="action" value="check">
                                    <div class="form-group">
                                        <div id="X-button-group">
                                            <button type="button" value="-4">-4</button>
                                            <button type="button" value="-3">-3</button>
                                            <button type="button" value="-2">-2</button>
                                            <button type="button" value="-1">-1</button>
                                            <button type="button" value="0" class="active">0</button>
                                            <button type="button" value="1">1</button>
                                            <button type="button" value="2">2</button>
                                            <button type="button" value="3">3</button>
                                            <button type="button" value="4">4</button>
                                        </div>
                                        <div id="selection-X">
                                            Выбранное значение X : <span id="selectedX">0</span>
                                        </div>
                                    </div>
                                    <div class="form-group">
                                        <label for="y-text">Изменение Y (-5 ... 5)</label>
                                        <input type="text" id="y-text" name="Y" placeholder="Введите число от -5 до 5">
                                        <div id="y-error" class="error-message"></div>
                                    </div>
                                    <div class="form-group">
                                        <label>Изменение R</label>
                                        <div class="r-buttons">
                                            <input type="radio" id="R-1" name="R" value="1" /> <label for="R-1">1</label>
                                            <input type="radio" id="R-1.5" name="R" value="1.5" /> <label for="R-1.5">1.5</label>
                                            <input type="radio" id="R-2" name="R" value="2" /> <label for="R-2">2</label>
                                            <input type="radio" id="R-2.5" name="R" value="2.5" /> <label for="R-2.5">2.5</label>
                                            <input type="radio" id="R-3" name="R" value="3" checked /> <label for="R-3">3</label>
                                        </div>
                                        <div id="r-error" class="error-message"></div>
                                    </div>
                                    <input type="hidden" id="x-hidden" name="X" value="0">
                                    <input type="submit" value="Проверить">
                                </form>
                                <form id="clear-form" action="${pageContext.request.contextPath}/controller"  method="get" style="margin-top: 10px;">
                                    <input type="hidden" name="action" value="clear">
                                    <input type="submit" value="Очистить историю" class="clear-button">
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
                        <c:if test="${not empty historyBean.results}">
                            <c:forEach var="result" items="${historyBean.results}">
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

<!-- Скрытые поля для хранения истории точек из bean компонента -->
<c:if test="${not empty historyBean.results}">
    <c:forEach var="result" items="${historyBean.results}" varStatus="status">
        <div class="hidden-point"
             data-x="${result.x}"
             data-y="${result.y}"
             data-r="${result.r}"
             data-hit="${result.hit}"
             data-id="${status.index}"
             style="display: none;"></div>
    </c:forEach>
</c:if>

<script>
    const contextPath = "${pageContext.request.contextPath}";
</script>
<script src="${pageContext.request.contextPath}/js/table.js"></script>
<script src="${pageContext.request.contextPath}/js/graph.js"></script>
<script src="${pageContext.request.contextPath}/js/form.js"></script>

</body>
</html>