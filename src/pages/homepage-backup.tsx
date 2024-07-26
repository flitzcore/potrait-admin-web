import { useEffect, useState } from 'react';
import axios from 'axios';
import Cookies from 'js-cookie';
import {
    Menu,
    Search
} from "lucide-react";
import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { AddPortfolioDialog } from "@/components/AddPortfolioDialog";
import { Toaster } from "@/components/ui/toaster";

type Section = 'Portfolio' | 'Service';

interface ImageData {
    title: string;
    caption: string;
    imgUrl: string;
    id: string;
}
interface ServiceData {
    name: string;
    description: string;
    imgUrl: string;
    id: string;
}
interface MainContentProps {
    selectedSection: Section;
    accessToken: string;
    images: ImageData[];
    services: ServiceData[];
}

function MainContent({ selectedSection, accessToken, images, services }: MainContentProps) {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">{selectedSection}</h1>
            </div>
            {selectedSection === 'Portfolio' ? (
                images.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-10 2xl:gap-20 p-4">
                        {images.map((image) => (
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
                                    >
                                        Edit
                                    </Button>
                                    <Button
                                        variant="outline"
                                        className="border-black rounded-xl 2xl:text-lg w-full"
                                    >
                                        Remove
                                    </Button>
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
                        {services.map((service) => (
                            <div key={service.id} className="flex flex-col items-center justify-center">
                                <Card className="w-full h-full rounded-lg md:rounded-xl overflow-hidden shadow-lg">
                                    <h2 className="text-lg font-semibold">{service.name}</h2>
                                    <p className="text-sm text-muted-foreground">{service.description}</p>
                                </Card>
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
                            No data available for service
                        </h3>
                        <p className="text-sm text-muted-foreground">
                            Please add data to the service section.
                        </p>
                    </div>
                </div>
            )}
            <div className="sticky bottom-0 left-0 w-full px-10 py-4 bg-white">
                <div className="mx-auto">
                    <Button className="rounded-full w-full text-lg">
                        Add Portfolio
                    </Button>
                </div>
            </div>
            <Toaster />
        </main>
    );
}


export function HomePage() {
    const [selectedSection, setSelectedSection] = useState<Section>('Portfolio');
    const [accessToken, setAccessToken] = useState('');
    const [refreshToken, setRefreshToken] = useState('');
    const [userData, setUserData] = useState('');
    const [images, setImages] = useState<ImageData[]>([]);

    useEffect(() => {
        // Retrieve the access token from localStorage
        const storedAccessToken = localStorage.getItem('accessToken');
        setAccessToken(storedAccessToken || '');

        // Retrieve the refresh token from cookies
        const storedRefreshToken = Cookies.get('refreshToken');
        setRefreshToken(storedRefreshToken || '');
        const userData = localStorage.getItem('userData');
        setUserData(userData || '');

        // Fetch images from the backend
        axios.get('https://studio-foto-backend.vercel.app/v1/images')
            .then((response) => {
                setImages(response.data.results);
            })
            .catch((error) => {
                console.error('Failed to fetch images:', error);
            });
        console.log('images:', images);
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
                                className="flex items-center gap-3 text-lg font-large rounded-lg px-3 py-2 text-secondary transition-all hover:text-secondary"
                                onClick={() => setSelectedSection('Portfolio')}
                            >
                                Portfolio
                            </Button>
                            <Button
                                variant="link"
                                className="flex items-center gap-3 text-lg font-large rounded-lg px-3 py-2 text-secondary transition-all hover:text-secondary"
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
                <MainContent selectedSection={selectedSection} accessToken={accessToken} images={images} services={[]} />
            </div>
        </div>
    );
}
