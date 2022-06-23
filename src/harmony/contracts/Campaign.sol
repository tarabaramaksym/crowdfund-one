pragma solidity ^0.8.9;


contract CampaignFactory {

    address[] public deployedCampaigns;
    Token public token;

    constructor() {
        token = new Token(msg.sender);
    }

    function createCampaign(uint256 minimum,uint256 soft,uint256 hard) public payable returns (address) {
        address newCampaign = address(new Campaign(minimum,soft,hard, msg.sender, token));
        deployedCampaigns.push(newCampaign);
        return newCampaign;
    }

    function getCampaigns() public view returns (address[] memory) {
        return deployedCampaigns;
    }

     function getLastCampaign() public view returns(address) {
      return deployedCampaigns[deployedCampaigns.length - 1];
    }
}

contract Token {

    address public owner;

    uint256 public supply;
    uint256 public stakedSupply;

    string public name = "CrowdShare";

    mapping (address => uint256) public holders;
    mapping (address => uint256) public staked;
    mapping (address => uint256) public rewards;

    mapping (address => bool) public registered;
    address [] public stakers;

    struct Proposal {
        uint256 number;
        string title;
        string description;
        string proposalType;
        address delegate;
        mapping(address => uint256) snapshot;
        mapping(address => bool) yay;
        mapping(address => bool) nay;
        uint256 yayCount;
        uint256 nayCount;
        uint256 required;
        bool complete;
        bool yayBoolean;
    }

    mapping(uint256 => Proposal) public proposals;
    uint256 public numProposals;

    event Sent(address from, address to, uint amount);

    constructor(address _owner) {
        owner = _owner;
        supply = 100000;
        holders[owner] = supply;
    }

    function send(address receiver, uint256 amount) public {
        require(amount <= holders[msg.sender], "Insufficient balance");
        holders[msg.sender] -= amount;
        holders[receiver] += amount;
        emit Sent(msg.sender, receiver, amount);
    }

    function stake(uint256 amount) public {
        require(amount <= holders[msg.sender], "Insufficient balance");
        if(!registered[msg.sender]) {
            stakers.push(msg.sender);
        }
        stakedSupply  += amount;
        staked[msg.sender] += amount;
        holders[msg.sender] -= amount;
        rewards[msg.sender] = 0;
        registered[msg.sender] = true;
    }

    function withdrawStake(uint amount) public payable{
        require(amount <= staked[msg.sender], "Insufficient balance");
        payable(msg.sender).transfer(rewards[msg.sender]);
        staked[msg.sender] -= amount;
        rewards[msg.sender] = 0;
        stakedSupply -= amount;
        holders[msg.sender] += amount;
    }

    function withdrawProfit() public payable{
        payable(msg.sender).transfer(rewards[msg.sender]);
        rewards[msg.sender] = 0;
    }

    function deposit() public payable {
        for (uint i = 0; i < stakers.length; i++) {
            uint256 rewardNum = staked[stakers[i]] * msg.value / stakedSupply;
            rewards[stakers[i]] += rewardNum;
        }
    }

    function getReward() public view returns (uint) {
        return rewards[msg.sender];
    }

    function balance() public view returns (uint) {
        return address(this).balance;
    }

    function createProposal(string memory title, string memory description, string memory proposalType) public {
        require(staked[msg.sender] >= 5000, "You don't have enough tokens to qualify as delegate");
        Proposal storage proposal = proposals[numProposals++];
        proposal.number = numProposals - 1;
        proposal.title = title;
        proposal.description = description;
        proposal.proposalType = proposalType;
        proposal.delegate = msg.sender;
        proposal.yayCount = 0;
        proposal.nayCount = 0;
        proposal.complete = false;
        proposal.yayBoolean = false;
        
        uint required = 0;
        for(uint i = 0; i < stakers.length; i++) {
            required += staked[stakers[i]];
            proposal.snapshot[stakers[i]] = staked[stakers[i]];
        }
        proposal.required = required / 2;
    }

    modifier restrictedVoting(uint256 index) {
        require(proposals[index].snapshot[msg.sender] > 0, "You don't have permission to vote");
        require(!proposals[index].yay[msg.sender], "You already voted");
        require(!proposals[index].nay[msg.sender], "You already voted");
        require(!proposals[index].complete, "The proposal is complete");
        _;
    }

    function voteYay(uint256 index) public restrictedVoting(index) {
       proposals[index].yay[msg.sender] = true;
       proposals[index].yayCount += proposals[index].snapshot[msg.sender];
       if(proposals[index].yayCount >= proposals[index].required)
       {
           proposals[index].complete = true;
           proposals[index].yayBoolean = true;
       }
    }

    function voteNay(uint256 index) public restrictedVoting(index) {
        proposals[index].nay[msg.sender] = true;
        proposals[index].nayCount += proposals[index].snapshot[msg.sender];
        if(proposals[index].nayCount >= (proposals[index].required / 2))
        {
            proposals[index].complete = true;
            proposals[index].yayBoolean = false;
        }
    }

}

