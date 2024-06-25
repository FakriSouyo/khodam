import React, { useRef, useEffect, useState } from 'react';
import html2canvas from 'html2canvas';
import { Button } from "../components/ui/button";
import LogoImage from "../assets/logo.png";
import BackImage from "../assets/backImg.jpg";

const PokemonCard = ({ pokemon, userName, onClose }) => {
  const cardRef = useRef(null);
  const [isRendered, setIsRendered] = useState(false);
  const [loadingImages, setLoadingImages] = useState(true);

  useEffect(() => {
    const loadImages = async () => {
      try {
        const [defaultImg, logoImg, backImg] = await Promise.all([
          loadImage(pokemon.sprites.front_default),
          loadImage(LogoImage),
          loadImage(BackImage)
        ]);

        if (cardRef.current) {
          const mainImg = cardRef.current.querySelector('#main-img');
          const logoImgElement = cardRef.current.querySelector('#logo-img');
          mainImg.src = defaultImg.src;
          logoImgElement.src = logoImg.src;
          cardRef.current.style.backgroundImage = `url(${backImg.src})`;
          setIsRendered(true);
        }
      } catch (error) {
        console.error("Failed to load images:", error);
      } finally {
        setLoadingImages(false);
      }
    };

    loadImages();
  }, [pokemon]);

  const loadImage = (src) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.crossOrigin = "anonymous";
      img.onload = () => resolve(img);
      img.onerror = () => reject(new Error(`Failed to load image: ${src}`));
      img.src = src;
    });
  };

  const captureCard = () => {
    const card = cardRef.current;
    if (!card) return;
  
    html2canvas(card, {
      useCORS: true,
      allowTaint: true,
      scrollY: 0, // Set scrollY to 0 to ensure capturing from the top
      windowWidth: card.clientWidth, // Specify window width for accurate capture
      windowHeight: card.clientHeight, // Specify window height for accurate capture
    }).then(canvas => {
      const image = canvas.toDataURL("image/png");
      const link = document.createElement('a');
      link.href = image;
      link.download = `${userName}_khodam_${pokemon.name}.png`;
      link.click();
    });
  };

  return (
    <div className="fixed inset-0 bg-gray-700 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 flex flex-col items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-md overflow-hidden max-w-sm w-full mb-4">
        <div className="relative" style={{ backgroundSize: 'cover', backgroundPosition: 'center', minHeight: '300px' }}>
          <div ref={cardRef} id="pokemon-card" className="p-6">
            <div className="flex justify-between items-start mb-4">
              <div className="text-xs text-black flex flex-col items-start">
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

            <div className="text-xs font-bold font-mono mb-2 text-black lowercase text-center">
              {userName} khodam:
            </div>

            <div className="text-lg font-extrabold text-center rounded-xl border shadow dark:text-gray-50 w-full bg-gray-800 bg-clip-padding backdrop-filter backdrop-blur-sm bg-opacity-10 border-gray-100 text-black capitalize font-mono mb-4 p-2 overflow-hidden">
              <span className="block truncate">{pokemon.name}</span>
            </div>
          </div>
        </div>
      </div>
      
      <div className="flex justify-center space-x-4 font-mono">
        <Button
          onClick={captureCard}
          className="px-6 py-2 bg-black text-white rounded-md hover:bg-gray-500 font-mono"
          disabled={!isRendered || loadingImages}
        >
          Download Card
        </Button>
        <Button
          onClick={onClose}
          variant="secondary"
          className="px-6 py-2 font-mono bg-gray-300 text-gray-700 rounded-md hover:bg-gray-400"
        >
          tutup
        </Button>
      </div>
    </div>
  );
};

export default PokemonCard;