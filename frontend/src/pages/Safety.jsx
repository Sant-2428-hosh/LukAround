import React, { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import TouristSafetyDirectory from '../components/safety/TouristSafetyDirectory';

export default function Safety() {
  const { selectedCity, setSelectedCity } = useApp();
  const [searchParams] = useSearchParams();

  const cityParam = searchParams.get('city') || selectedCity || '';
  const stateParam = searchParams.get('state') || '';
  const destinationParam = searchParams.get('destination') || searchParams.get('attraction') || searchParams.get('id') || '';

  useEffect(() => {
    if (cityParam && cityParam !== selectedCity) {
      setSelectedCity(cityParam);
    }
  }, [cityParam, selectedCity, setSelectedCity]);

  return (
    <div
      style={{
        backgroundColor: 'var(--tourism-sand, #FBF9F5)',
        minHeight: '88vh',
        padding: '3rem 0 5rem 0'
      }}
    >
      <TouristSafetyDirectory
        initialCity={cityParam}
        initialState={stateParam}
        destinationId={destinationParam}
        showHeader={true}
        isEmbedded={false}
      />
    </div>
  );
}
