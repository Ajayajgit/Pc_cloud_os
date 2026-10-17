import dotenv from 'dotenv';
dotenv.config();

function required(name) {
    const v = process.env[name];
    if (!v) {
        throw new Error(`Missing required env var: ${name}`);
    }
    return v;
}

export const config = {
    port: parseInt(process.env.PORT || '8787', 10),
    relaySecret: process.env.PC_RELAY_SECRET || '',

    navan: {
        email: process.env.NAVAN_EMAIL || '',
        password: process.env.NAVAN_PASSWORD || '',
        totpSecret: process.env.NAVAN_TOTP_SECRET || ''
    },

    netsuite: {
        accountId: process.env.NS_ACCOUNT_ID || '',
        restletUrl: process.env.NS_RESTLET_URL || '',
        // Separate URL: the Uber attach RESTlet is a different script/deploy than invoice attach,
        // and TBA signs the script/deploy query params, so it needs its own full URL.
        uberRestletUrl: process.env.NS_UBER_RESTLET_URL || '',
        consumerKey: process.env.NS_CONSUMER_KEY || '',
        consumerSecret: process.env.NS_CONSUMER_SECRET || '',
        tokenId: process.env.NS_TOKEN_ID || '',
        tokenSecret: process.env.NS_TOKEN_SECRET || ''
    },

    // Uber for Business SFTP (from_uber/trips/daily_trips-*.csv). The box is the allowlisted
    // puller; reads are non-destructive so we just reprocess the whole folder each run and let
    // NetSuite dedup (one line per Network Transaction Id).
    uber: {
        sftpHost: process.env.UBER_SFTP_HOST || 'sftp.uber.com',
        sftpPort: parseInt(process.env.UBER_SFTP_PORT || '2222', 10),
        sftpUser: process.env.UBER_SFTP_USER || '',
        sftpKeyPath: process.env.UBER_SFTP_KEY_PATH || '',
        sftpDir: process.env.UBER_SFTP_DIR || 'from_uber/trips',
        postChunkSize: parseInt(process.env.UBER_POST_CHUNK_SIZE || '100', 10)
    },

    dbPath: process.env.DB_PATH || './relay.db',
    invoiceMinAgeHours: parseInt(process.env.INVOICE_MIN_AGE_HOURS || '2', 10),
    pdfWaitTimeoutMs: parseInt(process.env.PDF_WAIT_TIMEOUT_MS || '30000', 10)
};

export function assertServerConfig() {
    if (!config.relaySecret) {
        throw new Error('PC_RELAY_SECRET is not set; refusing to start an unauthenticated relay.');
    }
}
