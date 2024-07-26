// RemoveButton.tsx
import React from 'react';
import axios, { AxiosError } from 'axios';
import { Button } from "@/components/ui/button";
import { useToast } from '@/components/ui/use-toast';
interface RemoveButtonProps {
    imageId: string;
    accessToken: string;
    fetchImages: () => void;
    isLoading: boolean;
    setIsLoading: (loading: boolean) => void;
}

const RemoveButton: React.FC<RemoveButtonProps> = ({ imageId, accessToken, fetchImages, isLoading, setIsLoading }) => {
    const { toast } = useToast();

    const handleDelete = async () => {
        setIsLoading(true);
        try {
            await axios.delete(`https://studio-foto-backend.vercel.app/v1/images/${imageId}`, {
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
            variant="destructive"
            className="border-black rounded-xl 2xl:text-lg w-4/5"
            disabled={isLoading}
            onClick={handleDelete}
        >
            Remove
        </Button>
    );
};

export default RemoveButton;
