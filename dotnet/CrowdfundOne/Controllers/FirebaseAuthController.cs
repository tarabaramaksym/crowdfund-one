using Microsoft.AspNetCore.Mvc;
using Google.Cloud.Firestore;
using Google.Cloud.Firestore.V1;

namespace CrowdfundOne.Controllers
{
    [ApiController]
    [Route("[controller]")]
    public class FirebaseAuthController : Controller
    {

        FirestoreDb db;

        public FirebaseAuthController()
        {
            var jsonString = System.IO.File.ReadAllText("../firebase.json");
            var builder = new FirestoreClientBuilder { JsonCredentials = jsonString };
            this.db = FirestoreDb.Create("crowdfund-one-340412", client: builder.Build());
        }

        public async Task<IActionResult> Index()
        {
    
            DocumentReference docRef = this.db.Collection("chat").Document("messages");

            Dictionary<string, Dictionary<string, object>> messages = new Dictionary<string, Dictionary<string, object>>
            {
                { "0",new Dictionary<string, object>
                {
                    { "CreatedAt", DateTime.Now.Ticks },
                    { "Message", "Hello, World" },
                    { "User", "0x6f" }
                } },
                {"1", new Dictionary<string, object>
                {
                    { "CreatedAt", DateTime.Now.Ticks },
                    { "Message", "Hello, You Too" },
                    { "User", "0xb1" }
                } }
            };

            await docRef.SetAsync(messages, SetOptions.MergeAll);

            return View();
        }
    }
}
