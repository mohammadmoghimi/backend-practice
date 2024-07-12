const express = require("express");
const cors = require("cors");

require("./database/db");

const app = express();

app.use(cors());

app.use(express.json());



const PORT = 3000 ;
app.listen(PORT, () => {
    console.log(`Server is listening on port ${PORT}`);
  });   