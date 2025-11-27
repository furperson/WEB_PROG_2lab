<%@ page contentType="text/html;charset=UTF-8" language="java" %>
<!DOCTYPE html>
<html lang="ru">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Результат проверки</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            margin: 40px;
            line-height: 1.6;
        }
        .container {
            max-width: 800px;
            margin: 0 auto;
            padding: 20px;
            border: 1px solid #ccc;
            border-radius: 8px;
            background-color: #f9f9f9;
        }
        table {
            width: 100%;
            border-collapse: collapse;
            margin: 20px 0;
        }
        table, th, td {
            border: 1px solid #ddd;
            padding: 12px;
            text-align: left;
        }
        th {
            background-color: #f2f2f2;
        }
        .result {
            font-size: 24px;
            font-weight: bold;
            color: ${hit ? 'green' : 'red'};
            margin: 20px 0;
        }
        .back-button {
            display: inline-block;
            padding: 10px 20px;
            background-color: #007bff;
            color: white;
            text-decoration: none;
            border-radius: 4px;
            margin-top: 20px;
        }
        .back-button:hover {
            background-color: #0056b3;
        }
    </style>
</head>
<body>
<div class="container">
    <h1>Результат проверки точки</h1>

    <h2>Введенные параметры:</h2>
    <table>
        <tr>
            <th>Параметр</th>
            <th>Значение</th>
        </tr>
        <tr>
            <td>X</td>
            <td>${x}</td>
        </tr>
        <tr>
            <td>Y</td>
            <td>${y}</td>
        </tr>
        <tr>
            <td>R</td>
            <td>${r}</td>
        </tr>
    </table>

    <h2>Результат вычисления:</h2>
    <div class="result">
        ${hit ? 'Попадание в область' : 'Промах мимо области'}
    </div>

    <p>Время выполнения: ${workTime} наносекунд</p>
    <p>Время запроса: ${onTime}</p>

    <a href="${pageContext.request.contextPath}/controller" class="back-button">Вернуться к форме</a>
</div>
</body>
</html>