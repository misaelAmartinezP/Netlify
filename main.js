const express = requiere("express");
const fileUpload = requiere("express-fileupload");
const pdfParse = requiere("pdf-parse");

const app = express();

app.use("/", express.static("index.html"));
app.use(fileUpload());

app.post("/extract-text", (req, res) => {
    if (!req.files && !req.files.pdfFile) {
        res.status(400);
        res.end();
    }

    pdfParse(req.files.pdfFile).then(result => {
        res.send(result.text);
    })
})

app.listen(3000);