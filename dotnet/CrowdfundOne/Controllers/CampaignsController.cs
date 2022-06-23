using CrowdfundOne.DAL;
using CrowdfundOne.Models.Campaigns;
using CrowdfundOne.Models.Campaigns.SiteBuilder;
using Microsoft.AspNetCore.Mvc;

namespace CrowdfundOne.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class CampaignsController : Controller
    {
        private readonly CampaignContext _context;


        public CampaignsController(CampaignContext context)
        {
            _context = context;
        }

        [HttpGet]
        [Route("get-page-amount-overall")]
        public int GetPagesAmount()
        {
            return (_context.Campaigns.Count() - 3) / 12 + 1;
        }

        [HttpGet]
        [Route("user-approver-to/pages/{address}")]
        public int GetPagesCountOfCampaignsUserApproverTo(string address)
        {
            var user = _context.Users.FirstOrDefault(u => u.Address == address);
            if (user == null)
            {
                return 0;
            }
            return (_context.CampaignApprovers.Where(c => c.UserId == user.Id).Count() - 3) / 12 + 1;
        }

        [HttpGet]
        [Route("user-owner-to/pages/{address}")]
        public int GetPagesCountOfCampaignsUserOwnerTo(string address)
        {
            var user = _context.Users.FirstOrDefault(u => u.Address == address);
            if(user == null)
            {
                return 0;
            }
            _context.Entry(user).Collection(s => s.Owned).Load();
            return (user.Owned.Count - 3) / 12 + 1;
        }

        [HttpGet]
        [Route("user-approver-to/count/{address}")]
        public int GetCountOfCampaignsUserApproverTo(string address)
        {
            var user = _context.Users.FirstOrDefault(u => u.Address == address);
            if (user == null)
            {
                return 0;
            }
            return _context.CampaignApprovers.Where(c => c.UserId == user.Id).Count();
        }

        [HttpGet]
        [Route("user-owner-to/count/{address}")]
        public int GetCountOfCampaignsUserOwnerTo(string address)
        {
            var user = _context.Users.FirstOrDefault(u => u.Address == address);
            if (user == null)
            {
                return 0;
            }
            _context.Entry(user).Collection(s => s.Owned).Load();
            return user.Owned.Count;
        }

      

        [HttpGet]
        [Route("user-owner-to/campaigns/{address}/{page}")]
        public IEnumerable<Campaign> GetCampaignsUserOwnerTo(string address, int page)
        {
            var user = _context.Users.FirstOrDefault(u => u.Address == address);
            if (user == null)
            {
                return new List<Campaign>();
            }
           _context.Entry(user).Collection(s => s.Owned).Load();
            return user.Owned.AsEnumerable().OrderByDescending(c => c.Id).Take(new Range(12 * page - 12, 12 * page)); ;
        }

        [HttpGet]
        [Route("user-approver-to/campaigns/{address}/{page}")]
        public IEnumerable<Campaign> GetCampaignsUserApproverTo(string address,int page)
        {

            var user = _context.Users.FirstOrDefault(u => u.Address == address);
            if (user == null)
            {
                return new List<Campaign>();
            }
            _context.Entry(user).Collection(s => s.ApproverTo).Load();
            foreach(var campaign in user.ApproverTo)
            {
                _context.Entry(campaign).Navigation("Campaign").Load();
                campaign.Campaign.Approvers = null;
            }
            return user.ApproverTo.Select(c => c.Campaign).OrderByDescending(c => c.Id).Take(new Range(12 * page - 12, 12 * page));

        }

        //[Route("sitebuilder")]
        [HttpGet]
        [Route("paged/{page}")]
        public IEnumerable<Campaign> Get(int page)
        {
            var data = _context.Campaigns.AsEnumerable().Take(new Range(4,_context.Campaigns.Count())).OrderByDescending(c => c.Id).Take(new Range(12 * page - 12, 12 * page));
            return data;
        }

        [HttpGet]
        [Route("trending")]
        public IEnumerable<Campaign> GetTrending()
        {
            var data = _context.Campaigns
                .AsEnumerable()
                .Take(new Range(4, _context.Campaigns.Count()))
                .OrderBy(c => {
                    _context.Entry(c).Collection(c => c.Approvers).Load();
                    return c.Approvers.Count();
                    })
                .Take(5);
            return data;
        }

        [HttpGet]
        [Route("new")]
        public IEnumerable<Campaign> GetNew()
        {
            var data = _context.Campaigns
                .AsEnumerable()
                .Take(new Range(4, _context.Campaigns.Count()))
                .OrderByDescending(c => c.Id)
                .Take(5);
            return data;
        }


        [HttpPost]
        public async Task<HttpResponseMessage> Post(/*[Bind("Id")]*/ Campaign campaign)
        {
            if (ModelState.IsValid)
            {
                foreach (var item in campaign.Elements)
                {
                    await HandleIndeces(item);
                }

                var user = _context.Users.FirstOrDefault(u => u.Address == campaign.User.Address);

                if (user != null)
                {
                    _context.Entry(user).Collection(s => s.Owned).Load();
                    user.Owned.Add(campaign);
                }
                else
                {
                    campaign.User.Owned.Add(campaign);
                    _context.Users.Add(campaign.User);
                    _context.Add(campaign);
                }

                await _context.SaveChangesAsync();
            }
            return new HttpResponseMessage(System.Net.HttpStatusCode.OK);
        }

        private async Task HandleIndeces(Element item)
        {
            var type = _context.ElementTypes.FirstOrDefault(t => t.Name == item.ElementType.Name);

            if (type != null)
            {
                item.ElementType = type;
            }
            else
            {
                _context.ElementTypes.Add(item.ElementType);
                await _context.SaveChangesAsync();
            }

            var width = _context.Widths.FirstOrDefault(w => w.Name == item.Width.Name);
            if (width != null)
            {
                item.Width = width;
            }
            else
            {
                _context.Widths.Add(item.Width);
                await _context.SaveChangesAsync();
            }

            item.Width = width != null ? width : item.Width;

            if (item.Color != null)
            {
                var color = _context.Colors.FirstOrDefault(c => c.ColorHTML == item.Color.ColorHTML);
                if (color != null)
                {
                    item.Color = color;
                }
                else
                {
                    _context.Colors.Add(item.Color);
                    await _context.SaveChangesAsync();
                }
            }

            if (item.BackgroundColor != null)
            {
                var backgroundColor = _context.Colors.FirstOrDefault(c => c.ColorHTML == item.BackgroundColor.ColorHTML);
                if (backgroundColor != null)
                {
                    item.BackgroundColor = backgroundColor;
                }
                else
                {
                    _context.Colors.Add(item.BackgroundColor);
                    await _context.SaveChangesAsync();
                }
            }

            if (item.TextAlign != null)
            {
                var align = _context.TextAligns.FirstOrDefault(a => a.Name == item.TextAlign.Name);
                if (align != null)
                {
                    item.TextAlign = align;
                }
                else
                {
                    _context.TextAligns.Add(item.TextAlign);
                    await _context.SaveChangesAsync();
                }
            }


        }

        // GET: Sites/Details/5
        [HttpGet]
        [Route("{id}")]
        public Campaign Details(string? id)
        {
            if (id == null)
            {
                return null;
            }

            var site = _context.Campaigns.FirstOrDefault(m => m.Contract == id);


            if (site == null)
            {
                return null;
            }
            _context.Entry(site).Collection(s => s.Elements).Load();
            foreach (var item in site.Elements.AsQueryable())
            {
                item.TextAlign = _context.TextAligns.FirstOrDefault(m => m.Id == item.TextAlignId);
                item.BackgroundColor = _context.Colors.FirstOrDefault(m => m.Id == item.BackgroundColorId);
                item.Color = _context.Colors.FirstOrDefault(m => m.Id == item.ColorId);
                item.ElementType = _context.ElementTypes.FirstOrDefault(m => m.Id == item.ElementTypeId);
                item.Width = _context.Widths.FirstOrDefault(m => m.Id == item.WidthId);
            }
            return site;
        }


        [HttpPost]
        [Route("add-approver/{id}")]
        public async Task<HttpResponseMessage> AddApprover(string id, User user)
        {
            if (ModelState.IsValid)
            {
                var campaign = _context.Campaigns.FirstOrDefault(c => c.Contract == id);

                if (campaign == null)
                {
                    return new HttpResponseMessage(System.Net.HttpStatusCode.NotFound);
                }

                var tmp = _context.Users.FirstOrDefault(u => u.Address == user.Address);

                if (tmp != null)
                {

                    if (_context.CampaignApprovers.Any(c => c.CampaignId == campaign.Id && tmp.Id == c.UserId))
                    {
                        return new HttpResponseMessage(System.Net.HttpStatusCode.OK);
                    }

                    _context.CampaignApprovers.Add(new CampaignApprovers { CampaignId = campaign.Id, UserId = tmp.Id });
                }
                else
                {
                    user.ApproverTo.Add(new CampaignApprovers { CampaignId = campaign.Id, User = user });
                    _context.Users.Add(user);
                }

                await _context.SaveChangesAsync();
            }
            return new HttpResponseMessage(System.Net.HttpStatusCode.OK);
        }

        [HttpGet]
        [Route("user-approver-to/{id}")]
        public IEnumerable<object> UserApproverTo(string? id)
        {
            if (id == null)
            {
                return new List<object>();
            }

           
            var user = _context.Users.FirstOrDefault(u => u.Address == id);

            if (user == null)
            {
                return new List<object>();
            }

            var campaigns = _context.CampaignApprovers
                .Where(c => c.UserId == user.Id)
                .Select(c => c.Campaign)
                .Select(c => (new { title = c.Title, contract =c.Contract }));
               
            return campaigns;
        }

        

        // GET: Sites/Create
        /* public IActionResult Create()
         {
             return View();
         }*/

        // POST: Sites/Create
        //  [ValidateAntiForgeryToken]
        // To protect from overposting attacks, enable the specific properties you want to bind to.
        // For more details, see http://go.microsoft.com/fwlink/?LinkId=317598.
        //[Route("sitebuilder")]


        // GET: Sites/Edit/5
        /*public async Task<IActionResult> Edit(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var site = await _context.Sites.FindAsync(id);
            if (site == null)
            {
                return NotFound();
            }
            return View(site);
        }

        // GET: Sites/Delete/5
        public async Task<IActionResult> Delete(int? id)
        {
            if (id == null)
            {
                return NotFound();
            }

            var site = await _context.Sites
                .FirstOrDefaultAsync(m => m.Id == id);
            if (site == null)
            {
                return NotFound();
            }

            return View(site);
        }*/
    }
}
