import express from "express";
import bodyParser from "body-parser";
import fs from "fs";

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static("public"));

app.get('/', (req, res) => {
    res.render("index");
});

let cnt;

app.get('/write', (req, res) => {
    res.render("write", {cnt:req.body["numberOfTimesSubmit"]});
});

app.post('/submitWriting', (req, res) => {
    const writtenBlog = req.body["writingBlog"];
    const blogTitle = req.body["blgTitle"];
    const blogData = JSON.stringify({ title: blogTitle, content: writtenBlog }, null, 2);

    fs.writeFile(`blog.json`, blogData, 'utf-8', (err) => {
        if (err) {
            console.error("Error writing to file:", err);
            res.status(500).send("An error occurred while saving the blog.");
            return;
        }
        res.render("index", { blogTitle });
        console.log(cnt);
    });
});

app.get('/readBlog', (req, res) => {
    fs.readFile('blog.json', 'utf-8', (err, data) => {
        if (err) {
            console.error("Error reading file:", err);
            res.status(500).send("An error occurred while reading the blog.");
            return;
        }

        let blogContent;
        try {
            blogContent = JSON.parse(data);
        } catch (parseErr) {
            console.error("Error parsing JSON:", parseErr);
            res.status(500).send("An error occurred while parsing the blog content.");
            return;
        }

        res.render('read', { blog: blogContent });
    });
});




app.listen(port, () => {
    console.log(`Server running on port ${port}.`);
});
