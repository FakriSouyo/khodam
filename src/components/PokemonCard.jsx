import React, { useRef, useEffect, useState } from 'react';
import Swal from 'sweetalert2';
import { Button } from "../components/ui/button";
import LogoImage from "../assets/logo.png";
import BackImage from "../assets/backImg.jpg";

const PokemonCard = ({ pokemon, userName, onClose }) => {
  const cardRef = useRef(null);
  const [isRendered, setIsRendered] = useState(false);
  const [loadingImages, setLoadingImages] = useState(true); // Loading state for images

  useEffect(() => {
    const loadImages = async () => {
      try {
        const [defaultImg, logoImg, backImg] = await Promise.all([
          loadImage(pokemon.sprites.front_default),
          loadImage(LogoImage),
          loadImage(BackImage)
        ]);

        if (cardRef.current) {
          cardRef.current.querySelector('#main-img').src = defaultImg.src;
          cardRef.current.querySelector('#logo-img').src = logoImg.src;
          cardRef.current.style.backgroundImage = `url(${backImg.src})`;
          setIsRendered(true);
        }
      } catch (error) {
        console.error("Failed to load images:", error);
      } finally {
        setLoadingImages(false); // Mark loading as complete, regardless of success or failure
      }
    };

    loadImages();
  }, [pokemon]);

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  };

  const handleButtonClick = () => {
    Swal.fire({
      title: 'maaf ya untuk sekarang belum bisa download, aku masih belajar jadi cuman bisa screenshot, terimakasih ',
      text: `tapi tetep punya ${pokemon.name}!`,
      showConfirmButton: false,
      timer: 9000,
      timerProgressBar: true,
    });
  };

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="relative" style={{ backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '300px' }}>
          <div ref={cardRef} id="pokemon-card" className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="text-xs text-white flex flex-col items-start">
                <span>powered by</span>
                <img id="logo-img" src={LogoImage} alt="Pokemon Logo" className="mt-1 w-16 h-auto" />
              </div>
              <div className="text-right">
                <div className="text-xs mt-1 text-white font-mono">ID: {pokemon.id}</div>
              </div>
            </div>

            <div className="relative rounded-lg overflow-hidden mb-4 aspect-w-1 aspect-h-1 shadow-lg hover:shadow-lg">
              <img
                id="main-img"
                src=""
                alt={pokemon.name}
                className="object-cover w-full h-full"
                style={{ border: 'none' }}
              />
            </div>

            <div className="text-xs font-bold font-mono mb-2 text-white lowercase text-center">
              {userName} khodam:
            </div>

            <div className="text-lg font-extrabold text-center rounded-xl border shadow dark:text-gray-50 w-full bg-gray-800 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border-gray-100 text-black capitalize font-mono mb-4">
              {pokemon.name}
            </div>
          </div>
        </div>
        <div className="mt-6 flex justify-center space-x-4 p-4">
          <Button
            onClick={handleButtonClick}
            className="px-6 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600"
            disabled={!isRendered || loadingImages} // Disable button while images are loading
          >
            download
          </Button>
          <Button
            onClick={onClose}
            variant="secondary"
            className="px-6 py-2 bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
          >
            Close
          </Button>
        </div>
      </div>
    </div>
  );
};

export default PokemonCard;
