namespace CrowdfundOne.Models.Campaigns
{
    public class CampaignApprovers
    {
        public int CampaignId { get; set; }
        public virtual Campaign Campaign { get; set; }
        public int UserId { get; set; }
        public virtual User User { get; set; }
    }
}
