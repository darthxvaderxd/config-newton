import configLoader from 'config-newton-client';

const run = async () => {
    await configLoader(
        process?.env?.CONFIG_HOST ?? 'http://localhost:3200',
        process?.env?.ENV ?? 'dev',
        process?.env?.CONFIG_SECRET ?? '',
    );

    console.log('message => ', process.env.message);
}

run().then(() => console.log('done')).catch((e) => console.error(e));
