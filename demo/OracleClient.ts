import oracledb from 'oracledb';
import config from 'config';
import { logger } from './applog';

export const OracleClient = async () => {

    const connectADB = async (version: string) => {
        const connectionInfo: any = config.get('oracle.connectionInfo')
        const ORACLE_HOME: string = config.get('oracle.oracleHome')
        const connectString = connectionInfo[version].connectString
        process.env.TNS_ADMIN = `${ORACLE_HOME}/network/admin/${version}/`
        logger.info(`Connecting to database: ${version} - ${connectString}`)
        try {
            oracledb.initOracleClient({ libDir: ORACLE_HOME }); // Path to your Instant Client
            // oracledb.thin = true;
            oracledb.autoCommit = true;
            const connection = await oracledb.getConnection({
                user: connectionInfo.username,
                password: connectionInfo.password,
                connectString: connectString
            });

            logger.info("Connected to Oracle Autonomous DB!");
            return connection
        } catch (err) {
            logger.error("Connection failed:", err);
        }
    }

    return { connectADB }

}