import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProvider } from './context/AppContext';
import ProtectedRoute from './components/ProtectedRoute';
import Layout from './components/Layout';

// India Tourism Discovery Pages
import Home from './pages/Home';
import ExploreIndia from './pages/ExploreIndia';
import States from './pages/States';
import StateDetail from './pages/StateDetail';
import Cities from './pages/Cities';
import CityDetail from './pages/CityDetail';
import Attractions from './pages/Attractions';
import AttractionDetail from './pages/AttractionDetail';
import Categories from './pages/Categories';
import SearchResults from './pages/SearchResults';
import ItineraryPlanner from './pages/ItineraryPlanner';
import About from './pages/About';

// Existing Supporting Features
import Destinations from './pages/Destinations';
import Itinerary from './pages/Itinerary';
import Hotels from './pages/Hotels';
import Safety from './pages/Safety';
import Budget from './pages/Budget';
import Login from './pages/Login';
import Register from './pages/Register';
import AdminPanel from './pages/AdminPanel';

export default function App() {
  return (
    <AppProvider>
      <BrowserRouter>
        <Routes>
          {/* Public Authentication Pages */}
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Primary Tourism Discovery Platform (Open to all visitors) */}
          <Route path="/" element={<Layout />}>
            <Route index element={<Home />} />
            <Route path="explore" element={<ExploreIndia />} />
            <Route path="states" element={<States />} />
            <Route path="india/:stateSlug" element={<StateDetail />} />
            <Route path="cities" element={<Cities />} />
            <Route path="india/:stateSlug/:citySlug" element={<CityDetail />} />
            <Route path="attractions" element={<Attractions />} />
            <Route path="india/:stateSlug/:citySlug/:attractionSlug" element={<AttractionDetail />} />

            {/* Category / Theme Pages */}
            <Route path="categories" element={<Categories />} />
            <Route path="categories/:categorySlug" element={<Categories />} />
            <Route path="beaches" element={<Navigate to="/categories/beaches" replace />} />
            <Route path="hill-stations" element={<Navigate to="/categories/hill-stations" replace />} />
            <Route path="heritage" element={<Navigate to="/categories/heritage" replace />} />
            <Route path="wildlife" element={<Navigate to="/categories/wildlife" replace />} />
            <Route path="spiritual" element={<Navigate to="/categories/spiritual" replace />} />
            <Route path="adventure" element={<Navigate to="/categories/adventure" replace />} />
            <Route path="food-culture" element={<Navigate to="/categories/food" replace />} />

            {/* Search, Itinerary Planner & About */}
            <Route path="search" element={<SearchResults />} />
            <Route path="planner" element={<ItineraryPlanner />} />
            <Route path="itineraries" element={<ItineraryPlanner />} />
            <Route path="about" element={<About />} />

            {/* Travel Tools */}
            <Route path="destinations" element={<Destinations />} />
            <Route path="itinerary" element={<Itinerary />} />
            <Route path="hotels" element={<Hotels />} />
            <Route path="safety" element={<Safety />} />
            <Route path="budget" element={<Budget />} />

            {/* Administrative HUD & Dashboard */}
            <Route
              path="admin"
              element={
                <ProtectedRoute requireAdmin={true}>
                  <AdminPanel />
                </ProtectedRoute>
              }
            />
          </Route>

          {/* Catch-all Fallback to Home */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </BrowserRouter>
    </AppProvider>
  );
}

