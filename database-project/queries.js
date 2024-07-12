const connection = require('./database/db');
//یست کاربرانی یک شهر خاص که حداقل یک سفارش در ماه داشته اند.
// const query1 = `
// SELECT
//     U.UserID,
//     U.Username,
//     U.City,
//     COUNT(DISTINCT DATE_FORMAT(O.OrderDate, '%Y-%m')) AS MonthsWithOrders
// FROM
//     User U
//     JOIN \`Order\` O ON U.UserID = O.UserID
// WHERE
//     U.City = 'New York'
//     AND O.OrderDate BETWEEN '2024-01-01' AND '2024-12-31'
// GROUP BY
//     U.UserID, U.Username, U.City
// HAVING
//     COUNT(DISTINCT DATE_FORMAT(O.OrderDate, '%Y-%m')) = 12
// ORDER BY
//     U.UserID
// `;
const query1 = `

SELECT
    U.City,
    DATE_FORMAT(O.OrderDate, '%Y-%m') AS Month,
    SUM((OD.Price - I.Price) * OD.Quantity) AS MonthlyProfit
FROM
    User U
    JOIN Order O ON U.UserID = O.UserID
    JOIN OrderDetails OD ON O.OrderID = OD.OrderID
    JOIN Inventory I ON OD.ProductID = I.ProductID
GROUP BY
    U.City,
    DATE_FORMAT(O.OrderDate, '%Y-%m')
ORDER BY
    U.City,
    Month`


connection.query(query1, (err, results) => {
    if (err) {
        console.error('Error executing query1:', err);
    } else {
        console.log('Results of query1:', results);
    }
    connection.end();
});
