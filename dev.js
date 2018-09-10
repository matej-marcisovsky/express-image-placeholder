/**
 * NPM modules.
 */
const Express = require('express');

/**
 * Private modules.
 */
const ImagePlaceholder = require('./index');

const PORT = 3000;

const app = Express();

app.use('/image/', ImagePlaceholder);

app.listen(PORT, () => console.log(`Dev server running on port ${PORT}!`))
