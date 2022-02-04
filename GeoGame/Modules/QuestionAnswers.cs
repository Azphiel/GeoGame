using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GeoGame.Modules
{
    public class QuestionAnswer
    {
        public string QuestionId { get; set; }
        public string AnswerId { get; set; }
        public bool True { get;set; }
        public Answers Answer { get; set; }
        public Questions Question { get; set; }
    }
}
