require('dotenv').config();

const express = require('express');
const bodyParser = require('body-parser');
const OpenAIApi = require('openai');
const cors = require('cors');
const app = express();
const PORT = 3001;

app.use(bodyParser.json());

const API_KEY = process.env.OPENAI_API_KEY;
const openai = new OpenAIApi({ key: API_KEY });

app.use(cors()); // Only allow requests from your frontend domain

app.post('/get-recommendations', async (req, res) => {
  try {
    console.log(req.body);
    const movies = req.body.movies;

    const movieDescriptions = movies.map((movie, index) => 
      `${movie.rating}/5 for ${movie.title}`
    ).join(', ');

    const message = `Given a rating of ${movieDescriptions}, give me 10 movie recommendations I might enjoy, please don't write anything else in your response, just list them out with a line break in between each one`;


    const chatCompletion = await openai.chat.completions.create({
      messages: [{ role: "user", content: message }],
      model: "gpt-3.5-turbo",
    });

    const responseContent = chatCompletion.choices && chatCompletion.choices[0]?.message?.content;
    if (responseContent) {
      res.json({ recommendations: responseContent });
    } else {
      res.status(500).json({ error: 'Failed to get recommendations' });
    }
  } catch (error) {
    console.error("Error making API call:", error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
