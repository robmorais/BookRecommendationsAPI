require('dotenv').config();

const MOCK = true;

const express = require('express');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const { Configuration, OpenAIApi } = require("openai");
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);


// app.get('/', (req, res) => {
//    res.send('Hello, World!');
// });

app.post('/get-recommendations', async (req, res) => {
    const { bookType, genre, examples } = req.body;

    try {
        const prompt = `I am looking for ${bookType} book recommendations in the ${genre} genre. Some examples of books I've enjoyed are: ${examples}. Can you give me 6 books suggestions based on this information?I want you to return with the following pattern:
        <Num>. <Book Name>|<GoodReads ID>|<Amazon ASIN>\n
        Example:
        1.Ender's Game|375802|0812550706\n`;
        
        // const response = await openai.createCompletion({
        //     model: "gpt-3.5-turbo",
        //     prompt: prompt,
        //     max_tokens: 150,
        //     temperature: 0.7,
        //   });

        if (!MOCK) {
            console.log("1");
            const response = await openai.createChatCompletion({
                model: "gpt-3.5-turbo",
                messages: [{role: "user", content: prompt}],
            });
            console.log("2");
            console.log(response.data.choices[0].message.content);
            const recommendations = parseRecommendations(response.data.choices[0].message.content);
            console.log("4");
            res.json(recommendations);
        } else {
            const response = '1. The Hitchhikers Guide to the Galaxy by Douglas Adams |11|0345391802\n' +
            '2. The Martian by Andy Weir |858492|0553418025\n' +
            '3. Neuromancer by William Gibson |22328|0441569595\n' +
            '4. Snow Crash by Neal Stephenson |830|0553380958\n' +
            '5. Red Rising by Pierce Brown |15839976|0345539788\n' +
            '6. Leviathan Wakes by James S.A. Corey |8855321|1841499889'
            const recommendations = parseRecommendations(response);
            res.json(recommendations);
        }
        
    } catch (err) {
        console.log("err:");
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});


function parseRecommendations(responseText) {
    // Implement a parsing function based on the expected response format
    // For example, if you expect the response to be a comma-separated list of book titles, you can do:
    // const titles = responseText.split(',').map(title => title.trim());
    // You can then search for Goodreads URLs for each title and return an array of objects containing titles and URLs
    // return [];
    // Split the text into an array of lines
    console.log("3");
    const lines = responseText.split('\n').filter(line => line.trim() !== '');
    const books = lines.map(line => {
        const parts = line.split('|');
        const title = parts[0].replace(/^\d+\. /, '').trim();
        const goodreadsID = parts[1].trim();
        const amazonASIN = parts[2].trim();

        return { title, goodreadsID, amazonASIN };
    });
    console.log(books);
    return books;
  }


// Endpoint to serve the list of books from the database
app.get('/books', async (req, res) => {
    try {
        const { rows } = await db.query('SELECT * FROM books;');
        res.json(rows);
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Serve static files from the current directory
app.use(express.static('.'));

// Start the server
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});