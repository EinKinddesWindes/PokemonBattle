import cors from 'cors';
import express from 'express';
import pokemonRoutes from './routes/pokemonRoutes.js';

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.set('view engine', 'ejs');
app.use('/pokemon', pokemonRoutes);

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
