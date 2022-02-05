using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GeoGame.Modules
{
    public class Answers
    {
        public string Id { get; set; }
        public string Answer { get; set; }
        public bool True { get; set; }
        public virtual ICollection<Questions> Questions { get; set; }
        public virtual List<QuestionAnswer> QuestionAnswers { get; set; }
    }

    public class AnswerModel
    {
        public AnswerModel()
        {

        }
        public AnswerModel(Answers dbAnswers)
        {
            Id = dbAnswers.Id;
            Answer = dbAnswers.Answer;
            True = dbAnswers.True;
            Questions = new List<QuestionModel>();
        }

        public string Id { get; set; }
        public string Answer { get; set; }
        public bool True { get; set; }
        public ICollection<QuestionModel> Questions { get; set; }
    }
}
