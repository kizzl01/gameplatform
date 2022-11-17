using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.IO;

namespace GamePlatformAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserController : ControllerBase
    {
        private readonly ILogger<UserController> _logger;
        private readonly string path = "./data/Users.json";

        public UserController(ILogger<UserController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public object GetUser()
        {
            try
            {
            var allText = System.IO.File.ReadAllText(path);
            var jsonObject = JsonConvert.DeserializeObject(allText);
            return jsonObject;
            }
            catch(IOException ex)
            {
                return null;
            }
        }

        [HttpPost]
        public ActionResult LoginUser([FromBody] object user)
        {
            var data = user.ToString();
            System.IO.File.WriteAllText(path, data);
            return Ok();
        }
    }
}
