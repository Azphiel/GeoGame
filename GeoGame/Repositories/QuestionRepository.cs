using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using GeoGame.Modules;

namespace GeoGame.Repositories
{
    public class QuestionRepository : IQuestionRepository
    {
        public readonly GeoGameDbContext _context;

        public QuestionRepository(GeoGameDbContext context)
        {
            _context = context;
        }
        public async Task<IEnumerable<JsonWrapQuestion>> GetQuestions()
        {
            List<JsonWrapQuestion> JsonWrapitems = new List<JsonWrapQuestion>();
            var questions = _context.Questions.Include(x=>x.QuestionAnswers).ThenInclude(x=>x.Answer).Include(x=>x.QuestionLocalizations).ThenInclude(x=>x.Location);
            foreach(var question in questions)
            {
                JsonWrapitems.Add(new JsonWrapQuestion() { Questions = question });
            }
            return JsonWrapitems;

        }
    }

    public interface IQuestionRepository
    {
        Task<IEnumerable<JsonWrapQuestion>> GetQuestions();

    }
}
