"use client";

import axios from "axios";
import * as z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import { useState } from "react";
import { useEffect } from "react";
import { useForm } from "react-hook-form";

import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogTitle,
    DialogFooter,
    DialogHeader
} from "@/components/ui/dialog";

import {
    Form,
    FormControl,
    FormLabel,
    FormMessage,
    FormField,
    FormItem,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";

import { FileUpload } from "@/components/file-upload";
import { useRouter } from "next/navigation";

const formSchema = z.object({
    name: z.string().min(1, {
        message: "Server name is required."
    }),
    imageUrl: z.string().min(1, {
        message: "Server image is required."
    })
});

export const InitialModal = () => {
    const [isMounted, setIsMounted] = useState(false);

    const router = useRouter();

    useEffect(() => {
        setIsMounted(true);
    }, []);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            imageUrl: "",
        }
    });

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        try {
            console.log("values: ", values);   
            await axios.post("/api/servers", values);

            form.reset();
            router.refresh();
            window.location.reload(); 
        } catch (error) {
            console.error("this error ", error);
        }
    };  

    if(!isMounted){
        return null;
    }

    return (
        <Dialog open>
            <DialogContent className="bg-white text-black p-0 overflow-hidden">
                <DialogHeader className="pt-8 px-6">
                    <DialogTitle className="text-2xl text-center font-bold">
                        Customize your space!
                    </DialogTitle>
                    <DialogDescription className="text-center text-zinc-500">
                        We're glad you're here. Let's get started by setting up your Server.
                    </DialogDescription>
                </DialogHeader>

                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
                        <div className="space-y-8 px-6">
                            <div className="flex items-center justify-center text-center">
                                <FormField
                                control={form.control}
                                name="imageUrl"
                                render={({field}) => (
                                    <FormItem>
                                        <FormControl>
                                            <FileUpload
                                            endpoint="serverImage"
                                            value={field.value}
                                            onChange={field.onChange}                                          
                                            />
                                        </FormControl>
                                    </FormItem>
                                )}
                                /> 
                            </div>
                            <FormField 
                            control={form.control}
                            name="name"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70">
                                    Server name
                                    </FormLabel>
                                    <FormControl>
                                        <Input
                                        disabled={isLoading}
                                        className="bg-zinc-200/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0"
                                        placeholder="Enter your server name"
                                        {...field}
                                        />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                            ></FormField>
                        </div>
                        <DialogFooter className="bg-gray-100 py-4 px-6">
                            <Button
                            variant="primary"
                            type="submit"
                            disabled={isLoading}
                            // className="w-full"
                            >
                                {isLoading ? "Creating server..." : "Create server"}
                            </Button>
                            {/* <FormMessage className="text-center text-zinc-500">
                                By creating a server, you agree to our Terms of Service and Privacy Policy.
                            </FormMessage> */}
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}