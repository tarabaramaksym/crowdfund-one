import web3 from './web3';
import CampaignFactory from './build/CampaignFactory.json';

const instance = new web3.eth.Contract(CampaignFactory.abi, '0x7F1b2627e439d79E5541366Dc913A86E12E482fE');

export default instance;