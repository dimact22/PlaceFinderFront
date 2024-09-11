import React, { useState, useEffect, useRef } from 'react';
import loadGoogleMapsApi from '../GoogleMapsLoader';
import styles from './AddressSearch.module.css';
import Header from '../Header/Header';
import { useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';

const AddressSearch = () => {
  const { t } = useTranslation();
  const [inputValue, setInputValue] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedCheckboxes, setSelectedCheckboxes] = useState({
    apartment: false,
    room: false,
    house: false
  });
  const [error, setError] = useState('');
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);
  const radiusSelectRef = useRef(null);
  const navigate = useNavigate();
  const [google, setGoogle] = useState(null);

  useEffect(() => {
    const handleGoogleMapsLoad = (google) => {
      setGoogle(google);
      initAutocomplete(google);
    };

    loadGoogleMapsApi(handleGoogleMapsLoad);

    document.body.classList.add(styles.noScroll);

    return () => {
      document.body.classList.remove(styles.noScroll);
      if (google && google.maps && google.maps.places) {
        const input = inputRef.current;
        if (input && input.autocomplete) {
          google.maps.event.clearInstanceListeners(input.autocomplete);
        }
      }
    };
  }, [google]);

  const initAutocomplete = (google) => {
    if (google && google.maps && google.maps.places) {
      const input = inputRef.current;
      if (input) {
        const autocomplete = new google.maps.places.Autocomplete(input, {
          componentRestrictions: {}
        });

        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) {
            setInputValue(place.formatted_address);
            setFullAddress(place.formatted_address);
          }
        });

        input.autocomplete = autocomplete;
      }
    }
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setInputValue(query);
    setError('');

    if (query.length < 3) {
      setSuggestions([]);
      return;
    }

    if (google && google.maps && google.maps.places) {
      const autocompleteService = new google.maps.places.AutocompleteService();
      autocompleteService.getPlacePredictions(
        {
          input: query,
          componentRestrictions: {}
        },
        (predictions, status) => {
          if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
            setSuggestions([]);
            return;
          }

          setSuggestions(
            predictions.map((prediction) => ({
              description: prediction.description
            }))
          );
        }
      );
    }
  };

  const handleSuggestionClick = (description) => {
    setInputValue(description);
    setSuggestions([]);
    setError('');
  };

  const handleSearchClick = async () => {
    const isAnyCheckboxSelected = Object.values(selectedCheckboxes).some((checked) => checked);

    if (inputValue.length <= 2) {
      setError(t('adreesssearchError1'));
      inputRef.current.focus();
      return;
    } else if (!isAnyCheckboxSelected) {
      setError(t('adreesssearchError2'));
      return;
    }

    setError('');
    const query = fullAddress || inputValue;
    const radius = radiusSelectRef.current.value;
    const selectedFilters = Object.keys(selectedCheckboxes).filter((key) => selectedCheckboxes[key]);

    const requestData = {
      address: query,
      radius: radius,
      app_type: selectedFilters
    };
    console.log(JSON.stringify(requestData));

    try {
      const response = await fetch('http://192.168.178.61:8000/appart_search/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(requestData)
      });

      if (!response.ok) {
        throw new Error('Netzwerkfehler');
      }

      const data = await response.json();
      const rad = requestData['radius'];
      navigate('/response', { state: { query, data, rad } });
    } catch (error) {
      console.error('Fehler beim Senden der Daten:', error);
      setError('Daten konnten nicht vom Server abgerufen werden.');
    }
  };

  const handleCheckboxChange = (e) => {
    setSelectedCheckboxes({
      ...selectedCheckboxes,
      [e.target.value]: e.target.checked
    });
    setError('');
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        suggestionsRef.current &&
        !suggestionsRef.current.contains(e.target) &&
        inputRef.current &&
        !inputRef.current.contains(e.target)
      ) {
        setSuggestions([]);
      }
    };

    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.searchContainer}>
        <div className={styles.container}>
          <div className={styles.searchGroup}>
            <input
              ref={inputRef}
              type="text"
              placeholder={t('search')}
              value={inputValue}
              className={styles.searchInput}
              onChange={handleInputChange}
              autoComplete="off"
              style={{ borderColor: error && inputValue.length <= 2 ? 'red' : '' }}
            />
            <button className={styles.searchButton} onClick={handleSearchClick}>
              {t('search')}
            </button>
          </div>
          <div className={styles.filterRadius}>
            <div className={styles.filters}>
              <label
                style={{
                  color: error && !Object.values(selectedCheckboxes).some((checked) => checked) ? 'red' : ''
                }}
              >
                <input
                  type="checkbox"
                  value="apartment"
                  checked={selectedCheckboxes.apartment}
                  onChange={handleCheckboxChange}
                />
                {t('filters.apartment')}
              </label>
              <label
                style={{
                  color: error && !Object.values(selectedCheckboxes).some((checked) => checked) ? 'red' : ''
                }}
              >
                <input
                  type="checkbox"
                  value="room"
                  checked={selectedCheckboxes.room}
                  onChange={handleCheckboxChange}
                />
                {t('filters.room')}
              </label>
              <label
                style={{
                  color: error && !Object.values(selectedCheckboxes).some((checked) => checked) ? 'red' : ''
                }}
              >
                <input
                  type="checkbox"
                  value="house"
                  checked={selectedCheckboxes.house}
                  onChange={handleCheckboxChange}
                />
                {t('filters.house')}
              </label>
            </div>
            <div className={styles.radiusSelector}>
              <div className={styles.radiusLabel}>{t('selectRadius')}</div>
              <select ref={radiusSelectRef}>
                <option value="1">1 km</option>
                <option value="2">2 km</option>
                <option value="3">3 km</option>
                <option value="4">4 km</option>
                <option value="5">5 km</option>
                <option value="10">10 km</option>
                <option value="20">20 km</option>
              </select>
            </div>
          </div>
          <div ref={suggestionsRef} id="suggestions" className={styles.autocompleteSuggestions}>
            {suggestions.map((suggestion, index) => (
              <div key={index} onClick={() => handleSuggestionClick(suggestion.description)}>
                {suggestion.description}
              </div>
            ))}
          </div>
          {error && <div className={styles.errorMessage}>{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default AddressSearch;