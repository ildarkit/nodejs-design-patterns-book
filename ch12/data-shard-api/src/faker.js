import fs from 'node:fs';
import { faker } from '@faker-js/faker';

function createUser() {
  return {
    userId: faker.string.uuid(),
    username: faker.internet.username(),
    fullname: faker.person.fullName(),
    email: faker.internet.email(),
    avatar: faker.image.avatar(),
    password: faker.internet.password(),
    birthdate: faker.date.birthdate(),
    registeredAt: faker.date.past(),
  };
}

function saveToFile(filename, content) {
  fs.writeFile(`${filename}`, content, err => {
    if (err) console.error(err);
  });
}

const adGroup = [];
const epGroup = [];
const qzGroup = [];

while ((adGroup.length + epGroup.length + qzGroup.length) < 301) {
  const user = createUser();
  const nameComponents = user.fullname.split(' ');
  const firstName = nameComponents[0].includes('.') ?
    nameComponents[1] : nameComponents[0];
  if (/[a-dA-D]/.test(firstName.charAt(0)))
    adGroup.push(user);
  else if (/[e-pE-P]/.test(firstName.charAt(0)))
    epGroup.push(user);
  else if (/[q-zQ-Z]/.test(firstName.charAt(0)))
    qzGroup.push(user);
}

saveToFile('a-d-api-service-data.json', JSON.stringify(adGroup));
saveToFile('e-p-api-service-data.json', JSON.stringify(epGroup));
saveToFile('q-z-api-service-data.json', JSON.stringify(qzGroup));
