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

export interface EditPortfolioFormValues {
    title?: string;
    tag?: string;
    caption?: string;
    file?: FileList;
}

export interface EditPortfolioProps {
    accessToken: string;
    fetchImages: () => void;
    imageId: string; // Assuming you have an image ID to identify the item to edit
}

export function EditPortfolioDialog({ accessToken, fetchImages, imageId }: EditPortfolioProps) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<EditPortfolioFormValues>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const onSubmit: SubmitHandler<EditPortfolioFormValues> = async (data) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            if (data.title) formData.append('title', data.title);
            if (data.tag) formData.append('tag', data.tag);
            if (data.caption) formData.append('caption', data.caption);
            if (data.file && data.file.length > 0) formData.append('file', data.file[0]);

            await axios.patch(`https://studio-foto-backend.vercel.app/v1/images/${imageId}`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${JSON.parse(accessToken).token}`
                }
            });
            fetchImages();
            toast({
                title: "Item updated",
                description: "The portfolio item has been updated successfully.",
            });

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
                    <Button className="mt-4 rounded-xl w-4/5 text-lg">Edit Portfolio Item</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Edit portfolio item</AlertDialogTitle>
                        <AlertDialogDescription>
                            Please update the details below to edit the portfolio item (min 1).
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
                                    {...register("title")}
                                />
                                {errors.title && <span className="text-red-500">{errors.title.message}</span>}
                            </div>
                            <div>
                                <Label htmlFor="tag">Tag</Label>
                                <Input
                                    id="tag"
                                    type="text"
                                    placeholder="Item tag"
                                    disabled={isSubmitting}
                                    {...register("tag")}
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
                                    {...register("caption")}
                                />
                                {errors.caption && <span className="text-red-500">{errors.caption.message}</span>}
                            </div>
                            <div>
                                <Label htmlFor="file">File</Label>
                                <Input
                                    id="file"
                                    type="file"
                                    disabled={isSubmitting}
                                    {...register("file")}
                                />
                                {errors.file && <span className="text-red-500">{errors.file.message}</span>}
                            </div>
                        </div>
                        <AlertDialogFooter className='pt-4'>
                            <AlertDialogCancel disabled={isSubmitting}>Cancel</AlertDialogCancel>
                            <Button type="submit" disabled={isSubmitting}>
                                {isSubmitting ? "Submitting..." : "Update"}
                            </Button>
                        </AlertDialogFooter>
                    </form>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
}