contract Campaign {
    struct Request {
        string description;
        uint256 value;
        address payable recipient;
        bool complete;
        mapping(address => bool) approvals;
        uint256 approvalCount;
    }

    address public owner;
    uint256 public minimumContribution;
    uint256 public approversCount;
    uint256 public funded;
    uint256 public softcap;
    uint256 public hardcap;
    mapping(address => uint256) public approvers;
    address payable[] private keys;

    uint256 public numRequests;
    mapping(uint256 => Request) public requests;

    Token private token;

    uint256 public refundRequest;

    modifier restricted() {
        require(
            msg.sender == owner,
            "Only contract owner can call this function"
        );
        _;
    }

    constructor(uint256 minimum,uint256 soft,uint256 hard, address sender, Token _token) {
        owner = sender;
        minimumContribution = minimum;
        softcap = soft;
        hardcap = hard;
        token = _token;
    }

    function contribute() public payable {
        if(msg.value >= minimumContribution) {
          approvers[msg.sender] = msg.value;
          approversCount++;
          funded += msg.value;
          keys.push(payable(msg.sender));

          if(address(this).balance >= hardcap) {
              token.deposit{value: address(this).balance / 1000}();
          }
        }
    }

    function createRequest(
        string memory description,
        uint256 value,
        address recipient
    ) public restricted {
        Request storage request = requests[numRequests++];
        request.description = description;
        request.value = value;
        request.recipient = payable(recipient);
        request.complete = false;
        request.approvalCount = 0;
    }

    function approveRequest(uint256 index) public {
        Request storage request = requests[index];

        require(approvers[msg.sender] != 0, "Is not approver");
        require(!request.approvals[msg.sender], "Can't vote twice");

        request.approvals[msg.sender] = true;
        requests[index].approvalCount++;
    }

    function finalizeRequest(uint256 index) public restricted {
        Request storage request = requests[index];
        require(!request.complete, "Request is already completed");
        require(
            request.approvalCount >= approversCount / 2,
            "Not enough approvals"
        );

        request.recipient.transfer(request.value);
        request.complete = true;
    }

    function getApprovalRequest(address sender, uint256 index) public view returns (bool) {
      return requests[index].approvals[sender];
    }

    function requstRefund() public {
      refundRequest = numRequests;
      Request storage refund = requests[numRequests++];
      refund.description = "Refund";
      refund.value = 0;
      refund.recipient = payable(msg.sender);
      refund.complete = false;
      refund.approvalCount = 0;
    }

    function finalizeRefund() public {
      Request storage refund = requests[refundRequest];
      require(!refund.complete, "Refund is already completed");
      require(
          refund.approvalCount >= (approversCount / 4) * 3,
          "Not enough approvals"
      );

      uint256 i = 0;
      while (i < keys.length) {
          uint256 part = (approvers[keys[i]] / funded * 100) / address(this).balance * 100;
          keys[i].transfer(part);
      }
    }
    

    function getSummary() public view returns ( uint256, uint256, uint256, uint256, address, uint256)
    {
        return (
            minimumContribution,
            address(this).balance,
            approversCount,
            hardcap,
            owner,
            numRequests
        );
    }

}