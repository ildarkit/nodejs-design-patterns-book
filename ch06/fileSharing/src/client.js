import { basename } from "path"
import { connect } from "net";
import { fork } from "child_process";
import { createReadStream } from "fs";
import { MSG_FORMAT, MSG_SPLITTER } from "./message.js";
import StreamChannel from "./streamChannel.js";

function sendChannelCount(count, destination) {
  const buf = Buffer.alloc(1);
  buf.writeUInt8(count, 0);
  destination.write(buf);
}

function sendFileNames(files, destination) {
  files.forEach((file, channel) => {
    const msg = [
      MSG_FORMAT,
      [channel, basename(file)]
        .join(MSG_SPLITTER),
      MSG_FORMAT,
    ].join(""); 
    destination.write(msg);
  });
}

function sendFiles(fileNames, destination) {
  let openChannels = fileNames.length;

  sendChannelCount(fileNames.length, destination); 
  sendFileNames(fileNames, destination);
 
  const sources = fileNames.map(file => createReadStream(file));
  sources.forEach((source, channel) => {
    source
      .on("end", () => {
        if (--openChannels === 0) {
          console.log("Close socket");
          destination.end();
        }
      })
      .pipe(new StreamChannel(channel))
      .pipe(destination);
  }); 
}

const [host, port] = process.argv[2].split(":");
const fileNames = process.argv.slice(3);

const socket = connect(Number(port), host, () => {
  console.log(`Connected to the server: ${socket.remoteAddress}:${socket.remotePort}`);
  sendFiles(fileNames, socket);
});
