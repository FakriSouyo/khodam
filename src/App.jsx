import React, { useState } from "react";
import { Button } from "../src/components/ui/button";
import { Input } from "../src/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "../src/components/ui/card";
import { Calendar } from "../src/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "../src/components/ui/popover";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import Spinner from "../src/components/ui/Spinner";
import PokemonCard from "../src/components/PokemonCard";

// Import the background image
import backgroundImage from "../src/assets/pokemonbg.jpg";
import twitterX from "../src/assets/twitterx.png"; // Make sure this path is correct


export default function App() {
  const [name, setName] = useState("");
  const [date, setDate] = useState();
  const [pokemon, setPokemon] = useState(null);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [showCard, setShowCard] = useState(false);

  const disableFutureDates = (date) => {
    return date > new Date();
  };
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 100 }, (_, i) => currentYear - i);

  async function generateKhodam() {
    if (!name || !date) {
      alert("Masukan Nama dan Tanggal Lahir");
      return;
    }

    setIsLoading(true);

    try {
      const randomId = Math.floor(Math.random() * 898) + 1;
      const res = await fetch(`https://pokeapi.co/api/v2/pokemon/${randomId}`);
      const data = await res.json();
      setPokemon(data);
      setIsGenerating(true);
    } catch (error) {
      console.error("Error fetching Pokémon:", error);
      alert("Error generating Pokémon. Please try again.");
    } finally {
      setIsLoading(false);
    }
  }

  function resetForm() {
    setName("");
    setDate(undefined);
    setPokemon(null);
    setIsGenerating(false);
  }

  const handleShare = () => {
    setShowCard(true);
  };

  const handleCloseCard = () => {
    setShowCard(false);
  };

  return (
    <div className="relative min-h-screen bg-background flex flex-col items-center justify-center p-4">
      <div 
        className="absolute inset-0"
        style={{ 
          backgroundImage: `url(${backgroundImage})`, 
          backgroundSize: 'cover', 
          backgroundPosition: 'center',
          filter: 'brightness(0.5) contrast(1.2)',
          zIndex: -1
        }}
      />
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold text-white text-center">Your Isékai Khodam</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Input
              type="text"
              placeholder="Masukan Nama"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={isGenerating || isLoading}
            />
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left bg-black font-normal font-mono ${!date && "text-muted-foreground"}`}
                  disabled={isGenerating || isLoading}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : <span>Pilih Tanggal Lahir</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <div className="calendar-container" style={{ height: '300px' }}>
                  <Calendar
                    mode="single"
                    selected={date}
                    onSelect={setDate}
                    initialFocus
                    disabled={disableFutureDates} 
                    renderCustomHeader={({ date: headerDate, decreaseYear, increaseYear }) => (
                      <div className="flex justify-center pt-1">
                        <Select
                          value={headerDate.getFullYear().toString()}
                          onValueChange={(year) => {
                            const newDate = new Date(headerDate);
                            newDate.setFullYear(parseInt(year));
                            setDate(newDate);
                          }}
                        >
                          <SelectTrigger>
                            <SelectValue>{headerDate.getFullYear()}</SelectValue>
                          </SelectTrigger>
                          <SelectContent position="popper">
                            {years.map((year) => (
                              <SelectItem key={year} value={year.toString()}>
                                {year}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}
                  />
                </div>
              </PopoverContent>
            </Popover>
            <Button 
              onClick={isGenerating ? resetForm : generateKhodam} 
              className="w-full"
              disabled={isLoading}
            >
              {isLoading ? <Spinner /> : isGenerating ? "Ulangi Lagi" : "Check"}
            </Button>
          </div>

          {pokemon && (
            <div className="mt-8 text-center">
              <h2 className="text-xl font-extralight mb-2 font-mono lowercase">khodam {name} adalah:</h2>
              <h3 className="font-name text-2xl font-bold text-primary mb-4 capitalize">{pokemon.name}</h3>
              <img 
                src={pokemon.sprites.front_default} 
                alt={pokemon.name} 
                className="mx-auto" 
                style={{ width: '200px', height: '200px', objectFit: 'contain' }}
              />
              <Button onClick={handleShare} className="mt-4 font-mono">
                Share
              </Button>
            </div>
          )}
        </CardContent>
      </Card>

      {showCard && (
        <PokemonCard
          pokemon={pokemon}
          userName={name}
          onClose={handleCloseCard}
        />
      )}

      <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex items-center space-x-2">
        <span className="text-sm text-white font-mono">made with ❤️</span>
        <a href="https://x.com/ineeddsleep" target="_blank" >
          <img src={twitterX} alt="Twitter" className="w-6 h-6" />
        </a>
      </div>
    </div>
  );
}
