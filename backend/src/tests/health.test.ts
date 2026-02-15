import request from 'supertest';
import app from '../app';

describe('Health Check Integration Test', () => {
    it('should return 200 OK and status ok', async () => {
        const response = await request(app).get('/api/health');

        expect(response.status).toBe(200);
        expect(response.body).toHaveProperty('status', 'ok');
        expect(response.body).toHaveProperty('timestamp');
    });
});
