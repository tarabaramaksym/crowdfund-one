using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.DependencyInjection;
using CrowdfundOne.DAL;

var builder = WebApplication.CreateBuilder(args);


builder.Services.AddDbContext<CampaignContext>(options =>
    options.UseSqlServer(builder.Configuration.GetConnectionString("SiteBuilderContext")));


// Add services to the container.

builder.Services.AddControllers();


var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseAuthorization();

app.MapControllers();
/* app.MapControllerRoute(
    name: "default",
    pattern: "{controller=SiteBuilder}/{action=Index}");
app.MapControllerRoute(
      name: "create",
      pattern: "{controller=SiteBuilder}/{action=Create}"
    );*/
    
app.Run();

