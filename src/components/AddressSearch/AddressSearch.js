import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import styles from './AddressSearch.module.css';
import Header from '../Header/Header';
import loadGoogleMapsApi from '../../GoogleMapsLoader';
import searchIcon from './search.svg';

const AddressSearch = () => {
  const [inputValue, setInputValue] = useState('');
  const [fullAddress, setFullAddress] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [recentSearches, setRecentSearches] = useState([]);
  const [error, setError] = useState('');
  const suggestionsRef = useRef(null);
  const inputRef = useRef(null);
  const radiusSelectRef = useRef(null);
  const navigate = useNavigate();
  const [google, setGoogle] = useState(null);

  useEffect(() => {
    const handleGoogleMapsLoad = (google) => {
      setGoogle(google);
    };
    loadGoogleMapsApi(handleGoogleMapsLoad);

    const savedSearches = JSON.parse(localStorage.getItem('recentSearches')) || [];
    setRecentSearches(savedSearches);

    return () => {
      document.body.classList.remove(styles.noScroll);
    };
  }, []);

  const saveRecentSearch = (search) => {
    const updatedSearches = [search, ...recentSearches].slice(0, 5);
    setRecentSearches(updatedSearches);
    localStorage.setItem('recentSearches', JSON.stringify(updatedSearches));
  };

  const handleInputChange = (e) => {
    const query = e.target.value;
    setInputValue(query);
    setError('');

    if (query.length < 2) {
      setSuggestions(recentSearches.map(search => ({
        description: search,
      })));
      return;
    }

    if (google && google.maps && google.maps.places) {
      const autocompleteService = new google.maps.places.AutocompleteService();
      autocompleteService.getPlacePredictions({
        input: query,
        componentRestrictions: { country: 'ua' },
      }, (predictions, status) => {
        if (status !== google.maps.places.PlacesServiceStatus.OK || !predictions) {
          setSuggestions([]);
          return;
        }
        setSuggestions(predictions.map(prediction => ({
          description: prediction.description,
        })));
      });
    }
  };

  const handleSuggestionClick = (description) => {
    setInputValue(description);
    setFullAddress(description);
    setSuggestions([]);
    saveRecentSearch(description);
  };

  const handleSearchClick = () => {
    if (inputValue.length <= 2) {
      setError('Введіть хоча б 3 символи для пошуку.');
      inputRef.current.focus();
      return;
    }

    const query = fullAddress || inputValue;
    const radius = radiusSelectRef.current.value;

    const searchParams = new URLSearchParams({
      address: query,
      radius: radius,
    });
    navigate(`/response?${searchParams.toString()}`);
  };

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (suggestionsRef.current && !suggestionsRef.current.contains(e.target) &&
        inputRef.current && !inputRef.current.contains(e.target)) {
        setSuggestions([]);
      }
    };
    document.addEventListener('click', handleClickOutside);
    return () => document.removeEventListener('click', handleClickOutside);
  }, []);

  const handleInputFocus = () => {
    if (inputValue === '') {
      setSuggestions(recentSearches.map(search => ({
        description: search,
      })));
    }
  };

  return (
    <div className={styles.pageContainer}>
      <Header />
      <div className={styles.searchContainer}>
        <div className={styles.container}>
          <div className={styles.searchGroup}>
            <h1>Знайди своє житло!</h1>
            <div className={styles.inputWithSelect}>
              <input
                ref={inputRef}
                type="text"
                placeholder="Місце, місто, адреса, поштовий індекс"
                value={inputValue}
                className={styles.searchInput}
                onChange={handleInputChange}
                onFocus={handleInputFocus}
                autoComplete="off"
                style={{ borderColor: error && inputValue.length <= 2 ? 'red' : '' }}
              />
              {suggestions.length > 0 && (
                <div ref={suggestionsRef} id="suggestions" className={styles.autocompleteSuggestions}>
                  {suggestions.map((suggestion, index) => (
                    <div key={index} onClick={() => handleSuggestionClick(suggestion.description)}>
                      {suggestion.description}
                    </div>
                  ))}
                </div>
              )}
              <select ref={radiusSelectRef} className={styles.radiusSelect}>
                <option value="0">Все місто</option>
                <option value="1">1 км</option>
                <option value="2">2 км</option>
                <option value="3">3 км</option>
                <option value="4">4 км</option>
                <option value="5">5 км</option>
                <option value="10">10 км</option>
                <option value="20">20 км</option>
              </select>
              <button className={styles.searchButton} onClick={handleSearchClick}>
                <img src={searchIcon} alt="Пошук" className={styles.searchIcon} />
              </button>
            </div>
          </div>
          {error && <div className={styles.errorMessage}>{error}</div>}
        </div>
      </div>
    </div>
  );
};

export default AddressSearch;
