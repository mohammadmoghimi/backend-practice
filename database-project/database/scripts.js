const connection = require('./db');

const createTablesQueries = [
    `CREATE TABLE IF NOT EXISTS User (
        UserId INT PRIMARY KEY,
        RegistrationDate DATE,
        UserName VARCHAR(100),
        Password VARCHAR(100),
        City VARCHAR(100)
    )`,
    `CREATE TABLE IF NOT EXISTS Brand (
        BrandId INT PRIMARY KEY,
        BrandName VARCHAR(100)
    )`,
    `CREATE TABLE IF NOT EXISTS Product (
        ProductId INT PRIMARY KEY,
        ProductName VARCHAR(100),
        Description TEXT,
        Category VARCHAR(100),
        BrandId INT,
        CreatedDate DATE,
        FOREIGN KEY (BrandId) REFERENCES Brand(BrandId)
    )`,
    `CREATE TABLE IF NOT EXISTS Inventory (
        InventoryId INT PRIMARY KEY,
        ProductId INT,
        Quantity INT,
        Price DECIMAL(10, 2),
        FOREIGN KEY (ProductId) REFERENCES Product(ProductId)
    )`,
    `CREATE TABLE IF NOT EXISTS \`Order\` (
        OrderId INT PRIMARY KEY,
        UserId INT,
        OrderDate DATE,
        TotalAmount DECIMAL(10, 2),
        FOREIGN KEY (UserId) REFERENCES User(UserId)
    )`,
    `CREATE TABLE IF NOT EXISTS OrderDetails (
        OrderDetailId INT PRIMARY KEY,
        OrderId INT,
        ProductId INT,
        Quantity INT,
        Price DECIMAL(10, 2),
        FOREIGN KEY (OrderId) REFERENCES \`Order\`(OrderId),
        FOREIGN KEY (ProductId) REFERENCES Product(ProductId)
    )`,
    `CREATE TABLE IF NOT EXISTS Discount (
        DiscountId INT PRIMARY KEY,
        Description TEXT,
        DiscountPercentage DECIMAL(5, 2),
        StartDate DATE,
        EndDate DATE
    )`,
    `CREATE TABLE IF NOT EXISTS OrderDiscount (
        OrderDiscountId INT PRIMARY KEY,
        OrderId INT,
        DiscountId INT,
        DiscountAmount DECIMAL(10, 2),
        FOREIGN KEY (OrderId) REFERENCES \`Order\`(OrderId),
        FOREIGN KEY (DiscountId) REFERENCES Discount(DiscountId)
    )`,
    `CREATE TABLE IF NOT EXISTS Comments (
        CommentId INT PRIMARY KEY,
        Rating INT,
        CommentDate DATE,
        CommentText TEXT,
        UserId INT,
        ProductId INT,
        FOREIGN KEY (UserId) REFERENCES User(UserId),
        FOREIGN KEY (ProductId) REFERENCES Product(ProductId)
    )`,
    `CREATE TABLE IF NOT EXISTS CommentAgreement (
        CommentAgreementId INT PRIMARY KEY,
        UserId INT,
        CommentId INT,
        IsAgree BOOLEAN,
        FOREIGN KEY (UserId) REFERENCES User(UserId),
        FOREIGN KEY (CommentId) REFERENCES Comments(CommentId)
    )`
];

createTablesQueries.forEach(query => {
    connection.query(query, (err, results) => {
        if (err) {
            console.error('Error creating table:', err);
        } else {
            console.log('Table created successfully.');
        }
    });
});

connection.end();
