import cors from 'cors';
import express from 'express';
import fs from 'fs';
import http from 'http';
import multer from 'multer';
import { Server } from 'socket.io';

import * as service from './service';
import { fileSize } from './util';

const upload = multer({
  storage: multer.diskStorage({
    destination: `${__dirname}/../files`,
    filename: (_, file, callback) => {
      callback(null, file.originalname);
    }
  })
});

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: '*' } });

app.use(cors());

app.get('/files', async (_, res, next) => {
  try {
    res.send(await service.readFiles());
  } catch (err) {
    next(err);
  }
});

app.get('/files/:file', (req, res) => {
  res.download(`${__dirname}/../files/${req.params.file}`);
});

app.post('/files', upload.array('files'), (req, res) => {
  io.emit(
    'post',
    (req.files as Express.Multer.File[]).map(file => {
      return {
        name: file.originalname,
        size: fileSize(file.size)
      };
    })
  );

  res.sendStatus(204);
});

app.delete('/files/:file', async (req, res, next) => {
  try {
    await fs.promises.unlink(`${__dirname}/../files/${req.params.file}`);
    io.emit('delete', req.params.file);
    res.sendStatus(204);
  } catch (err) {
    next(err);
  }
});

io.on('connection', async socket => {
  try {
    socket.emit('files', await service.readFiles());
  } catch (err) {
    console.log(err);
    socket.emit('error', err);
  }
});

server.listen(4000, () => console.log('Listening on port 4000'));
