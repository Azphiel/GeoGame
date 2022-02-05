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
            var questions = _context.Questions;
            List<QuestionModel> q = new List<QuestionModel>();
            foreach (var question in questions)
            {
                q.Add(new QuestionModel(question));

            }
            if (q.Any())
            {
                foreach (var item in q)
                {
                    var answers = _context.Questions.Where(x => x.Id == item.Id).SelectMany(i => i.Answers);
                    if (answers.Any())
                    {
                        foreach (var a in answers)
                        {
                            item.Answers.Add(new AnswerModel(a));
                        }
                    }


                    var loc = _context.Questions.Where(x => x.Id == item.Id).SelectMany(i => i.Locations);
                    if (loc.Any())
                    {
                        foreach (var l in loc)
                        {
                            item.Location.Add(new LocationModel(l));
                        }
                    }
                }
            }
  
            JsonWrapitems.Add(new JsonWrapQuestion() { Questions = q });
            return JsonWrapitems;

        }
    }

    public interface IQuestionRepository
    {
        Task<IEnumerable<JsonWrapQuestion>> GetQuestions();

    }
}
