import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import fsPromises from 'fs/promises';
import fs from 'fs';
import path from 'path';
import TestUtil from '../_util/testUtil.js';
import { Service } from '../../../server/services/index.js';
import config from '../../../server/config/index.js';

describe('#Service - test suit fro API service', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('createFileStream - should return a file stream', () => {
    const service = new Service();
    const mockFileStream = TestUtil.generateReadableStream(['data']);

    const createReadStream = jest
      .spyOn(Service.prototype, Service.prototype.createFileStream.name)
      .mockReturnValue(mockFileStream);

    service.createFileStream('/index.html');

    expect(createReadStream).toHaveBeenCalledTimes(1);
    expect(createReadStream).toHaveBeenCalledWith('/index.html');
  });

  test('getFileInfo - should return file indo', async () => {
    const service = new Service();
    const filePath = '/home/index.html';
    const expectedType = '.html';
    const expectedFullFilePath = path.join(
      config.directory.publicDirectory,
      filePath
    );

    const serviceReturn = await service.getFileInfo(filePath);

    expect(serviceReturn).toStrictEqual({
      type: expectedType,
      filePath: expectedFullFilePath,
    });
  });

  test('getFileStream - should create a file stream and return it with the file type', async () => {
    const service = new Service();
    const file = '/home/index.html';
    const expectedType = '.html';
    const mockFileStream = TestUtil.generateReadableStream(['data']);

    jest.spyOn(fs, fs.createReadStream.name).mockReturnValue(mockFileStream);

    const serviceReturn = await service.getFileStream(file);

    expect(serviceReturn.type).toEqual(expectedType);
  });
});
