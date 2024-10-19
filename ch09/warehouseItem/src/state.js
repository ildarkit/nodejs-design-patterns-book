export class Arriving {
  activate() {
    return new Stored();
  }
}

export class Stored {
  activate() {
    return new Delivered();
  }
}

export class Delivered {}


