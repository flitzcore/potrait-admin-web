import { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { Button } from "@/components/ui/button"; // Replace with your actual path
import { Card } from "@/components/ui/card"; // Replace with your actual path
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { useNavigate } from 'react-router-dom';
import { EditPortfolioDialog } from '@/components/EditPortfolioDialog';
import { Toaster } from '@/components/ui/toaster';
import RemoveButton from '@/components/RemoveButton';

interface ImageData {
    title: string;
    caption: string;
    tag: string;
    imgUrl: string;
    id: string;
}

export function PortfolioDetail() {
    const { id } = useParams<{ id: string }>(); // Define type for params
    const navigate = useNavigate();
    const [portfolioItem, setPortfolioItem] = useState<ImageData | null>(null);
    const [relatedImages, setRelatedImages] = useState<ImageData[]>([]);
    const [loading, setLoading] = useState(true);
    const [accessToken, setAccessToken] = useState('');
    const fetchImages = async () => {
        try {
            // Fetch the portfolio item by ID
            const response = await axios.get(`https://studio-foto-backend.vercel.app/v1/images/${id}`);
            setPortfolioItem(response.data);

            // Fetch related images by title
            const relatedResponse = await axios.get(`https://studio-foto-backend.vercel.app/v1/images?title=${response.data.title}`);
            const relatedImagesData = relatedResponse.data.results;
            setRelatedImages(relatedImagesData);
            setLoading(false);

            // Navigate to /dashboard if no related images are found
            if (relatedImagesData.length === 0) {
                navigate('/dashboard');
            }
        } catch (error) {
            console.error('Failed to fetch portfolio item or related images:', error);
            setLoading(false);
            navigate('/dashboard'); // Navigate to /dashboard in case of error
        }
    };
    useEffect(() => {
        const storedAccessToken = localStorage.getItem('accessToken');
        setAccessToken(storedAccessToken || '');
        // Fetch portfolio item details by ID
        fetchImages();
    }, [id]);

    const handleImageSelect = (selectedImage: ImageData) => {
        setPortfolioItem(selectedImage);
    };

    const goToDashboard = () => {
        navigate(`/dashboard`);
    };

    return (
        <> <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-black text-white md:block">
                <div className="flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center justify-center px-10 py-20 lg:h-[60px] lg:px-20">
                        <img src="/images/LogoWhite.png" alt="Logo" width={120} height={32} />
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 lg:px-4">
                            <Button
                                variant="link"
                                className="flex items-center gap-3 text-lg font-large rounded-lg px-3 py-2 text-secondary transition-all hover:text-secondary"
                                onClick={() => goToDashboard()}
                            >
                                Portfolio
                            </Button>
                            <Button
                                variant="link"
                                className="flex items-center gap-3 text-lg font-large rounded-lg px-3 py-2 text-secondary transition-all hover:text-secondary"
                                disabled
                            >
                                Service
                            </Button>
                        </nav>
                    </div>
                </div>
            </div>

            <div className="flex flex-col w-full">
                <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6">
                    <Sheet>
                        <SheetTrigger asChild>
                            <Button
                                variant="outline"
                                size="icon"
                                className="shrink-0 md:hidden"
                            >
                                <Menu className="h-5 w-5" />
                                <span className="sr-only">Toggle navigation menu</span>
                            </Button>
                        </SheetTrigger>
                        <SheetContent side="left" className="flex flex-col">
                            <nav className="grid gap-2 text-lg font-medium">
                                <Button
                                    variant="link"
                                    className="flex items-center gap-2 text-lg font-semibold"
                                >
                                    <span className="sr-only">Acme Inc</span>
                                </Button>
                                <Button
                                    variant="link"
                                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                >
                                    Portfolio
                                </Button>
                                <Button
                                    variant="link"
                                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                >
                                    Service
                                </Button>
                            </nav>
                        </SheetContent>
                    </Sheet>
                </header>

                <div className="flex flex-col items-center justify-center p-6">
                    <header className="w-full mb-6">
                        <h1 className="text-4xl font-bold text-left pb-10">Portfolio</h1>
                    </header>
                    <header className="mb-6 text-center">
                        {portfolioItem && (
                            <h1 className="text-3xl font-bold">{portfolioItem.title}</h1>
                        )}
                    </header>
                    <main className="flex flex-col gap-4 items-center">
                        {loading ? (
                            <p>Loading...</p>
                        ) : (
                            <>

                                <div className="flex flex-row gap-6 max-w-4xl">
                                    {portfolioItem && (
                                        <div className="flex-shrink-0 w-3/5">
                                            <img
                                                src={portfolioItem.imgUrl}
                                                alt={portfolioItem.title}
                                                className="w-full h-auto rounded-lg shadow-lg"
                                            />
                                            <div className="grid grid-cols-4 gap-4 mt-4">
                                                {relatedImages.map((image) => (
                                                    <img
                                                        key={image.id}
                                                        src={image.imgUrl}
                                                        alt={image.title}
                                                        className="w-full h-16 object-cover rounded-md shadow-md cursor-pointer"
                                                        onClick={() => handleImageSelect(image)}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    )}
                                    <div className="w-2/3">
                                        {portfolioItem && (
                                            <>
                                                <p className="mt-2 text-gray-700 text-lg text-justify">
                                                    {portfolioItem.caption}
                                                </p>
                                                {portfolioItem.tag && (
                                                    <b className="mt-2 text-black text text-lg">
                                                        #{portfolioItem.tag}
                                                    </b>
                                                )}
                                            </>
                                        )}
                                    </div>

                                </div>
                                {portfolioItem && (
                                    <>
                                        <EditPortfolioDialog
                                            accessToken={accessToken}
                                            fetchImages={fetchImages}
                                            imageId={portfolioItem.id}
                                        />
                                        <RemoveButton
                                            imageId={portfolioItem.id}
                                            accessToken={accessToken}
                                            fetchImages={fetchImages}
                                            isLoading={loading}
                                            setIsLoading={setLoading}
                                        />
                                    </>

                                )}
                            </>


                        )}

                    </main>
                </div>
            </div>

        </div>
            <Toaster />
        </>

    );
}
