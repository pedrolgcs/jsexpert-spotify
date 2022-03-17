import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import TestUtil from '../_util/testUtil.js';
import { Controller } from '../../../server/controllers/index.js';
import { Service } from '../../../server/services/index.js';

describe('#Controller - test site for controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('GetFileStream - should return a file stream', async () => {
    const controller = new Controller();
    const mockFileStream = TestUtil.generateReadableStream(['data']);

    const getFileStream = jest
      .spyOn(Service.prototype, Service.prototype.getFileStream.name)
      .mockResolvedValueOnce({
        stream: mockFileStream,
        type: '.html',
      });

    const result = await controller.getFileStream('home/index.html');

    expect(getFileStream).toHaveBeenCalledWith('home/index.html');
    expect(result).toEqual({
      stream: mockFileStream,
      type: '.html',
    })
  });
});
