using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace GeoGame.Modules
{
    public class Location
    {
        public string Id { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public virtual ICollection<Questions> Questions { get; set; }
        public virtual List<QuestionLocalizations> QuestionLocalizations { get; set; }
    }

    public class LocationModel
    {
        public LocationModel()
        {

        }
        public LocationModel(Location dbLocation)
        {
            Id = dbLocation.Id;
            Latitude = dbLocation.Latitude;
            Longitude = dbLocation.Longitude;
            Questions = new List<QuestionModel>();
        }

        public string Id { get; set; }
        public string Latitude { get; set; }
        public string Longitude { get; set; }
        public ICollection<QuestionModel> Questions { get; set; }
    }
}
