const express = requiere("express");
const fileUpload = requiere("express-fileupload");
const pdfParse = requiere("pdf-parse");

const app = express();

app.use("/", express.static("index.html"));
app.use(fileUpload());
app.listen(3000);