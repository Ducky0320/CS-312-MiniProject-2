const express = require('express');
const axios = require('axios');
const app = express();

// Set EJS as the templating engine
app.set('view engine', 'ejs');

// Middleware to serve static files like CSS
app.use(express.static('public'));

// For parsing form data
app.use(express.urlencoded({ extended: true }));

// Home route that renders the form
app.get('/', (req, res) => {
  res.render('index');
});

// Route to handle joke fetching and rendering
app.post('/joke', async (req, res) => {
  const userName = req.body.name; // Get the user's name from the form
  try {
    const response = await axios.get('https://v2.jokeapi.dev/joke/Any');
    const jokeData = response.data;

    // Prepare the joke text based on API response
    let joke;
    if (jokeData.type === 'single') {
      joke = jokeData.joke;
    } else {
      joke = `${jokeData.setup} - ${jokeData.delivery}`;
    }

    // Insert user's name into the joke
    const personalizedJoke = joke.replace("I", userName);

    // Render the joke page with the joke data
    res.render('joke', { name: userName, joke: personalizedJoke });
  } catch (error) {
    console.error(error);
    res.render('joke', { name: userName, joke: 'Oops! Something went wrong.' });
  }
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
