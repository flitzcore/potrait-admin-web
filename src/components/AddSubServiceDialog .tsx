import { useState } from 'react';
import axios, { AxiosError } from 'axios';
import { useForm, SubmitHandler } from 'react-hook-form';
import { useParams } from 'react-router-dom';
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

export interface AddSubServiceFormValues {
    title: string;
    condition: string;
    addon: string;
    price: number;
    file: FileList;
}

export interface AddSubServiceProps {
    accessToken: string;
    fetchSubServices: () => void;
}

export function AddSubServiceDialog({ accessToken, fetchSubServices }: AddSubServiceProps) {
    const { register, handleSubmit, formState: { errors }, reset } = useForm<AddSubServiceFormValues>();
    const { id } = useParams<{ id: string }>();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isDialogOpen, setIsDialogOpen] = useState(false);
    const { toast } = useToast();

    const onSubmit: SubmitHandler<AddSubServiceFormValues> = async (data) => {
        setIsSubmitting(true);
        try {
            const formData = new FormData();
            formData.append('title', data.title);
            formData.append('condition', data.condition);
            formData.append('addon', data.addon);
            formData.append('price', data.price.toString());
            formData.append('file', data.file[0]);  // Assuming single file upload

            await axios.post(`https://studio-foto-backend.vercel.app/v1/service/${id}/subservice`, formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                    'Authorization': `Bearer ${JSON.parse(accessToken).token}`
                }
            });
            fetchSubServices();
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
                    <Button className="mt-4 rounded-full w-full text-lg ">Add SubService Item</Button>
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
                                <Label htmlFor="condition">Condition</Label>
                                <Input
                                    id="condition"
                                    type="text"
                                    placeholder="condition1, condition2, condition3, ..."
                                    disabled={isSubmitting}
                                    {...register("condition")}
                                />
                                {errors.condition && <span className="text-red-500">{errors.condition.message}</span>}
                            </div>
                            <div>
                                <Label htmlFor="addon">Add On</Label>
                                <Input
                                    id="addon"
                                    type="text"
                                    placeholder="add on1, add on2, add on3, ..."
                                    disabled={isSubmitting}
                                    {...register("addon")}
                                />
                                {errors.addon && <span className="text-red-500">{errors.addon.message}</span>}
                            </div>
                            <div>
                                <Label htmlFor="price">Price (IDR)</Label>
                                <Input
                                    id="price"
                                    type="number"
                                    placeholder="Enter the price in IDR"
                                    disabled={isSubmitting}
                                    {...register("price", { valueAsNumber: true })}
                                    min="0"
                                />
                                {errors.price && <span className="text-red-500">{errors.price.message}</span>}
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
