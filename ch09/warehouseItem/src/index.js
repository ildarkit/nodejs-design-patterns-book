import WarehouseItem from "./warehouse.js";

const item = new WarehouseItem(46294542);
console.log(item.describe());
item.store('LOC3');
console.log(item.describe());
item.deliver("Ivan Petrov, Novaya street 23, Kolozev city");
console.log(item.describe());
