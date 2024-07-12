const connection = require('./db');

const insertData = `
INSERT INTO User (UserID, RegistrationDate, UserName, Password, City) VALUES
(1, '2023-12-31', 'JohnDoe', 'password123', 'New York');

INSERT INTO \`Order\` (OrderID, UserID, OrderDate, TotalAmount) VALUES
(1, 1, '2024-01-15', 100),
(2, 1, '2024-02-15', 150),
(3, 1, '2024-03-15', 200),
(4, 1, '2024-04-15', 250),
(5, 1, '2024-05-15', 300),
(6, 1, '2024-06-15', 350),
(7, 1, '2024-07-15', 400),
(8, 1, '2024-08-15', 450),
(9, 1, '2024-09-15', 500),
(10, 1, '2024-10-15', 550),
(11, 1, '2024-11-15', 600),
(12, 1, '2024-12-15', 650);
`;

connection.query(insertData, (err, results) => {
  if (err) {
    console.error('Error inserting data:', err);
  } else {
    console.log('Data inserted successfully.');
  }
  connection.end();
});