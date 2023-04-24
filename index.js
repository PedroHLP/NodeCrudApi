const express = require('express');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const cors = require('cors'); 

const app = express();
app.use(cors()); // Adicione esta linha
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

mongoose.connect('mongodb+srv://suramu:123@bielzera.1suha15.mongodb.net/Teste?retryWrites=true&w=majority', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

let Jogos;
try {
  Jogos = mongoose.model('jogos');
} catch {
  const JogosSchema = new mongoose.Schema({
    nome: String,
  });

  Jogos = mongoose.model('jogos', JogosSchema);
}

app.get('/jogos', async (req, res) => {
  try {
    const jogos = await Jogos.find({});
    res.json(jogos);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao buscar jogos na base de dados');
  }
});

app.post('/jogos', async (req, res) => {
  const { nome } = req.body;
  const jogo = new Jogos({ nome });

  try {
    await jogo.save();
    res.send(`Jogo ${nome} adicionado com sucesso`);
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao adicionar jogo na base de dados');
  }
});

// Rota DELETE
app.delete('/jogos/:id', async (req, res) => {
  const { id } = req.params;
  
  try {
    const jogo = await Jogos.findByIdAndDelete(id);
    if (jogo) {
      res.send(`Jogo ${jogo.nome} deletado com sucesso`);
    } else {
      res.status(404).send('Jogo não encontrado');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao deletar jogo da base de dados');
  }
});

// Rota PUT
app.put('/jogos/:id', async (req, res) => {
  const { id } = req.params;
  const { nome } = req.body;
  
  try {
    const jogo = await Jogos.findByIdAndUpdate(id, { nome }, { new: true });
    if (jogo) {
      res.send(`Jogo ${jogo.nome} atualizado com sucesso`);
    } else {
      res.status(404).send('Jogo não encontrado');
    }
  } catch (err) {
    console.error(err);
    res.status(500).send('Erro ao atualizar jogo na base de dados');
  }
});


app.listen(3000, () => console.log('Servidor rodando na porta 3000!'));
