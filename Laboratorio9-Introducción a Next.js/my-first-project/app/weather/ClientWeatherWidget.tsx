'use client'

import { useState, useEffect } from 'react'
import axios from 'axios'

export default function ClientWeatherWidget() {
  const [weather, setWeather] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [city, setCity] = useState('Tokyo')

  const cities = {
    Tokyo: { lat: 35.6762, lon: 139.6503 },
    'New York': { lat: 40.7128, lon: -74.0060 },
    London: { lat: 51.5074, lon: -0.1278 },
    Sydney: { lat: -33.8688, lon: 151.2093 }
  }

  useEffect(() => {
    const fetchWeather = async () => {
      setLoading(true)
      const coords = cities[city as keyof typeof cities]
      const response = await axios.get(
        `https://api.open-meteo.com/v1/forecast?latitude=${coords.lat}&longitude=${coords.lon}&current_weather=true`
      )
      setWeather(response.data)
      setLoading(false)
    }
    fetchWeather()
  }, [city])

  return (
    <div className="bg-background/90 backdrop-blur rounded-2xl shadow-lg p-6 border border-foreground/10">
      <div className="flex items-center gap-2 mb-4">
        <div className="w-3 h-3 bg-foreground rounded-full animate-pulse"></div>
        <h2 className="text-2xl font-bold">Mundo - CSR</h2>
      </div>

      <select 
        value={city}
        onChange={(e) => setCity(e.target.value)}
        className="w-full p-3 mb-4 border border-foreground/20 rounded-lg font-medium hover:border-foreground/40 bg-background"
      >
        {Object.keys(cities).map(c => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>

      {loading ? (
        <div className="text-center py-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-4 border-foreground mx-auto"></div>
        </div>
      ) : (
        <>
          <div className="text-6xl font-bold mb-2">
            {weather?.current_weather.temperature}°C
          </div>
          <p className="text-foreground/70">
            Viento: {weather?.current_weather.windspeed} km/h
          </p>
        </>
      )}

      <div className="mt-4 p-3 bg-foreground/5 rounded-lg border border-foreground/15">
        <p className="text-xs text-foreground/80">
          🔄 Datos actualizados dinámicamente - Interactividad total
        </p>
      </div>
    </div>
  )
}
