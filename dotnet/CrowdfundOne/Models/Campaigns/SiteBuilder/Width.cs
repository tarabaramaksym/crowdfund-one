using Microsoft.EntityFrameworkCore;

namespace CrowdfundOne.Models.Campaigns.SiteBuilder
{
    [Index(nameof(Name), IsUnique = true)]
    public class Width
    {
        public int Id { get; set; }
        public string Name { get; set; }
    }
}
