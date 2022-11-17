// import * as Nexmo from 'nexmo';
import Nexmo from 'nexmo';

const nexmo = new Nexmo({
    apiKey: process.env.NEXMO_KEY|| '',
    apiSecret: process.env.NEXMO_SECRET||'',
});
export default nexmo;
