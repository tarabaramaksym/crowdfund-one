import axios from "axios"


export const loadRequests = async (account) => {
  const result = await axios.get('/campaigns/user-approver-to/' + account);
  return result.data;
}