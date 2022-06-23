
using CrowdfundOne.Models.Campaigns.SiteBuilder;
using Microsoft.EntityFrameworkCore;

namespace CrowdfundOne.Models.Campaigns
{
    [Index(nameof(Contract), IsUnique = true)]
    public class Campaign
    {
        public int Id { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string Image { get; set; }
        public string Contract { get; set; }
        public virtual ICollection<Element> Elements { get; set; }
        public virtual ICollection<CampaignApprovers> Approvers { get; set; }

        [System.ComponentModel.DataAnnotations.Schema.NotMapped]
        public User User { get; set; }

    }
}
