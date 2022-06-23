using Microsoft.EntityFrameworkCore;

namespace CrowdfundOne.Models.Campaigns
{
    [Index(nameof(Address), IsUnique = true)]
    public class User
    {
        public int Id { get; set; }
        public string Address { get; set; }
        public virtual ICollection<Campaign> Owned { get; set; }
        public virtual ICollection<CampaignApprovers> ApproverTo { get; set; }
    }
}
