const request = require("request")

const forecast = (longitude, latitude, callback) => {
    const url = `https://api.weatherstack.com/current?access_key=${process.env.WEATHERSTACK_KEY}&query=${longitude},${latitude}&units=f`

    request({ url, json: true }, (error, {body}) => {
        if (error) {
            callback("Unable to connect to weather service", undefined)
        } else if (body.error) {
            callback("Unable to find location", undefined)
        } else {
            
            const current = body.current;
            const location = body.location;
            const forecast = body.forecast?.forecastday?.[0];
            
            // Current conditions
            const weatherDesc = current.weather_descriptions[0];
            const temp = Math.round(current.temperature);
            const feelsLike = Math.round(current.feelslike);
            const humidity = current.humidity;
            const windSpeed = Math.round(current.wind_speed);
            const precipChance = forecast?.day?.daily_chance_of_rain || 0;
            const high = forecast ? Math.round(forecast.day.maxtemp) : null;
            const low = forecast ? Math.round(forecast.day.mintemp) : null;
            
            // Build output
            let output = [];
            
            // Location & time
            output.push(`📍 ${location.name}, ${location.country}`);
            output.push(`📅 ${new Date().toLocaleDateString('en-US', { weekday: 'long', month: 'long', day: 'numeric' })}`);
            output.push(`🕐 ${current.observation_time}`);
            output.push('─'.repeat(40));
            
            // Current weather summary
            output.push(`\n☁️ Currently: ${weatherDesc}`);
            output.push(`🌡️ Temperature: ${temp}°F (feels like ${feelsLike}°F)`);
            
            // Temperature range
            if (high && low) {
                output.push(`📊 Range: High ${high}°F / Low ${low}°F`);
            }
            
            // Rain forecast
            if (precipChance > 0) {
                output.push(`🌧️ Rain Chance: ${precipChance}% - ${precipChance > 60 ? 'Rain likely' : 'Slight chance of rain'}`);
            } else {
                output.push(`☀️ Rain: No rain expected today`);
            }
            
            // Additional useful info
            output.push(`💧 Humidity: ${humidity}%`);
            output.push(`🌬️ Wind: ${windSpeed} mph`);
            
            callback(undefined, output.join('\n'));

            // callback(undefined, body.current.weather_descriptions[0] + ". It is currently " + body.current.temperature + " degrees out. It feels like " + body.current.feelslike + " degrees out.")
        }
    })
}

module.exports = forecast
