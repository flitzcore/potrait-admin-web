import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios, { AxiosError } from 'axios';
import { Button } from "@/components/ui/button"; // Replace with your actual path
import { Card } from "@/components/ui/card"; // Replace with your actual path
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu } from "lucide-react";
import { Toaster } from '@/components/ui/toaster';
import { useToast } from '@/components/ui/use-toast';
import {
    Avatar,
    AvatarFallback,
    AvatarImage,
} from "@/components/ui/avatar"
import { AddSubServiceDialog } from '@/components/AddSubServiceDialog ';


interface SubServiceData {
    title: string;
    price: number;
    condition: string;
    addon: string;
    imgUrl: string;
    id: string;
}

export function ServiceDetail() {
    const { id } = useParams<{ id: string }>(); // Define type for params
    const navigate = useNavigate();
    const [serviceItem, setServiceItem] = useState<SubServiceData[]>([]);
    const [title, setTitle] = useState('');
    const [loading, setLoading] = useState(true);
    const [itemLoading, setItemLoading] = useState(false);
    const [accessToken, setAccessToken] = useState('');
    const { toast } = useToast();

    const fetchSubService = async () => {

        try {
            const parent = await axios.get(`https://studio-foto-backend.vercel.app/v1/service/${id}`);
            setTitle(parent.data.title);
            // Fetch the service item by ID
            const response = await axios.get(`https://studio-foto-backend.vercel.app/v1/service/${id}/subservice`);
            setServiceItem(response.data);
        } catch (error) {
            console.error('Failed to fetch service item:', error);
            navigate('/dashboard'); // Navigate to /dashboard in case of error
        } finally {
            setLoading(false);
        }
    };
    const deleteSubService = async (subId: string) => {
        setItemLoading(true);
        try {

            await axios.delete(`https://studio-foto-backend.vercel.app/v1/service/${id}/subservice/${subId}`);
            // Set selectedItem to the first item if it exists, else set to null
            fetchSubService();

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
            setItemLoading(false);
        }
    };

    useEffect(() => {
        const storedAccessToken = localStorage.getItem('accessToken');
        setAccessToken(storedAccessToken || '');
        fetchSubService();
    }, [id]);

    const goToDashboard = () => {
        navigate(`/dashboard`);
    };

    return (
        <>
            <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
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

                                    disabled
                                >
                                    Portfolio
                                </Button>
                                <Button
                                    variant="link"
                                    className="flex items-center gap-3 text-lg font-large rounded-lg px-3 py-2 text-secondary transition-all hover:text-secondary"
                                    onClick={() => goToDashboard()}
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

                    <div className="flex flex-col items-center justify-center p-6 h-full">
                        <header className="w-full mb-6">
                            <h1 className="text-4xl font-bold text-left pb-10">Service</h1>
                        </header>
                        <header className="mb-6 text-center">
                            {serviceItem && (
                                <h1 className="text-3xl font-bold">{title}</h1>
                            )}
                        </header>
                        <main className="w-full flex flex-col items-center justify-center p-6">
                            {loading ? (
                                <p>Loading...</p>
                            ) : (
                                <div className="w-full grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-5 lg:gap-10 2xl:gap-20 p-4">
                                    {serviceItem.map((item) => (
                                        <Card key={item.id} className="w-full flex flex-col items-center p-4 border rounded-lg shadow-lg">
                                            <Avatar className="w-2/5 h-auto mb-4">
                                                <AvatarImage src={item.imgUrl} alt={item.title} className="rounded-full object-cover" />
                                                <AvatarFallback>{item.title.charAt(0)}</AvatarFallback>
                                            </Avatar>
                                            <h2 className="text-lg font-bold mb-1">{item.title}</h2>

                                            {item.condition && item.condition.length > 0 && (
                                                <>
                                                    <div className='text-black font-bold'>Condition</div>
                                                    <ul className="text-gray-600 mb-2 text-center">
                                                        {item.condition.split(',').map((condition, index) => (
                                                            <li key={index} className="flex items-center justify-center">
                                                                <span>{condition.trim()}</span>
                                                                <svg className="ml-2 w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M10 15l-5.5 3.3 1.1-6.4-4.6-4.5 6.4-.9L10 1l2.6 5.5 6.4.9-4.6 4.5 1.1 6.4L10 15z" />
                                                                </svg>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}

                                            {item.addon && item.addon.length > 0 && (
                                                <>
                                                    <div className='text-black font-bold'>Add On</div>
                                                    <ul className="text-gray-600 mb-2 text-center">
                                                        {item.addon.split(',').map((addon, index) => (
                                                            <li key={index} className="flex items-center justify-center">
                                                                <span>{addon.trim()}</span>
                                                                <svg className="ml-2 w-4 h-4 text-orange-500" fill="currentColor" viewBox="0 0 20 20">
                                                                    <path d="M10 15l-5.5 3.3 1.1-6.4-4.6-4.5 6.4-.9L10 1l2.6 5.5 6.4.9-4.6 4.5 1.1 6.4L10 15z" />
                                                                </svg>
                                                            </li>
                                                        ))}
                                                    </ul>
                                                </>
                                            )}

                                            <div className="text-lg font-bold mb-4">
                                                Rp.{item.price.toLocaleString()}
                                            </div>
                                            <Button variant={'destructive'}
                                                className="w-full text-lg"
                                                disabled={itemLoading}
                                                onClick={() => deleteSubService(item.id)}
                                            >Remove</Button>
                                        </Card>
                                    ))}

                                </div>
                            )}

                        </main>

                        <div className="sticky bottom-0 w-full px-10 py-4 mt-auto bg-white">
                            <div className="mx-auto">
                                <AddSubServiceDialog fetchSubServices={fetchSubService} accessToken={accessToken} />
                            </div>
                        </div>

                    </div>
                </div>
            </div>

            <Toaster />
        </>
    );
}
