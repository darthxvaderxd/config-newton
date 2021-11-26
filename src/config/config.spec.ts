import { ConfigService } from './config.service';
import { Config } from "../entity/config";
import { Deployment } from "../entity/deployment";
import { DeploymentKey } from "../entity/deployment-key";

describe('ConfigController', () => {
  let configService: ConfigService;

  const deployment = new Deployment();
  deployment.name = 'dev'
  deployment.deployment_id = 1
  deployment.secured = false;

  const secureDeployment = new Deployment();
  secureDeployment.name = 'prod'
  secureDeployment.deployment_id = 2
  secureDeployment.secured = true;

  const deploymentKey = new DeploymentKey();
  deploymentKey.key = '1337beef';
  deploymentKey.deployment_id = 2;
  deploymentKey.deployment_key_id =1;

  let configRepository;
  let deploymentRepository;
  let deploymentKeyRepository;

  beforeEach(() => {
    configRepository = {
      findOne: jest.fn(entity => entity),
      find: jest.fn(entity => entity),
      save: jest.fn(entity => entity),
    };
    deploymentRepository = {
      findOne: jest.fn(entity => entity),
      find: jest.fn(entity => entity),
      save: jest.fn(entity => entity),
    };
    deploymentKeyRepository = {
      findOne: jest.fn(entity => entity),
      find: jest.fn(entity => entity),
      save: jest.fn(entity => entity),
    };
    // @ts-ignore
    configService = new ConfigService(configRepository, deploymentRepository, deploymentKeyRepository);
  });

  it('saveConfig works as expected when one is not found', async () => {
    configRepository.findOne = jest.fn(() => null);
    // @ts-ignore
    const config = await configService.saveConfig(1, 'abc', 'def');
    expect(config.deployment_id).toBe(1);
    expect(config.key).toBe('abc');
    expect(config.value).toBe('def');
    expect(configRepository.find).toBeCalledTimes(0);
    expect(configRepository.findOne).toBeCalledTimes(1);
    expect(configRepository.save).toBeCalledTimes(1);
    expect(configRepository.find).toBeCalledTimes(0);
  });

  it('saveConfig works as expected when one is found', async () => {
    configRepository.findOne = jest.fn(() => {
      const config = new Config();
      config.config_id = 1;
      config.deployment_id = 2;
      config.key = 'abc';
      config.value = 'test';
      return config;
    });
    // @ts-ignore
    const config = await configService.saveConfig(2, 'abc', 'def');
    expect(config.config_id).toBe(1);
    expect(config.deployment_id).toBe(2);
    expect(config.key).toBe('abc');
    expect(config.value).toBe('def');
    expect(configRepository.find).toBeCalledTimes(0);
    expect(configRepository.findOne).toBeCalledTimes(1);
    expect(configRepository.save).toBeCalledTimes(1);
    expect(configRepository.find).toBeCalledTimes(0);
  });

  it('validateDeployment works as expected when does not exist', async () =>{
    deploymentRepository.findOne = jest.fn(() => null);
    const result = await configService.validateDeployment('key', 'nope');
    expect(result).toBeNull();
    expect(deploymentRepository.find).toBeCalledTimes(0);
    expect(deploymentRepository.findOne).toBeCalledTimes(1);
    expect(deploymentRepository.save).toBeCalledTimes(0);
    expect(deploymentRepository.find).toBeCalledTimes(0);
    expect(deploymentKeyRepository.find).toBeCalledTimes(0);
    expect(deploymentKeyRepository.findOne).toBeCalledTimes(0);
    expect(deploymentKeyRepository.save).toBeCalledTimes(0);
    expect(deploymentKeyRepository.find).toBeCalledTimes(0);
  });

  it('validateDeployment works as expected when does exists and not secure', async () =>{
    deploymentRepository.findOne = jest.fn(() => deployment);
    const result = await configService.validateDeployment('key', 'nope');
    expect(result).toBe(deployment);
    expect(deploymentRepository.find).toBeCalledTimes(0);
    expect(deploymentRepository.findOne).toBeCalledTimes(1);
    expect(deploymentRepository.save).toBeCalledTimes(0);
    expect(deploymentRepository.find).toBeCalledTimes(0);
    expect(deploymentKeyRepository.find).toBeCalledTimes(0);
    expect(deploymentKeyRepository.findOne).toBeCalledTimes(0);
    expect(deploymentKeyRepository.save).toBeCalledTimes(0);
    expect(deploymentKeyRepository.find).toBeCalledTimes(0);
  });

  it('validateDeployment works as expected when does exists and secure and key does not match', async () =>{
    deploymentRepository.findOne = jest.fn(() => secureDeployment);
    deploymentKeyRepository.findOne = jest.fn(() => null);
    const result = await configService.validateDeployment('key', 'nope');
    expect(result).toBeNull();
    expect(deploymentRepository.find).toBeCalledTimes(0);
    expect(deploymentRepository.findOne).toBeCalledTimes(1);
    expect(deploymentRepository.save).toBeCalledTimes(0);
    expect(deploymentRepository.find).toBeCalledTimes(0);
    expect(deploymentKeyRepository.find).toBeCalledTimes(0);
    expect(deploymentKeyRepository.findOne).toBeCalledTimes(1);
    expect(deploymentKeyRepository.save).toBeCalledTimes(0);
    expect(deploymentKeyRepository.find).toBeCalledTimes(0);
  });

  it('validateDeployment works as expected when does exists and secure and key does match', async () =>{
    deploymentRepository.findOne = jest.fn(() => secureDeployment);
    deploymentKeyRepository.findOne = jest.fn(() => deploymentKey);
    const result = await configService.validateDeployment('1337beef', 'nope');
    expect(result).toBe(secureDeployment);
    expect(deploymentRepository.find).toBeCalledTimes(0);
    expect(deploymentRepository.findOne).toBeCalledTimes(1);
    expect(deploymentRepository.save).toBeCalledTimes(0);
    expect(deploymentRepository.find).toBeCalledTimes(0);
    expect(deploymentKeyRepository.find).toBeCalledTimes(0);
    expect(deploymentKeyRepository.findOne).toBeCalledTimes(1);
    expect(deploymentKeyRepository.save).toBeCalledTimes(0);
    expect(deploymentKeyRepository.find).toBeCalledTimes(0);
  });

  it('getDeployment works as expected', async () => {
    const result1 = await configService.getDeployment(deployment);
    const result2 = await configService.getDeployment(secureDeployment);
    expect(result1.results).toEqual({ deployment_id: 1 });
    expect(result2.results).toEqual({ deployment_id: 2 });
    expect(configRepository.findOne).toBeCalledTimes(0);
    expect(configRepository.find).toBeCalledTimes(2);
    expect(configRepository.save).toBeCalledTimes(0);
  });

  it('updateConfigForDeployment works as expected', async () => {
    const body = {
      test: 'abc',
      message: 'hello world',
      foo: 'bar'
    };
    const configs = [];
    configRepository.findOne = jest.fn(() => null);
    configRepository.find = jest.fn(() => configs);
    configRepository.save = jest.fn((entity) => configs.push(entity));
    const result = await configService.updateConfigForDeployment(deployment, body);
    expect(result.results).toBe(configs);
    expect(configs.length).toBe(3);
    expect(configs[0].key).toBe('test');
    expect(configs[0].value).toBe(body.test);
    expect(configs[1].key).toBe('message');
    expect(configs[1].value).toBe(body.message);
    expect(configs[2].key).toBe('foo');
    expect(configs[2].value).toBe(body.foo);
    expect(configRepository.findOne).toBeCalledTimes(3);
    expect(configRepository.find).toBeCalledTimes(1);
    expect(configRepository.save).toBeCalledTimes(3);
  });

  it('getDeploymentConfig works as expected when found', async () => {
    const result = await configService.getDeploymentConfig(deployment, 'abc');
    expect(result.results).toEqual({
      deployment_id: 1,
      key: 'abc',
    });
    expect(configRepository.findOne).toBeCalledTimes(1);
    expect(configRepository.find).toBeCalledTimes(0);
    expect(configRepository.save).toBeCalledTimes(0);
  });

  it('getDeploymentConfig works as expected when not found', async () => {
    configRepository.findOne = jest.fn(() => null);
    await expect(async () => {
      await configService.getDeploymentConfig(deployment, 'test')
    }).rejects.toThrow('Not Found Exception')
    expect(configRepository.findOne).toBeCalledTimes(1);
    expect(configRepository.find).toBeCalledTimes(0);
    expect(configRepository.save).toBeCalledTimes(0);
  });

  it('updateConfigForDeploymentConfig works as expected', async () => {
    const result = await configService.updateConfigForDeploymentConfig(
      secureDeployment,
      'theKey',
      'theValue',
    );
    expect(result.results).toEqual({
      deployment_id: 2,
      key: 'theKey',
    });
    expect(configRepository.findOne).toBeCalledTimes(2);
    expect(configRepository.find).toBeCalledTimes(0);
    expect(configRepository.save).toBeCalledTimes(1);
  });
});
