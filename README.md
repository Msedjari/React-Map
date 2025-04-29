# 🏟️ SportifFields Finder - Weather & Fields Map

## 📋 Overview
SportifFields Finder is an interactive React application that helps sportifFields enthusiasts find nearby fields while checking current weather conditions. Perfect for planning your next game or practice session with real-time weather insights and detailed sportifFields field information.

## ✨ Features

- 🗺️ **Interactive Map** - Powered by react-leaflet with intuitive navigation
- 🏟️ **SportifFields Field Finder** - Discover nearby sportifFields fields with comprehensive details
- 🌦️ **Real-time Weather Data** - Check current weather conditions at any location
- 📱 **Responsive Design** - Works seamlessly on desktop and mobile devices
- 🔍 **Search Functionality** - Find locations by city name
- 📍 **Geolocation Support** - Use your current location to find fields near you

## 🔧 Technical Stack

- ⚛️  **React** with TypeScript for a robust frontend
- 🛠️ **Vite** as the build tool for lightning-fast development
- 🗺️ **react-leaflet** for mapping functionality
- 🔄 **Axios** for API requests
- 🧩 **Custom CSS** for a sleek, modern interface

## 📡 APIs Used

- 🌤️ **WeatherAPI.com** - Provides comprehensive weather information
- 📊 **Foursquare API** - Locates sportifFields fields and sports venues
- 🌎 **OpenStreetMap Nominatim** - For geocoding and location search

## 🚀 Setup and Installation

1. **Clone the repository**:
   ```bash
   git clone https://github.com/yourusername/sportif-fields-finder.git
   cd sportif-fields-finder
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure API Keys**:
   - Get an API key from [WeatherAPI.com](https://www.weatherapi.com/)
   - Get an API key from [Foursquare](https://developer.foursquare.com/)
   - Create a `.env` file in the root directory with:
     ```
     VITE_WEATHER_API_KEY=your_weather_api_key
     VITE_FOURSQUARE_API_KEY=your_foursquare_api_key
     ```

4. **Start the development server**:
   ```bash
   npm run dev
   ```

## 📖 How to Use

- 🔍 Search for a city using the search bar
- 📍 Click the location button to use your current location
- 🗺️ Click anywhere on the map to see weather data and nearby sportifFields fields
- ⚽ Select a sportifFields field from the list to center the map on it
- 🌤️ View detailed weather information in the weather panel

## 🏗️ Project Structure

- `src/components/Map.tsx` - Interactive map component using react-leaflet
- `src/components/WeatherDisplay.tsx` - Displays weather information
- `src/components/SportifFields.tsx` - Lists sportifFields fields with details
- `src/components/SearchBar.tsx` - Search functionality for locations
- `src/services/api.ts` - Service for API requests to weather and field data
- `src/App.tsx` - Main application component integrating all features

## 🎯 Future Enhancements

- 📅 Booking integration for reserving fields
- 👥 User reviews and ratings for fields
- 📱 Native mobile app versions
- 📊 Advanced statistics for field availability
- 🌙 Dark mode support


## 🙏 Acknowledgements

- [react-leaflet](https://react-leaflet.js.org/) for the mapping library
- [WeatherAPI.com](https://www.weatherapi.com/) for weather data
- [Foursquare](https://developer.foursquare.com/) for field location data
- [OpenStreetMap](https://www.openstreetmap.org/) for map data
