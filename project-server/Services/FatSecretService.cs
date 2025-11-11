using System.Net.Http.Headers;
using System.Text;
using System.Text.Json;

namespace project_server.Services
{
    public class FatSecretService
    {
        private readonly HttpClient _httpClient;
        private readonly string _clientId;
        private readonly string _clientSecret;

        public FatSecretService(HttpClient httpClient, IConfiguration config)
        {
            _httpClient = httpClient;
            _clientId = config.GetSection("FatSecretData")["ClientId"]!;
            _clientSecret = config.GetSection("FatSecretData")["ClientSecret"]!;
        }

        private async Task<(string AccessToken, int ExpiresIn)> RequestNewAccessTokenAsync(CancellationToken cancellationToken = default)
        {
            var credentialBytes = Encoding.UTF8.GetBytes($"{_clientId}:{_clientSecret}");
            var basicValue = Convert.ToBase64String(credentialBytes);

            using var request = new HttpRequestMessage(HttpMethod.Post, "https://oauth.fatsecret.com/connect/token");
            request.Headers.Authorization = new AuthenticationHeaderValue("Basic", basicValue);

            var values = new Dictionary<string, string>
            {
                { "scope", "basic premier" },
                { "grant_type", "client_credentials" }
            };
            request.Content = new FormUrlEncodedContent(values);

            using var response = await _httpClient.SendAsync(request, cancellationToken);

            var body = await response.Content.ReadAsStringAsync(cancellationToken);

            if (!response.IsSuccessStatusCode)
            {
                throw new InvalidOperationException($"Token endpoint returned {(int)response.StatusCode}: {body}");
            }

            using var doc = JsonDocument.Parse(body);
            var root = doc.RootElement;
            var token = root.GetProperty("access_token").GetString() ?? throw new InvalidOperationException("No access_token in response");
            var expiresIn = root.TryGetProperty("expires_in", out var exEl) ? exEl.GetInt32() : 3600;

            return (token, expiresIn);
        }

        //test request
        public async Task<string> GetFoodByIdAsync(int foodId, CancellationToken cancellationToken = default)
        {
            var (token, _) = await RequestNewAccessTokenAsync(cancellationToken);

            var url = $"https://platform.fatsecret.com/rest/server.api?method=food.get&food_id={foodId}&format=json";

            using var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

            using var response = await _httpClient.SendAsync(request, cancellationToken);

            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            return content;
        }

        public async Task<string> GetFoodByNameAsync(string query, int maxResult = 10, CancellationToken cancellationToken = default)
        {
            var (token, _) = await RequestNewAccessTokenAsync(cancellationToken);
            var url = $"https://platform.fatsecret.com/rest/foods/search/v4" +
                $"?search_expression={Uri.EscapeDataString(query)}" +
                $"&max_results={maxResult}" +
                $"&format=json";

            using var request = new HttpRequestMessage(HttpMethod.Get, url);
            request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

            using var response = await _httpClient.SendAsync(request, cancellationToken);
            response.EnsureSuccessStatusCode();

            var content = await response.Content.ReadAsStringAsync(cancellationToken);
            return content;
        }
    }
}