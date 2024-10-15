class ColorConsole {
  log(text) {
    console.log(text);
  }
}

class RedConsole extends ColorConsole {
  constructor() {
    super();
    this.color = "\x1b[31m";
  }
  log(text) {
    console.log(this.color, text);
  }
}

class BlueConsole extends ColorConsole {
  constructor() {
    super();
    this.color = "\x1b[34m";
  }
  log(text) {
    console.log(this.color, text);
  }
}

class GreenConsole extends ColorConsole {
  constructor() {
    super();
    this.color = "\x1b[32m";
  }
  log(text) {
    console.log(this.color, text);
  }
}

export default function buildColorConsole(color) {
  switch (color) {
    case "red":
      return new RedConsole();
    case "green":
      return new GreenConsole();
    case "blue":
      return new BlueConsole();
    default:
      return new ColorConsole();
  }
}
