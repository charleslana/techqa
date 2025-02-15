import {Queue} from 'bullmq';
import 'dotenv/config';

const connection = {
    host: process.env.REDIS_HOST,
    port: +process.env.REDIS_PORT,
}

const queueName = 'twoFactorQueue';

const queue = new Queue(queueName, {connection});

interface JobRedisInterface {
    name: string;
    cpf: string;
    email: string;
    code: string;
}

export const getJob = async (): Promise<JobRedisInterface> => {
    const jobs = await queue.getJobs();
    return jobs[0].data;
}

export const cleanJobs = async () => {
    await queue.obliterate();
}