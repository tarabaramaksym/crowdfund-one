import Web3 from "web3";
import Campaign from '../harmony/build/Campaign.json'
import CampaignFactory from '../harmony/build/CampaignFactory.json';

let web3 = new Web3(window.ethereum);

export const requestAccounts = async () => {
  let accounts = await window.ethereum.request({ method: 'eth_requestAccounts' })
  return {
    account: accounts
  };
}

export const getAccountsWithoutPrompt = async () => {
  let accounts = await window.ethereum.request({ method: 'eth_accounts' })
  return {
    account: accounts
  };
}

export const canAccessChat = async (account, contract) => {
  const instance = new web3.eth.Contract(Campaign.abi, contract);
  const result = await instance.methods.approvers(account).call() != 0;
  return result;
}

export const createCampaignContract = async (account, min, hardcap) => {
  min = web3.utils.toWei(min, 'ether');
  hardcap = web3.utils.toWei(hardcap, 'ether');
  const factory = new web3.eth.Contract(CampaignFactory.abi, '0x4ad19E1E2FC536eaC69C7B48792ee5DE2BEeC642');
  await factory.methods
    .createCampaign(min, hardcap, hardcap)
    .send({
      from: account
    });

  const contract = await factory.methods.getLastCampaign().call();

  return contract;
}

export const getCampaignInfo = async (contract) => {
  const campaign = new web3.eth.Contract(Campaign.abi, contract);
  const summary = await campaign.methods.getSummary().call();
  return {
    min: web3.utils.fromWei(summary[0]),
    value: web3.utils.fromWei(summary[1]),
    approversCount: summary[2],
    hardcap: web3.utils.fromWei(summary[3]),
    owner: summary[4],
    requestsCount: summary[5]
  };
}

export const contribute = async (account, contract, value) => {

  value = web3.utils.toWei(value, 'ether');

  const campaign = new web3.eth.Contract(Campaign.abi, contract);
  await campaign.methods.contribute().send({
    from: account,
    value
  });
}

export const getNumRequests = async (contract) => {
  const campaign = new web3.eth.Contract(Campaign.abi, contract);
  const requestCount = await campaign.methods.numRequests().call();
  return requestCount;
}

export const getRequests = async (account, contract) => {
  const campaign = new web3.eth.Contract(Campaign.abi, contract);
  const requestCount = await campaign.methods.numRequests().call();
  const requests = await Promise.all(
    Array(parseInt(requestCount)).fill().map(async (element, index) => {
      let req = await campaign.methods.requests(index).call();
      let can = await campaign.methods.getApprovalRequest(account, index).call();
      return {
        ...req,
        value: web3.utils.fromWei(req.value + ''),
        index,
        can: !can
      };
    })
  );
  return requests;
}

export const approveRequest = async (account, contract, requestIndex) => {
  const campaign = new web3.eth.Contract(Campaign.abi, contract);
  await campaign.methods.approveRequest(requestIndex).send({ from: account });
}

export const createRequest = async (account, contract, description, value, recipient) => {
  const campaign = new web3.eth.Contract(Campaign.abi, contract);
  await campaign.methods.createRequest(description, web3.utils.toWei(value, 'ether'), recipient).send({ from: account });
}

export const finalizeRequest = async (account, contract, requestIndex) => {
  const campaign = new web3.eth.Contract(Campaign.abi, contract);
  await campaign.methods.finalizeRequest(requestIndex).send({ from: account });
}

export const canApprove = async (account, contract, requestIndex) => {
  const campaign = new web3.eth.Contract(Campaign.abi, contract);
  const result = await campaign.methods.getApprovalRequest(account, requestIndex).call();
  return !result;
}