using System;
using System.Collections;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GeoGame.Modules
{
    public class Questions
    {
        public string Id { get; set; }
        public string name { get; set; }
        public string question { get; set; }
        public virtual ICollection<Answers> Answers { get; set; }
        public virtual List<QuestionAnswer> QuestionAnswers { get; set; }
        public virtual ICollection<Location> Locations { get; set; }
        public virtual List<QuestionLocalizations> QuestionLocalizations { get; set; }
    }

    public class QuestionModel
    {
        public QuestionModel()
        {

        }
        public QuestionModel(Questions dbQuestion)
        {
            Id = dbQuestion.Id;
            name = dbQuestion.name;
            question = dbQuestion.question;
            Answers = new List<AnswerModel>();
            Location = new List<LocationModel>();
        }

        public string Id { get; set; }
        public string name { get; set; }
        public string question { get; set; }
        public ICollection<AnswerModel> Answers { get; set; }
        public ICollection<LocationModel> Location { get; set; }
    }
}
