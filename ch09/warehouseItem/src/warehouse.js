import { Arriving, Stored, Delivered } from "./state.js";

export default class WarehouseItem {
  constructor(id, state = new Arriving()) { 
    this.id = id;
    this.state = state;
  }

  store(locationID) {
    this.locationID = locationID;
    this.state = this.state.activate();
  }

  deliver(address) {
    if (!(this.state instanceof Stored))
      return console.log(
        `Item\`s state is not "${Stored.name}"`
      );
    this.address = address;
    this.locationID = null;
    this.state = this.state.activate();
  }

  describe() {
    let msg;
    if (this.state instanceof Arriving)
      msg = `Item ${this.id} is on its way to the warehouse`;
    else if (this.state instanceof Stored)
      msg = `Item ${this.id} is stored in location ${this.locationID}`;
    else msg = `Item ${this.id} was delivered to ${this.address}`;
    return msg;
  }
}
