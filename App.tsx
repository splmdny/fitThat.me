import React, { useState, useCallback, useMemo, useEffect } from 'react';
import type { BaseImage, ClothingItem } from './types';
import { ImageUploader } from './components/ImageUploader';
import { runVirtualTryOn, generatePlaceholderImage } from './services/geminiService';
import { Tutorial } from './components/Tutorial';

const Header: React.FC = () => (
  <header className="py-4 px-4 sm:px-8 border-b border-zinc-700 bg-zinc-900 flex items-center justify-between">
    <div className="text-white">
      <h1 className="text-4xl font-bold tracking-tighter">FitThat.Me</h1>
      <p className="text-amber-400 text-sm tracking-wide">fit your own style on-the-go</p>
    </div>
    <p className="text-zinc-400 text-sm hidden sm:block mt-1">AI-Powered Virtual Try-On</p>
  </header>
);

const LoadingIndicator: React.FC<{ loadingMessage: string }> = ({ loadingMessage }) => (
  <div className="absolute inset-0 bg-zinc-900 bg-opacity-80 backdrop-blur-sm flex flex-col items-center justify-center space-y-4 rounded-xl z-10">
    <svg className="animate-spin h-10 w-10 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
    </svg>
    <p className="text-zinc-200 font-semibold text-lg animate-pulse">{loadingMessage}</p>
  </div>
);

const AddClothingItem: React.FC<{ onAdd: (item: Omit<ClothingItem, 'id'>) => void }> = ({ onAdd }) => {
  const [image, setImage] = useState<{ base64: string; mimeType: string } | null>(null);
  const [description, setDescription] = useState('');
  const [uploaderKey, setUploaderKey] = useState(Date.now());

  const handleAdd = () => {
    if (image && description) {
      onAdd({ ...image, description });
      setImage(null);
      setDescription('');
      setUploaderKey(Date.now()); // Reset the uploader by changing its key
    }
  };
  
  const canAdd = useMemo(() => image && description.trim().length > 2, [image, description]);

  return (
    <div className="space-y-4 p-4 bg-zinc-900 rounded-xl border border-zinc-700 shadow-sm">
      <ImageUploader
        key={uploaderKey}
        onImageUpload={(base64, mimeType) => setImage({ base64, mimeType })}
        title="Upload Clothing"
        aspectRatio="aspect-square"
      />
      <input
        type="text"
        value={description}
        onChange={(e) => setDescription(e.target.value)}
        placeholder="E.g., 'Blue denim jacket'"
        className="w-full bg-zinc-800 border-zinc-600 text-white rounded-md px-3 py-2 focus:ring-2 focus:ring-amber-500 focus:border-amber-500 outline-none transition"
      />
      <button
        onClick={handleAdd}
        disabled={!canAdd}
        className="w-full bg-amber-600 text-white font-bold py-2 px-4 rounded-md disabled:bg-zinc-700 disabled:cursor-not-allowed hover:bg-amber-700 transition-all"
      >
        Add Item
      </button>
    </div>
  );
};


