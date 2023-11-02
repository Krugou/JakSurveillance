import request from 'supertest';
import app from '../jaksecfileserver.js';

describe('JakSec File Server', () => {
	it('should serve static files from JakSec directory', async () => {
		const res = await request(app).get('/somefile.html'); // replace 'somefile.html' with an actual file in your JakSec directory
		expect(res.status).toEqual(200);
	});

	it('should return index.html for all non-static routes', async () => {
		const res = await request(app).get('/nonexistentroute');
		expect(res.status).toEqual(200);
		expect(res.text).toContain('<html'); // assuming index.html starts with <html
	});

	it('should start the server without errors', () => {
		const consoleSpy = jest.spyOn(console, 'log');
		app.listen(3001, () => {
			expect(consoleSpy).toHaveBeenCalledWith(
				expect.stringContaining(
					'JakSec FILE SERVER started at: http://localhost:3001/index.html start time:'
				)
			);
		});
	});
});
