using Microsoft.EntityFrameworkCore;

namespace CrowdfundOne.Models.Campaigns.SiteBuilder
{
    [Index(nameof(ColorHTML), IsUnique = true)]
    public class Color
    {
        public int Id { get; set; }
        public string ColorHTML { get; set; }
    }
}
