import { useRef, useState, useEffect, useCallback } from "react";

import Places from "./components/Places.jsx";
import { AVAILABLE_PLACES } from "./data.js";
import Modal from "./components/Modal.jsx";
import DeleteConfirmation from "./components/DeleteConfirmation.jsx";
import logoImg from "./assets/logo.png";
import { sortPlacesByDistance } from "./loc.js";

const storeIds = JSON.parse(localStorage.getItem("selectedPlace")) || [];
const storedPlaces = storeIds.map((id) =>
  AVAILABLE_PLACES.find((place) => place.id === id)
);

function App() {
  const modal = useRef();
  const selectedPlace = useRef();
  const [availablePlaces, setvailablePlaces] = useState([]);
  const [pickedPlaces, setPickedPlaces] = useState(storedPlaces);
  const [openModal, setOpenModal] = useState(false);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition((position) => {
      const { lat, lag } = position.coords;
      const sortedPlaces = sortPlacesByDistance(AVAILABLE_PLACES, lat, lag);
      setvailablePlaces(sortedPlaces);
    });
  }, []);

  function handleStartRemovePlace(id) {
    setOpenModal(true);
    selectedPlace.current = id;
  }

  function handleStopRemovePlace() {
    setOpenModal(false);
  }

  function handleSelectPlace(id) {
    setPickedPlaces((prevPickedPlaces) => {
      if (prevPickedPlaces.some((place) => place.id === id)) {
        return prevPickedPlaces;
      }
      const place = AVAILABLE_PLACES.find((place) => place.id === id);
      return [place, ...prevPickedPlaces];
    });

    const storeIds = JSON.parse(localStorage.getItem("selectedPlace")) || [];
    if (storeIds.indexOf(id) === -1) {
      localStorage.setItem("selectedPlace", JSON.stringify([id, ...storeIds]));
    }
  }

  const handleRemovePlace = useCallback(function handleRemovePlace() {
    setPickedPlaces((prevPickedPlaces) =>
      prevPickedPlaces.filter((place) => place.id !== selectedPlace.current)
    );
    setOpenModal(false);

    const storeIds = JSON.parse(localStorage.getItem("selectedPlace")) || [];
    localStorage.setItem(
      "selectedPlace",
      JSON.stringify(storeIds.filter((id) => id !== selectedPlace.current))
    );
  }, []);

  return (
    <>
      <Modal ref={modal} open={openModal}>
        {openModal && (
          <DeleteConfirmation
            onCancel={handleStopRemovePlace}
            onConfirm={handleRemovePlace}
          />
        )}
      </Modal>

      <header>
        <img src={logoImg} alt="Stylized globe" />
        <h1>PlacePicker</h1>
        <p>
          Create your personal collection of places you would like to visit or
          you have visited.
        </p>
      </header>
      <main>
        <Places
          title="I'd like to visit ..."
          fallbackText={"Select the places you would like to visit below."}
          places={pickedPlaces}
          onSelectPlace={handleStartRemovePlace}
        />
        <Places
          title="Available Places"
          places={availablePlaces}
          fallbackText="Sorting places by distance... "
          onSelectPlace={handleSelectPlace}
        />
      </main>
    </>
  );
}

export default App;
