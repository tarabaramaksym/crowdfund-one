namespace CrowdfundOne.Models.Campaigns.SiteBuilder
{
    public class Element
    {
        public int Id { get; set; }
        public string? Content { get; set; }

        public int WidthId { get; set; }
        public virtual Width Width { get; set; }

        public int ElementTypeId { get; set; }
        public virtual ElementType ElementType { get; set; }

        public int SiteId { get; set; }

        public int? TextAlignId { get; set; }
        public virtual TextAlign? TextAlign { get; set; }

        public int? ColorId { get; set; }
        public virtual Color? Color { get; set; }

        public int? BackgroundColorId { get; set; }
        public virtual Color? BackgroundColor { get; set; }
        
    }
}