const App: React.FC = () => {
  const [userImage, setUserImage] = useState<BaseImage | null>(null);
  const [isHeadshot, setIsHeadshot] = useState(false);
  const [clothingItems, setClothingItems] = useState<ClothingItem[]>([]);
  const [resultImage, setResultImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loadingMessage, setLoadingMessage] = useState('');
  const [placeholderImage, setPlaceholderImage] = useState<string | null>(null);
  const [isPlaceholderLoading, setIsPlaceholderLoading] = useState(true);
  const [showTutorial, setShowTutorial] = useState(true);

  const loadingMessages = useMemo(() => [
    "Warming up the virtual dressing room...",
    "Creating your base model...",
    "Selecting the perfect threads...",
    "Tailoring the fit with AI precision...",
    "Adding the final touches...",
    "Almost ready for your debut...",
    "Generating your new look..."
  ], []);

  useEffect(() => {
    let interval: number | undefined;
    if (isLoading) {
      setLoadingMessage(loadingMessages[0]);
      let i = 1;
      interval = setInterval(() => {
        setLoadingMessage(loadingMessages[i % loadingMessages.length]);
        i++;
      }, 3000) as unknown as number;
    }
    return () => clearInterval(interval);
  }, [isLoading, loadingMessages]);

  useEffect(() => {
    const initPlaceholder = async () => {
        try {
            const image = await generatePlaceholderImage();
            setPlaceholderImage(image);
        } catch (err) {
            console.error("Failed to generate placeholder image:", err);
        } finally {
            setIsPlaceholderLoading(false);
        }
    };
    initPlaceholder();
  }, []);

  const handleUserImageUpload = useCallback((base64: string, mimeType: string) => {
    setUserImage({ base64, mimeType });
  }, []);

  const addClothingItem = useCallback((item: Omit<ClothingItem, 'id'>) => {
    setClothingItems(prev => [...prev, { ...item, id: Date.now() }]);
  }, []);

  const removeClothingItem = useCallback((id: number) => {
    setClothingItems(prev => prev.filter(item => item.id !== id));
  }, []);

  const handleGenerate = async () => {
    if (!userImage) {
      setError("Please upload your image to get started.");
      return;
    }
    setIsLoading(true);
    setError(null);
    setResultImage(null);

    try {
      const generatedImage = await runVirtualTryOn(userImage, clothingItems, isHeadshot);
      setResultImage(generatedImage);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : "An unknown error occurred.");
    } finally {
      setIsLoading(false);
    }
  };
  
  const canGenerate = useMemo(() => userImage && !isLoading, [userImage, isLoading]);

  return (
    <div className="min-h-screen text-zinc-200 font-sans bg-gray-800">
      <Header />
      <main className="p-4 sm:p-8">
        {showTutorial && <Tutorial onDismiss={() => setShowTutorial(false)} />}
        {error && (
          <div className="bg-red-900/20 border border-red-500 text-red-300 px-4 py-3 rounded-xl relative mb-6" role="alert">
            <strong className="font-bold">Error: </strong>
            <span className="block sm:inline">{error}</span>
            <span className="absolute top-0 bottom-0 right-0 px-4 py-3" onClick={() => setError(null)}>
              <svg className="fill-current h-6 w-6 text-red-400 cursor-pointer" role="button" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><title>Close</title><path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.819l-2.651 3.029a1.2 1.2 0 1 1-1.697-1.697l2.758-3.15-2.759-3.152a1.2 1.2 0 1 1 1.697-1.697L10 8.183l2.651-3.031a1.2 1.2 0 1 1 1.697 1.697l-2.758 3.152 2.758 3.15a1.2 1.2 0 0 1 0 1.698z"/></svg>
            </span>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          
          {/* Column 1: User Image */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">1. Your Picture</h2>
            <ImageUploader onImageUpload={handleUserImageUpload} title="Upload Your Photo" aspectRatio="aspect-[3/4]" />
            {userImage && (
              <div className="bg-zinc-900 p-4 rounded-xl space-y-2 border border-zinc-700 shadow-sm">
                  <p className="text-sm font-medium text-zinc-300">Is this a headshot only?</p>
                   <div className="flex items-center space-x-4">
                      <label className="flex items-center cursor-pointer">
                        <input type="radio" name="imageType" checked={!isHeadshot} onChange={() => setIsHeadshot(false)} className="form-radio h-4 w-4 text-amber-500 bg-zinc-800 border-zinc-600 focus:ring-amber-500" />
                        <span className="ml-2 text-zinc-300">Full Body</span>
                      </label>
                      <label className="flex items-center cursor-pointer">
                        <input type="radio" name="imageType" checked={isHeadshot} onChange={() => setIsHeadshot(true)} className="form-radio h-4 w-4 text-amber-500 bg-zinc-800 border-zinc-600 focus:ring-amber-500" />
                        <span className="ml-2 text-zinc-300">Headshot</span>
                      </label>
                   </div>
              </div>
            )}
          </div>

          {/* Column 2: Clothing Items */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">2. Clothing Items</h2>
            <AddClothingItem onAdd={addClothingItem} />
            <div className="space-y-3 max-h-96 overflow-y-auto pr-2">
              {clothingItems.map(item => (
                <div key={item.id} className="flex items-center bg-zinc-900 p-2 rounded-lg space-x-4 border border-zinc-700 shadow-sm">
                  <img src={`data:${item.mimeType};base64,${item.base64}`} alt={item.description} className="w-16 h-16 object-cover rounded-md" />
                  <p className="flex-grow text-zinc-300">{item.description}</p>
                  <button onClick={() => removeClothingItem(item.id)} className="text-zinc-500 hover:text-red-500 transition-colors p-1">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" /></svg>
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Column 3: Result */}
          <div className="space-y-4">
            <h2 className="text-xl font-bold text-white">3. Your New Look</h2>
            <div className="relative aspect-[3/4] bg-zinc-900 rounded-xl border border-zinc-700 flex items-center justify-center overflow-hidden shadow-sm">
              {isLoading && <LoadingIndicator loadingMessage={loadingMessage} />}
              
              {!isLoading && resultImage && (
                <img src={resultImage} alt="Generated result" className="object-contain w-full h-full" />
              )}

              {!isLoading && !resultImage && (
                <>
                  {placeholderImage && (
                    <img src={placeholderImage} alt="Placeholder mannequin" className="object-cover w-full h-full opacity-5" />
                  )}
                  <div className="absolute inset-0 flex items-center justify-center p-4">
                    {isPlaceholderLoading ? (
                        <p className="text-zinc-500 animate-pulse">Preparing the studio...</p>
                    ) : (
                        <p className="text-zinc-400 text-center font-medium">Your result will appear here</p>
                    )}
                  </div>
                </>
              )}
            </div>
             <button
              onClick={handleGenerate}
              disabled={!canGenerate}
              className="w-full text-lg bg-gradient-to-r from-amber-500 to-amber-600 text-white font-bold py-3 px-4 rounded-md disabled:bg-zinc-700 disabled:from-zinc-700 disabled:to-zinc-700 disabled:cursor-not-allowed hover:from-amber-600 hover:to-amber-700 transition-all duration-300 transform hover:scale-105 disabled:scale-100 flex items-center justify-center shadow-lg shadow-amber-500/30 disabled:shadow-none"
            >
              {isLoading ? 'Generating...' : 'Fit The Look'}
            </button>
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;