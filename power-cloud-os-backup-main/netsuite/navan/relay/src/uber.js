import fs from 'node:fs';
import SftpClient from 'ssh2-sftp-client';
import pino from 'pino';
import { config } from './config.js';
import { parseDailyCsv } from './uber-parse.js';

const log = pino({ name: 'pc-navan-relay:uber' });

/**
 * Connects to the Uber SFTP, downloads every daily_trips CSV in the trips folder, and parses
 * them into a flat list of transactions ready to POST to NetSuite. Reads are non-destructive
 * and NetSuite dedups, so we deliberately reprocess the whole folder each run.
 * @returns {Promise<Array<Object>>}
 */
export async function fetchUberTransactions() {
    const sftp = new SftpClient();
    await sftp.connect({
        host: config.uber.sftpHost,
        port: config.uber.sftpPort,
        username: config.uber.sftpUser,
        privateKey: fs.readFileSync(config.uber.sftpKeyPath)
    });

    const all = [];
    try {
        const entries = await sftp.list(config.uber.sftpDir);
        const csvFiles = entries
            .filter((e) => e.type === '-' && /^daily_trips-.*\.csv$/i.test(e.name))
            .map((e) => e.name)
            .sort();

        log.info({ count: csvFiles.length }, 'daily trip files found');

        for (const name of csvFiles) {
            const remote = `${config.uber.sftpDir}/${name}`;
            const buf = await sftp.get(remote);
            const rows = parseDailyCsv(buf);
            for (const r of rows) { all.push(r); }
        }
    } finally {
        await sftp.end();
    }

    log.info({ transactions: all.length }, 'parsed transactions (pre-dedup; NetSuite dedups)');
    return all;
}
