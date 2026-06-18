import { useRef, useState, useEffect } from "react";
import style from "./locationcard.module.css";
import LogoLocation from "@/assets/icon/location.svg";
import LogoSearch from "@/assets/icon/search.svg";
import { useJsApiLoader, Autocomplete } from "@react-google-maps/api";

interface LocationData {
  address: string;
  lat: number;
  lng: number;
}

interface LocationCardProps {
  title: string;
  label: string;
  onLocationSelect?: (data: LocationData) => void;
  cities?: string[];
  onValueChange?: (value: string) => void;
  value?: string;
}

const libraries: ("places")[] = ["places"];

// Mode 1: Google Maps Autocomplete (for choosing specific meetup coordinates/address)
function GoogleMapsLocation({
  title,
  label,
  onLocationSelect,
}: {
  title: string;
  label: string;
  onLocationSelect?: (data: LocationData) => void;
}) {
  const [searchValue, setSearchValue] = useState("");
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  const { isLoaded } = useJsApiLoader({
    googleMapsApiKey: import.meta.env.VITE_MAPS_API_KEY,
    libraries,
  });

  const onLoad = (autocomplete: google.maps.places.Autocomplete) => {
    autocompleteRef.current = autocomplete;
  };

  const onPlaceChanged = () => {
    if (autocompleteRef.current !== null) {
      const place = autocompleteRef.current.getPlace();
      const address = place.formatted_address || "";
      const lat = place.geometry?.location?.lat();
      const lng = place.geometry?.location?.lng();

      if (lat && lng) {
        setSearchValue(address);
        if (onLocationSelect) {
          onLocationSelect({ address, lat, lng });
        }
      }
    } else {
      console.log("Autocomplete is not loaded yet!");
    }
  };

  if (!isLoaded) return <div>Loading Maps...</div>;

  return (
    <div className={style.containerLocation}>
      <div className={style.header}>
        <img src={LogoLocation} alt="Location" />
        <h3 className={style.title}>{title}</h3>
      </div>

      <div className={style.searchBar}>
        <Autocomplete
          onLoad={onLoad}
          onPlaceChanged={onPlaceChanged}
          options={{ types: ["geocode"] }}
          className={style.autocompleteWrapper}
        >
          <input
            type="text"
            className={style.inputField}
            placeholder={label}
            value={searchValue}
            onChange={(e) => setSearchValue(e.target.value)}
          />
        </Autocomplete>
        <img src={LogoSearch} alt="Search" />
      </div>
    </div>
  );
}

// Mode 2: Custom Dropdown (for choosing city of residence from faker API list)
function DropdownLocation({
  title,
  label,
  cities = [],
  onValueChange,
  value = "",
}: {
  title: string;
  label: string;
  cities?: string[];
  onValueChange?: (value: string) => void;
  value?: string;
}) {
  const [searchValue, setSearchValue] = useState(value);
  const [showDropdown, setShowDropdown] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Sync internal search value when external value changes
  useEffect(() => {
    setSearchValue(value);
  }, [value]);

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setShowDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const filteredCities = cities.filter((city) =>
    city.toLowerCase().includes(searchValue.toLowerCase())
  );

  const handleSelect = (city: string) => {
    setSearchValue(city);
    setShowDropdown(false);
    if (onValueChange) {
      onValueChange(city);
    }
  };

  return (
    <div className={style.containerLocation} ref={dropdownRef}>
      <div className={style.header}>
        <img src={LogoLocation} alt="Location" />
        <h3 className={style.title}>{title}</h3>
      </div>

      <div className={style.searchBar}>
        <input
          type="text"
          className={style.inputField}
          placeholder={label}
          value={searchValue}
          onChange={(e) => {
            setSearchValue(e.target.value);
            setShowDropdown(true);
            if (onValueChange) {
              onValueChange(e.target.value);
            }
          }}
          onFocus={() => setShowDropdown(true)}
        />
        <img src={LogoSearch} alt="Search" />
      </div>

      {showDropdown && filteredCities.length > 0 && (
        <ul className={style.dropdown}>
          {filteredCities.map((city, idx) => (
            <li
              key={idx}
              className={style.dropdownItem}
              onClick={() => handleSelect(city)}
            >
              {city}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default function LocationComponent(props: LocationCardProps) {
  if (props.cities) {
    return <DropdownLocation {...props} />;
  }
  return <GoogleMapsLocation {...props} />;
}