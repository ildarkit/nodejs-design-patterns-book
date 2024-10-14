import { createServer } from "net";
import { fork } from "child_process";
import { join } from "path";
import { createWriteStream } from "fs";
import { mkdirp } from "mkdirp";
import Queue from 'yocto-queue';
import { MSG_FORMAT, MSG_SPLITTER } from "./message.js";

const SERVER_STORE_PATH = process.argv[2];

function createFileStore(storePath = SERVER_STORE_PATH) {
  mkdirp(storePath)
    .then((make) => {
      let msg = "Server file store already created";
      if (make)
        msg = "Server file store created";
      console.log(msg);
    });
}

function getFileStorePath(file, path = SERVER_STORE_PATH) {
  return join(path, file);
}

function getChannels(channels) {
  return channels.map(
    channel => createWriteStream(getFileStorePath(channel))
  );
}

function getChannelID(channelCount, source, done, saveToBuf) {
  for (let i = 0; i < channelCount; i++) {
    let chunk = source.read(MSG_FORMAT.length);
    if (chunk === null) return;
    if (chunk.toString() != MSG_FORMAT) return saveToBuf(chunk);
    let msg = "";
    while ((msg.search(MSG_FORMAT) === -1) && (chunk = source.read(1)) !== null) {
      msg = msg + chunk.toString();
    }
    const payload = msg.split(MSG_FORMAT)[0];
    const [channelID, file] = payload.split(MSG_SPLITTER);
    done(channelID, file);
  }
}

function sendDataChannels(channels, source) {
  let chunk;
  while ((chunk = source.read(MSG_FORMAT.length)) !== null) {
    const channel = chunk.readUInt8(0);
    const dataLength = chunk.readUInt32BE(1);
    const data = source.read(dataLength);
    channels[channel].write(data);
  }
}

function sendBufChannels(channels, source, buf) {
  let chunk;
  while (buf.size !== 0) {
    chunk = buf.dequeue();
    const channel = chunk.readUInt8(0);
    console.log(`channel buf = ${channel}`);
    const dataLength = chunk.readUInt32BE(1);
    console.log(`dataLength buf = ${dataLength}`);
    const data = source.read(dataLength);
    channels[channel].write(data);
  }
}

function saveFiles(source) {
  let channels = null;
  let channelsCount = null;
  const channelFile = {};
  const buffer = new Queue();
  source
    .on("readable", () => {
      if (channelsCount === null) {
        const chunk = source.read(1);
        channelsCount = chunk && chunk.readUInt8(0);
      }
      if (channelsCount === null)
        return null;

      if (Object.keys(channelFile).length < channelsCount)
        getChannelID(channelsCount,
          source,
          (id, fileName) => channelFile[id] = fileName,
          (buf) => buffer.enqueue(buf),
        );

      if (Object.keys(channelFile).length < channelsCount)
        return null;
 
      if (channels === null)
        channels = getChannels(
          Object.values(channelFile),
        );

      sendBufChannels(channels, source, buffer);
      sendDataChannels(channels, source); 
    })
    .on("end", () => {
      console.log(
        `Client ${source.remoteAddress}:${source.remotePort} close connection`
      );
      channels.forEach(channel => channel.end());
    });
}

const server = createServer(socket => {
  console.log(
    `Client connected on ${socket.remoteAddress}:${socket.remotePort}`
  );
  saveFiles(socket);
});
server.listen(3000, "0.0.0.0", () => {
  createFileStore();
  const addr = server.address();
  console.log(`Server started ${addr.address}:${addr.port}`);
});
