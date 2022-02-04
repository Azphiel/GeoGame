using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GeoGame.Modules
{
    public class QuestionLocalizations
    {
        public string QuestionId { get; set; }
        public string LocationId { get; set; }
        public Questions Question { get; set; }
        public Location Location { get; set; }
    }
}
