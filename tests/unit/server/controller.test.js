import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import TestUtil from '../_util/testUtil.js';
import { Controller } from '../../../server/controllers/index.js';
import { Service } from '../../../server/services/index.js';

describe('#Controller - test suit for API controller', () => {
  beforeEach(() => {
    jest.resetAllMocks();
    jest.clearAllMocks();
  });

  test('getFileStream', async () => {
    const mockStream = TestUtil.generateReadableStream(['data']);
    const mockType = '.html';
    const mockFileName = 'test.html';

    jest
      .spyOn(Service.prototype, Service.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockStream,
        type: mockType,
      });

    const controller = new Controller();
    const sut = await controller.getFileStream(mockFileName);

    expect(sut.stream).toStrictEqual(mockStream)
    expect(sut.type).toStrictEqual(mockType)
  });
});
