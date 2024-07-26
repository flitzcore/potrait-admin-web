import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import {
    AlertDialog,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/components/ui/use-toast';

export interface AddPortfolioFormValues {
    title: string;
    caption: string;
    file: FileList;
}

export interface AddPortfolioProps {
    accessToken: string;
    fetchImages: () => void;
}

export function AddPortfolioDialog({ accessToken, fetchImages }: AddPortfolioProps) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<AddPortfolioFormValues>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const onSubmit: SubmitHandler<AddPortfolioFormValues> = async (data) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('caption', data.caption);
            formData.append('file', data.file[0]);  // Assuming single file upload

            const response = await axios.post('https://studio-foto-backend.vercel.app/v1/images', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${JSON.parse(accessToken).token}`
                }
            });
            fetchImages();
            toast({
                title: "Item added",
                description: "The portfolio item has been added successfully.",
            });

            // // Clear the form data


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
            reset();
            setIsDialogOpen(false);
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <AlertDialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
                <AlertDialogTrigger asChild>
                    <Button className="mt-4 rounded-full w-full">Add Portfolio Item</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Add a new portfolio item</AlertDialogTitle>
                        <AlertDialogDescription>
                            Please fill in the details below to add a new portfolio item.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)}>
                        <div className="space-y-4">
                            <div>
                                <Label htmlFor="title">Title</Label>
                                <Input
                                    id="title"
                                    type="text"
                                    placeholder="Item title"
                                    disabled={isSubmitting}
                                    {...register("title", { required: "Title is required" })}
                                />
                                {errors.title && <span className="text-red-500">{errors.title.message}</span>}
                            </div>
                            <div>
                                <Label htmlFor="caption">Caption</Label>
                                <Input
                                    id="caption"
                                    type="text"
                                    placeholder="Item caption"
                                    disabled={isSubmitting}
                                    {...register("caption", { required: "Caption is required" })}
                                />
                                {errors.caption && <span className="text-red-500">{errors.caption.message}</span>}
                            </div>
                            <div>
                                <Label htmlFor="file">File</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    disabled={isSubmitting}
                                    {...register("file", { required: "File is required" })}
                                />
                                {errors.file && <span className="text-red-500">{errors.file.message}</span>}
                            </div>
                        </div>
                        <AlertDialogFooter className='pt-4'>
                            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Add"}
                            </Button>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>

            </AlertDialog>

        </>

    );
}
