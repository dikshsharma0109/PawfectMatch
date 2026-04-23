"""
weather_dashboard.py

Description:
- Fetches hourly temperature data from the Open-Meteo public API (no API key required)
- Produces a matplotlib dashboard with:
    * Hourly time-series for each city
    * Daily average temperature bar chart
    * City comparison chart (mean temperature over period)
- Save output as PNG and display interactively.

Prerequisites:
- Python 3.8+
- pip install requests pandas matplotlib

Usage:
- Edit the CITIES dict to include the cities you want (latitude, longitude).
- Run: python weather_dashboard.py

Note:
- This script uses Open-Meteo (https://open-meteo.com). For longer historical ranges you
  may need to adjust the API parameters. Open-Meteo allows fetching hourly historical
  data by specifying `start_date` and `end_date`.

"""

import requests
import pandas as pd
import matplotlib.pyplot as plt
from datetime import datetime, timedelta
import os

# === Configure cities (name -> (lat, lon)) ===
CITIES = {
    "New Delhi, IN": (28.6139, 77.2090),
    "Mumbai, IN": (19.0760, 72.8777),
    "Bengaluru, IN": (12.9716, 77.5946),
}

# === Helper: fetch hourly temperature for a city from Open-Meteo ===
def fetch_city_hourly_temperature(lat, lon, start_date, end_date, timezone="Asia/Kolkata"):
    """Return a DataFrame with columns ['time', 'temperature_2m'] indexed by datetime."""
    url = "https://api.open-meteo.com/v1/forecast"
    params = {
        "latitude": lat,
        "longitude": lon,
        "hourly": "temperature_2m",
        "start_date": start_date.strftime("%Y-%m-%d"),
        "end_date": (end_date.strftime("%Y-%m-%d")),
        "timezone": timezone,
    }
    resp = requests.get(url, params=params, timeout=20)
    resp.raise_for_status()
    j = resp.json()
    times = j["hourly"]["time"]
    temps = j["hourly"]["temperature_2m"]
    df = pd.DataFrame({"time": pd.to_datetime(times), "temperature_2m": temps})
    df = df.set_index("time")
    return df


# === Compose data for all cities ===
def get_cities_data(cities, days=7):
    end_date = datetime.now()
    start_date = end_date - timedelta(days=days)
    all_data = {}
    for name, (lat, lon) in cities.items():
        try:
            df = fetch_city_hourly_temperature(lat, lon, start_date, end_date)
            all_data[name] = df
            print(f"Fetched {len(df)} rows for {name}")
        except Exception as e:
            print(f"Failed to fetch for {name}: {e}")
    return all_data


# === Plot dashboard ===
def plot_dashboard(all_data, out_file="weather_dashboard.png"):
    # Time-series subplot for each city stacked vertically
    n = len(all_data)
    fig, axes = plt.subplots(n + 2, 1, figsize=(12, 4 * (n + 1)), constrained_layout=True)

    # 1) Hourly time-series
    for ax, (city, df) in zip(axes[:n], all_data.items()):
        df["temperature_2m"].plot(ax=ax)
        ax.set_title(f"Hourly temperature — {city}")
        ax.set_ylabel("°C")
        ax.grid(True)

    # 2) Daily average bar chart
    daily_avgs = []
    for city, df in all_data.items():
        daily = df["temperature_2m"].resample("D").mean()
        daily_avgs.append(daily.rename(city))
    if daily_avgs:
        daily_df = pd.concat(daily_avgs, axis=1)
        daily_df.plot(kind="bar", ax=axes[n])
        axes[n].set_title("Daily average temperature (°C)")
        axes[n].set_xlabel("Date")
        axes[n].grid(False)

    # 3) Mean temperature comparison
    means = {city: df["temperature_2m"].mean() for city, df in all_data.items()}
    axes[n + 1].bar(range(len(means)), list(means.values()))
    axes[n + 1].set_xticks(range(len(means)))
    axes[n + 1].set_xticklabels(list(means.keys()), rotation=30, ha="right")
    axes[n + 1].set_ylabel("Mean °C")
    axes[n + 1].set_title("Average temperature over period — city comparison")

    plt.savefig(out_file, dpi=150)
    print(f"Saved dashboard to {out_file}")
    plt.show()


# === Main ===
if __name__ == "__main__":
    days = 7  # last 7 days
    data = get_cities_data(CITIES, days=days)
    if data:
        plot_dashboard(data)
    else:
        print("No data to plot. Check network or API responses.")
