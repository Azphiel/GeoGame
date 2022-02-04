using System;
using System.Collections.Generic;
using System.Linq;
using System.Text.Json.Serialization;
using System.Threading.Tasks;

namespace GeoGame.Repositories
{
    public class JsonWrapQuestion
    {
        [JsonPropertyName("Question")]
        public object Questions { get; set; }
    }
    public class JsonWrapSession
    {
        [JsonPropertyName("Answers")]
        public object Item { get; set; }
    }
    public class JsonWrapViewItem
    {
        [JsonPropertyName("Location")]
        public object ViewItem { get; set; }
    }
}
