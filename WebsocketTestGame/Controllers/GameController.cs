using Microsoft.AspNetCore.Mvc;

namespace WebsocketTestGame.Controllers
{
    [Route("")]
    public class GameController : Controller
    {
        public IActionResult Index()
        {
            return View();
        }
    }
}
