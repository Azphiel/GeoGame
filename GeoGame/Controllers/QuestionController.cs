using Microsoft.AspNetCore.Mvc;
using System;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using System.Diagnostics;
using GeoGame.Repositories;
using GeoGame.Modules;
using Newtonsoft.Json;
using Newtonsoft.Json.Linq;
using System.Collections.Generic;
using System.Globalization;
using System.Linq;

namespace GeoGame.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class QuestionController : ControllerBase
    {
        IQuestionRepository repository { get; set; }


        public QuestionController(IQuestionRepository question)
        {
            repository = question;

        }
        [HttpGet("GetAll")]
        public async Task<ActionResult> Get()
        {
            try
            {
                return Ok(await repository.GetQuestions());
            }
            catch (Exception ex)
            {
                Debug.WriteLine(ex.Message);
                return StatusCode(StatusCodes.Status500InternalServerError);
                //return StatusCodes(StatusCodes.Status500InternalServerError,
                //    "Error retrieving data from the database");
            }
        }
    }
}
