const cron = require('node-cron');
const { cleanExpiredSales } = require('./controllers/onsale-controller');

cron.schedule('0 * * * *', async () => {
  await cleanExpiredSales({ }, { json: () => { } });
});
