const fs = require('fs');
const  AdmZip = require('adm-zip');
const { format, subDays } = require('date-fns')
const ftpClient = require('ftp');
const logger = require('../logs');
const {
    FTP_HOST,
    FTP_USER,
    FTP_PASSWORD,
    PUBLIC_PROPERTIES_DIR
} = require('../config')

const fileNamePrefix = 'mbi_neuf_ancien_'
module.exports = (cbl) => {
    const c = new ftpClient();
    c.connect({host: FTP_HOST, user: FTP_USER,  password: FTP_PASSWORD});

    c.on('ready', () => {
        const date = format(new Date(), 'yyyyMMdd');
        const todayMbiFileName = `${fileNamePrefix}${date}.zip`;
        c.get(todayMbiFileName, (err, stream) => {
            if (err) logger.error(err);
            stream.pipe(fs.createWriteStream(todayMbiFileName));
            stream.once('finish', () => {
                const zip = new AdmZip(todayMbiFileName);
                logger.info('Moving started')
                zip.extractAllTo(PUBLIC_PROPERTIES_DIR, true);
                fs.unlinkSync(todayMbiFileName);
                logger.info('Moving finsh');

                logger.info('Starting remove');
                const excudeDates = Array.from({ length: 3 }, (_, i)=> `${fileNamePrefix}${format(subDays(new Date(), i), 'yyyyMMdd')}.zip`);
                c.list((err, list)=> {
                    if (err) logger.error(err)
                    const listData = list.filter(l=>l.name.includes(fileNamePrefix) && !excudeDates.includes(l.name))
                    if (!listData.length) {
                        c.end();
                        logger.info('Starting mbi');
                        return cbl();
                    }
                    listData.forEach((l, i) => {
                        logger.info(l.name, 'starting')
                        c.delete(l.name, (err,data )=> {
                            if (err)
                            logger.error(err)
                            if (i === listData.length - 1) {
                                c.end();
                                logger.info('Starting mbi');
                                cbl()
                            }
                        })
                    })
                })
            });
        });
    });
    
}