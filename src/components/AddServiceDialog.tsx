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

export interface AddServiceFormValues {
    title: string;
    description: string;
    file: FileList;
}

export interface AddServiceProps {
    accessToken: string;
    fetchServices: () => void;
}

export function AddServiceDialog({ accessToken, fetchServices }: AddServiceProps) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<AddServiceFormValues>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const onSubmit: SubmitHandler<AddServiceFormValues> = async (data) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('description', data.description);
            formData.append('file', data.file[0]);  // Assuming single file upload

            await axios.post('https://studio-foto-backend.vercel.app/v1/service', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${JSON.parse(accessToken).token}`
                }
            });
            fetchServices();
            toast({
                title: "Item added",
                description: "The service item has been added successfully.",
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
                    <Button className="mt-4 rounded-full w-full text-lg ">Add Service Item</Button>
                </AlertDialogTrigger>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Add a new service item</AlertDialogTitle>
                        <AlertDialogDescription>
                            Please fill in the details below to add a new service item.
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
                                <Label htmlFor="description">Description</Label>
                                <Input
                                    id="description"
                                    type="text"
                                    placeholder="Item description"
                                    disabled={isSubmitting}
                                    {...register("description", { required: "Description is required" })}
                                />
                                {errors.description && <span className="text-red-500">{errors.description.message}</span>}
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
