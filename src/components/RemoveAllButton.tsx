// RemoveAllButton.tsx
import React from 'react';
import axios, { AxiosError } from 'axios';
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';

interface RemoveAllButtonProps {
    title: string; // Assuming the title is passed to this component
    accessToken: string;
    fetchImages: () => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

const RemoveAllButton: React.FC<RemoveAllButtonProps> = ({ title, accessToken, fetchImages, isLoading, setIsLoading }) => {
    const { toast } = useToast();

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await axios.delete(`https://studio-foto-backend.vercel.app/v1/images?title=${encodeURIComponent(title)}`, {
                headers: {
                    Authorization: `Bearer ${JSON.parse(accessToken).token}`
                }
            });
            fetchImages(); // Re-fetch images after deletion
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
        <Button
            variant="outline"
            className="border-black rounded-xl 2xl:text-lg w-full"
            disabled={isLoading}
            onClick={handleDelete}
        >
            Remove
        </Button>
    );
};

export default RemoveAllButton;
