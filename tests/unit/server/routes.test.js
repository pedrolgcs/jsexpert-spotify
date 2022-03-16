import { jest, expect, describe, test, beforeEach } from '@jest/globals';
import { Controller } from '../../../server/controllers/index.js';
import { handle } from '../../../server/routes/index.js';
import TestUtil from '../_util/testUtil.js';

describe('#Routes - test site for api response', () => {
  beforeEach(() => {
    jest.restoreAllMocks();
    jest.clearAllMocks();
  });

  test('GET / - should redirect to home page', async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = 'GET';
    params.request.url = '/';

    await handle(...params.values());

    expect(params.response.end).toHaveBeenCalled();
    expect(params.response.writeHead).toBeCalledWith(302, {
      Location: '/home',
    });
  });

  test('GET /home - should response with home html file', async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = 'GET';
    params.request.url = '/home';

    const mockFileStream = TestUtil.generateReadableStream(['data']);
    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream,
      });
    jest.spyOn(mockFileStream, 'pipe').mockReturnValue();

    await handle(...params.values());

    expect(Controller.prototype.getFileStream).toBeCalledWith(
      'home/index.html'
    );
    expect(mockFileStream.pipe).toBeCalledWith(params.response);
  });

  test('GET /home - should response with controller html file', async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = 'GET';
    params.request.url = '/controller';

    const mockFileStream = TestUtil.generateReadableStream(['data']);
    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream,
      });
    jest.spyOn(mockFileStream, 'pipe').mockReturnValue();

    await handle(...params.values());

    expect(Controller.prototype.getFileStream).toBeCalledWith(
      'controller/index.html'
    );
    expect(mockFileStream.pipe).toBeCalledWith(params.response);
  });

  test('GET /index.html - should response with file stream', async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = 'GET';
    params.request.url = '/index.html';

    const mockFileStream = TestUtil.generateReadableStream(['data']);
    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream,
        type: '.html',
      });
    jest.spyOn(mockFileStream, 'pipe').mockReturnValue();

    await handle(...params.values());

    expect(Controller.prototype.getFileStream).toBeCalledWith('/index.html');
    expect(params.response.writeHead).toHaveBeenCalledWith(200, {
      'Content-Type': 'text/html',
    });
    expect(mockFileStream.pipe).toBeCalledWith(params.response);
  });

  test('GET /file.ext - should response with file stream', async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = 'GET';
    params.request.url = '/file.ext';

    const mockFileStream = TestUtil.generateReadableStream(['data']);
    jest
      .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
      .mockResolvedValue({
        stream: mockFileStream,
        type: '.ext',
      });
    jest.spyOn(mockFileStream, 'pipe').mockReturnValue();

    await handle(...params.values());

    expect(Controller.prototype.getFileStream).toBeCalledWith('/file.ext');
    expect(params.response.writeHead).not.toHaveBeenCalled();
    expect(mockFileStream.pipe).toBeCalledWith(params.response);
  });

  test('GET /unknown - given a inexistent route it should response with 404', async () => {
    const params = TestUtil.defaultHandleParams();
    params.request.method = 'POST';
    params.request.url = '/unknown';

    await handle(...params.values());

    expect(params.response.writeHead).toHaveBeenCalledWith(404);
    expect(params.response.end).toHaveBeenCalled();
  });

  describe('exceptions', () => {
    test('given inexistent file it should response with 404', async () => {
      const params = TestUtil.defaultHandleParams();
      params.request.method = 'GET';
      params.request.url = '/index.png';

      jest
        .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
        .mockRejectedValue(
          new Error(
            "Error: ENOENT: no such file or directory, open 'index.png'"
          )
        );
      await handle(...params.values());

      expect(params.response.writeHead).toHaveBeenCalledWith(404);
      expect(params.response.end).toHaveBeenCalled();
    });

    test('given an error it should response with 500', async () => {
      const params = TestUtil.defaultHandleParams();
      params.request.method = 'GET';
      params.request.url = '/index.png';

      jest
        .spyOn(Controller.prototype, Controller.prototype.getFileStream.name)
        .mockRejectedValue(new Error('Error'));
      await handle(...params.values());

      expect(params.response.writeHead).toHaveBeenCalledWith(500);
      expect(params.response.end).toHaveBeenCalled();
    });
  });
});
