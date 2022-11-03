using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

namespace GamePlatformAPI.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class SnakeScoreBoardController : ControllerBase
    {
        private readonly ILogger<WeatherForecastController> _logger;
        private readonly string path = "./data/SnakeHighScores.json";

        public SnakeScoreBoardController(ILogger<WeatherForecastController> logger)
        {
            _logger = logger;
        }

        [HttpGet]
        public object GetScoreBoard()
        {
            var allText = System.IO.File.ReadAllText(path);
            var jsonObject = JsonConvert.DeserializeObject(allText);
            return jsonObject;
        }

        [HttpPost]
        public ActionResult PostScoreBoard([FromBody] object scoreBoard)
        {
            var data = scoreBoard.ToString();
            System.IO.File.WriteAllText(path, data);
            return Ok();
        }

    }
}
