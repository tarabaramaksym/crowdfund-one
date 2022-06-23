using CrowdfundOne.Models.Campaigns;
using CrowdfundOne.Models.Campaigns.SiteBuilder;
using Microsoft.EntityFrameworkCore;

namespace CrowdfundOne.DAL
{
    public class CampaignContext : DbContext
    {
        public CampaignContext(DbContextOptions<CampaignContext> options) : base(options)
        {
            Database.EnsureCreated();
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Campaign>()
                .HasMany(e => e.Elements)
                .WithOne()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<User>()
            .HasMany(e => e.Owned)
            .WithOne()
            .OnDelete(DeleteBehavior.Restrict);


            modelBuilder.Entity<CampaignApprovers>()
                .HasKey(bc => new { bc.CampaignId, bc.UserId });

            modelBuilder.Entity<CampaignApprovers>()
                .HasOne(bc => bc.Campaign)
                .WithMany(b => b.Approvers)
                .HasForeignKey(bc => bc.CampaignId).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<CampaignApprovers>()
                .HasOne(bc => bc.User)
                .WithMany(c => c.ApproverTo)
                .HasForeignKey(bc => bc.UserId).OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Element>()
                .HasOne(e => e.BackgroundColor)
                .WithMany()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Element>()
                .HasOne(e => e.Color)
                .WithMany()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Element>()
                .HasOne(e => e.TextAlign)
                .WithMany()
                .OnDelete(DeleteBehavior.Restrict);

            modelBuilder.Entity<Element>()
                .HasOne(e => e.Width)
                .WithMany()
                .OnDelete(DeleteBehavior.Restrict);
        }

        

        public DbSet<Campaign> Campaigns { get; set; }
        public DbSet<Element> Elements { get; set; }
        public DbSet<User> Users { get; set; }
        public DbSet<Models.Campaigns.SiteBuilder.ElementType> ElementTypes { get; set; }
        public DbSet<TextAlign> TextAligns { get; set; }
        public DbSet<Width> Widths { get; set; }
        public DbSet<Color> Colors { get; set; }
        public DbSet<CampaignApprovers> CampaignApprovers { get; set; }
    }
}
