import { useEffect, useState } from 'react';
import axios, { AxiosError } from 'axios';

import {
    Menu,

} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,

} from "@/components/ui/card";

import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AddPortfolioDialog } from "@/components/AddPortfolioDialog";
import { Toaster } from "@/components/ui/toaster";
import { useToast } from '@/components/ui/use-toast';
import { useNavigate } from 'react-router-dom';
import RemoveAllButton from '@/components/RemoveAllButton';
import { AddServiceDialog } from '@/components/AddServiceDialog';
type Section = 'Portfolio' | 'Service';

interface ImageData {
    title: string;
    caption: string;
    imgUrl: string;
    id: string;
}

interface ServiceData {
    title: string;
    description: string;
    imgUrl: string;
    id: string;
}

interface MainContentProps {
    selectedSection: Section;
    accessToken: string;
    images: ImageData[];
    services: ServiceData[];
    fetchImages: () => void;
    fetchServices: () => void;
}

function MainContent({ selectedSection, accessToken, images, services, fetchImages, fetchServices }: MainContentProps) {

    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();
    const { toast } = useToast();
    const uniqueImages = images.filter((image, index, self) =>
        index === self.findIndex((img) => img.title === image.title)
    );
    const uniqueServices = services.filter((service, index, self) =>
        index === self.findIndex((srv) => srv.title === service.title)
    );

    const goToPortfolioEdit = (id: string) => {
        navigate(`/dashboard/portfolio/${id}`);
    }
    const goToServiceEdit = (id: string) => {
        navigate(`/dashboard/service/${id}`);
    }
    const deleteService = async (id: string) => {
        setIsLoading(true);
        try {

            await axios.delete(`https://studio-foto-backend.vercel.app/v1/service/${id}`);
            // Set selectedItem to the first item if it exists, else set to null
            fetchServices();

        } catch (error) {
            let errorMsg = 'An unexpected error occurred';
            if (error instanceof AxiosError) {
                errorMsg = error.response?.data.message || error.message;
            }
            toast({
                variant: "destructive",
                title: "Error",
                description: errorMsg,
            });
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">{selectedSection}</h1>
            </div>
            {selectedSection === 'Portfolio' ? (
                images.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-10 2xl:gap-20 p-4">
                        {uniqueImages.map((image) => (
                            <div key={image.id} className="flex flex-col items-center justify-center">
                                <Card className="w-full h-full rounded-lg md:rounded-xl overflow-hidden shadow-lg">
                                    <img
                                        src={image.imgUrl}
                                        alt={image.title}
                                        className="w-full h-full object-cover"
                                        style={{ aspectRatio: "3 / 4" }}
                                    />
                                </Card>
                                <div className="w-full flex justify-center gap-2 lg:gap-10 mt-4 px-4">
                                    <Button
                                        variant="outline"
                                        className="border-black rounded-xl text-sm 2xl:text-lg w-full"
                                        disabled={isLoading}
                                        onClick={() => goToPortfolioEdit(image.id)}
                                    >
                                        &ensp;Edit&ensp;
                                    </Button>

                                    <RemoveAllButton
                                        title={image.title}
                                        accessToken={accessToken}
                                        fetchImages={() => fetchImages()}
                                        isLoading={isLoading}
                                        setIsLoading={setIsLoading} />
                                </div>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
                        <div className="flex flex-col items-center gap-1 text-center">
                            <h3 className="text-2xl font-bold tracking-tight">
                                No images available
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Please add images to the Portfolio section.
                            </p>
                        </div>
                    </div>
                )
            ) : selectedSection === 'Service' ? (
                services.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-10 2xl:gap-20 p-4">
                        {uniqueServices.map((service) => (
                            <div key={service.id} className="flex flex-col items-center justify-center p-4 border rounded-lg shadow-lg">
                                <div className="image-wrapper mb-4">
                                    <img
                                        src={service.imgUrl}
                                        alt={service.title}
                                        className="rounded-full w-24 h-24 object-cover"
                                    />
                                </div>
                                <h2 className="text-lg font-bold mb-1">{service.title}</h2>
                                <p className="text-center mb-4 text-sm text-gray-600">{service.description}</p>

                                <Button

                                    className="w-full text-lg"
                                    onClick={() => goToServiceEdit(service.id)}
                                    disabled={isLoading}
                                >
                                    Edit
                                </Button>
                                <Button
                                    variant={'destructive'}
                                    className="w-full text-lg mt-2"
                                    disabled={isLoading}
                                    onClick={() => deleteService(service.id)}
                                >
                                    Remove
                                </Button>
                            </div>
                        ))}
                    </div>
                ) : (
                    <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
                        <div className="flex flex-col items-center gap-1 text-center">
                            <h3 className="text-2xl font-bold tracking-tight">
                                No services available
                            </h3>
                            <p className="text-sm text-muted-foreground">
                                Please add services to the Service section.
                            </p>
                        </div>
                    </div>
                )
            ) : (
                <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
                    <div className="flex flex-col items-center gap-1 text-center">
                        <h3 className="text-2xl font-bold tracking-tight">
                            No services available
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Please add services to the Service section.
                        </p>
                    </div>
                </div>
            )}
            {selectedSection === 'Portfolio' ? (
                <div className="sticky w-full px-10 py-4 mt-auto bg-white">
                    <div className="mx-auto">
                        <AddPortfolioDialog accessToken={accessToken} fetchImages={fetchImages} />
                    </div>
                </div>
            ) : selectedSection === 'Service' ? (
                <div className="sticky w-full px-10 py-4 mt-auto bg-white">
                    <div className="mx-auto">
                        <AddServiceDialog accessToken={accessToken} fetchServices={fetchServices} />
                    </div>
                </div>


            ) : (
                <div>no section</div>
            )}

            <Toaster />
        </main>
    );
}

export function HomePage() {
    const [selectedSection, setSelectedSection] = useState<Section>('Portfolio');
    const [accessToken, setAccessToken] = useState('');

    const [images, setImages] = useState<ImageData[]>([]);
    const [services, setServices] = useState<ServiceData[]>([]);


    const fetchImages = () => {
        axios.get('https://studio-foto-backend.vercel.app/v1/images')
            .then((response) => {
                setImages(response.data.results);
            })
            .catch((error) => {
                console.error('Failed to fetch images:', error);
            });
    };
    const fetchServices = () => {
        axios.get('https://studio-foto-backend.vercel.app/v1/service')
            .then((response) => {
                setServices(response.data.results);
            })
            .catch((error) => {
                console.error('Failed to fetch services:', error);
            });
    };

    useEffect(() => {
        // Retrieve the access token from localStorage
        const storedAccessToken = localStorage.getItem('accessToken');
        setAccessToken(storedAccessToken || '');

        // Retrieve the refresh token from cookies
        // const storedRefreshToken = Cookies.get('refreshToken');
        // setRefreshToken(storedRefreshToken || '');
        // const userData = localStorage.getItem('userData');
        // setUserData(userData || '');

        // Fetch images from the backend
        fetchImages();
        fetchServices();
    }, []);

    return (
        <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
            <div className="hidden border-r bg-black text-white md:block">
                <div className=" flex h-full max-h-screen flex-col gap-2">
                    <div className="flex h-14 items-center justify-center px-10 py-20 lg:h-[60px] lg:px-20">
                        <img src="/images/LogoWhite.png" alt="Logo" width={120} height={32} />
                    </div>
                    <div className="flex-1">
                        <nav className="grid items-start px-2 lg:px-4">
                            <Button
                                variant="link"
                                className={`flex items-center gap-3 text-lg font-large rounded-lg px-3 py-2 transition-all ${selectedSection === 'Portfolio' ? 'text-secondary' : 'text-secondary opacity-60'
                                    }`}
                                onClick={() => setSelectedSection('Portfolio')}
                            >
                                Portfolio
                            </Button>
                            <Button
                                variant="link"
                                className={`flex items-center gap-3 text-lg font-large rounded-lg px-3 py-2 transition-all ${selectedSection === 'Service' ? 'text-secondary' : 'text-secondary opacity-60'
                                    }`}
                                onClick={() => setSelectedSection('Service')}
                            >
                                Service
                            </Button>
                        </nav>
                    </div>
                </div>
            </div>
            <div className="flex flex-col">
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
                                    onClick={() => setSelectedSection('Portfolio')}
                                >
                                    Portfolio
                                </Button>
                                <Button
                                    variant="link"
                                    className="mx-[-0.65rem] flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground"
                                    onClick={() => setSelectedSection('Service')}
                                >
                                    Service
                                </Button>
                            </nav>

                        </SheetContent>
                    </Sheet>
                    {/* <div className="w-full flex-1 flex justify-center items-center">
                        <form className="w-full max-w-lg lg:max-w-2xl">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search products..."
                                    className="w-full appearance-none bg-background pl-8 shadow-none"
                                />
                            </div>
                        </form>
                    </div> */}
                </header>
                <MainContent
                    selectedSection={selectedSection}
                    accessToken={accessToken}
                    images={images}
                    services={services}
                    fetchServices={fetchServices}
                    fetchImages={fetchImages} // Pass the function as a prop
                />
            </div>
        </div>
    );
}
