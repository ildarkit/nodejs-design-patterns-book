import Consul from 'consul';

export function consulService(args) { 
  const consul = new Consul();
  return [
    async () => await registerService({ consul, ...args }),
    async () => await unregisterService({ consul, ...args })
  ];
}

async function registerService ({ consul, ...rest }) {
  await consul.agent.service.register({
    ...rest,
    tags: [rest.name]
  }, () => {
    console.log(`${rest.name} registered successfully`);
  });
}

async function unregisterService ({ consul, id }) {
  console.log(`deregistering ${id}`);
  await consul.agent.service.deregister(id, () => {
    process.exit(err ? 1 : 0)
  });
}
