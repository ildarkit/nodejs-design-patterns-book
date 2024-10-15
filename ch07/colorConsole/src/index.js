import readline from "node:readline/promises";
import buildColorConsole from "./colorConsole.js";

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});
const color = await rl.question(
  "Enter color name for console output (red, green, blue): ");
const colorConsole = buildColorConsole(color);

rl.on("line", input => {
  colorConsole.log(`Recieved: ${input}`);
  rl.prompt();
});
colorConsole.log("");
rl.prompt();

