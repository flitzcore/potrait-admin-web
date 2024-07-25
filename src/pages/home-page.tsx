

// export function HomePage() {
//     const [accessToken, setAccessToken] = useState('');
//     const [refreshToken, setRefreshToken] = useState('');
//     const [userData, setUserData] = useState('');
//     useEffect(() => {
//         // Retrieve the access token from localStorage
//         const storedAccessToken = localStorage.getItem('accessToken');
//         setAccessToken(storedAccessToken || '');

//         // Retrieve the refresh token from cookies
//         const storedRefreshToken = Cookies.get('refreshToken');
//         setRefreshToken(storedRefreshToken || '');
//         const userData = localStorage.getItem('userData');
//         setUserData(userData || '');
//     }, []);

//     return (
//         <div>
//             <h1>Home Page</h1>
//             <div>
//                 <h2>Access Token</h2>
//                 <p>{accessToken}</p>
//             </div>
//             <div>
//                 <h2>Refresh Token</h2>
//                 <p>{refreshToken}</p>
//             </div>
//             <div>
//                 <h2>User</h2>
//                 <p>{userData}</p>
//             </div>
//         </div>
//     );
// }



// import { Badge } from "@/components/ui/badge"
import { useEffect, useState } from 'react';
import Cookies from 'js-cookie';
import {

    Menu,
    Search

} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card"

import { Input } from "@/components/ui/input"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { AddPortfolioDialog } from "@/components/AddPortfolioDialog"
import { Toaster } from "@/components/ui/toaster"
// Define the possible values for selectedSection
type Section = 'Portfolio' | 'Service';

// Define the props interface for MainContent
interface MainContentProps {
    selectedSection: Section;
    accessToken: string;
}

function MainContent({ selectedSection, accessToken }: MainContentProps) {
    return (
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
            <div className="flex items-center">
                <h1 className="text-lg font-semibold md:text-2xl">{selectedSection}</h1>
            </div>
            <div className="flex flex-1 items-center justify-center rounded-lg border border-dashed shadow-sm">
                <div className="flex flex-col items-center gap-1 text-center">
                    <h3 className="text-2xl font-bold tracking-tight">
                        No data available for {selectedSection}
                    </h3>
                    <p className="text-sm text-muted-foreground">
                        Please add data to the {selectedSection.toLowerCase()} section.
                    </p>
                    <AddPortfolioDialog accessToken={accessToken} />
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
    useEffect(() => {
        // Retrieve the access token from localStorage
        const storedAccessToken = localStorage.getItem('accessToken');
        setAccessToken(storedAccessToken || '');

        // Retrieve the refresh token from cookies
        const storedRefreshToken = Cookies.get('refreshToken');
        setRefreshToken(storedRefreshToken || '');
        const userData = localStorage.getItem('userData');
        setUserData(userData || '');
    }, []);



    return (
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
                            <div className="mt-auto">
                                <Card>
                                    <CardHeader>
                                        <CardTitle>Upgrade to Pro</CardTitle>
                                        <CardDescription>
                                            Unlock all features and get unlimited access to our
                                            support team.
                                        </CardDescription>
                                    </CardHeader>
                                    <CardContent>
                                        <Button size="sm" className="w-full">
                                            Upgrade
                                        </Button>
                                    </CardContent>
                                </Card>
                            </div>
                        </SheetContent>
                    </Sheet>
                    <div className="w-full flex-1 flex justify-center items-center">
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
                    </div>
                </header>
                <MainContent selectedSection={selectedSection} accessToken={accessToken} />
            </div>
        </div>
    );
}


