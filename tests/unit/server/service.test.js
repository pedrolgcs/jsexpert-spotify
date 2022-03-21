import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import fs from 'fs';
import fsPromises from 'fs/promises';
import path from 'path';
import TestUtil from '../_util/testUtil.js';
import { Service } from '../../../server/services/index.js';
import config from '../../../server/config/index.js';

describe('#Service - test suite for core processing', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('createFileStream', () => {
    const currentReadable = TestUtil.generateReadableStream(['abc']);
    const mockFile = 'file.mp3';

    jest.spyOn(fs, fs.createReadStream.name).mockReturnValue(currentReadable);

    const service = new Service();
    const sut = service.createFileStream(mockFile);

    expect(sut).toStrictEqual(currentReadable);
    expect(fs.createReadStream).toHaveBeenCalledWith(mockFile);
  });

  test('getFileInfo', async () => {
    const mockCurrentSong = 'mySong.mp3';

    jest.spyOn(fsPromises, fsPromises.access.name).mockResolvedValue();

    const service = new Service();
    const sut = await service.getFileInfo(mockCurrentSong);

    expect(sut).toStrictEqual({
      type: '.mp3',
      filePath: `${config.directory.publicDirectory}/${mockCurrentSong}`,
    });
  });

  test('getFileStream', async () => {
    const currentReadable = TestUtil.generateReadableStream(['teste']);
    const mockCurrentSong = `mySong.mp3`;
    const mockFileInfo = {
      type: '.mp3',
      filePath: `${config.directory.publicDirectory}/${mockCurrentSong}`,
    };

    const service = new Service();

    jest
      .spyOn(service, service.getFileInfo.name)
      .mockResolvedValue(mockFileInfo);

    jest
      .spyOn(service, service.createFileStream.name)
      .mockReturnValue(currentReadable);

    const sut = await service.getFileStream(mockCurrentSong);

    expect(sut).toStrictEqual({
      type: mockFileInfo.type,
      stream: currentReadable,
    });
  });
});
