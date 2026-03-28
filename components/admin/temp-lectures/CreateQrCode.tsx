import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormMessage,
} from "@/components/ui/form";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { Input } from "@/components/ui/input";
import { useQueryClient } from "@tanstack/react-query";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "@/components/ui/use-toast";
import { isAxiosError } from "axios";
import { Plus } from "lucide-react";
import { CreateNewQrCode } from "@/services/admin/lecture-qrcodes";
type AllQuizsProps = {
    lectureId: string;
};

const FormSchema = z.object({
    limit_qrCode: z.coerce.number().min(1, "الرجاء ادخال قيمة صحيحة"),
    num_used: z.coerce.number().min(1, "الرجاء ادخال قيمة صحيحة"),

});

type FormValues = z.infer<typeof FormSchema>;

const CreateQrCode = ({ lectureId }: AllQuizsProps) => {
    const queryClient = useQueryClient();
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const form = useForm<FormValues>({
        resolver: zodResolver(FormSchema),
    });

    const onSubmit = async (values: FormValues) => {
        setIsSubmitting(true);
        try {
            await CreateNewQrCode(lectureId, values.limit_qrCode, values.num_used);
            form.reset();
            setIsOpen(false);
            toast({
                title: "تم اضافة الرموز بنجاح",
            });
            queryClient.invalidateQueries({ queryKey: ["lecture-qr-codes"] });
        } catch (error) {
            if (isAxiosError(error)) {
                toast({
                    title: error.response?.data.message,
                    variant: "destructive",
                });
            }
            toast({
                title: "حدث خطأ ما",
                variant: "destructive",
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between mb-8">
                <div>
                    <h1 className="text-2xl font-bold">رموز الكيو أر المتاحة للدورة</h1>
                    <h2 className="text-[#121212B2]/70 text-lg font-semibold mb-4">
                        قم بنشر الكود او رمز الكيو ار إلي الطالب ليتم استخدامه
                    </h2>
                </div>
                <Dialog open={isOpen} onOpenChange={setIsOpen}>
                    <DialogTrigger asChild>
                        <Button variant="secondary" size="sm" className="text-white">
                            اضافة رمز جديد
                            <Plus className="ms-2 h-4 w-4" />
                        </Button>
                    </DialogTrigger>
                    <DialogContent className="w-[650px] max-w-[90%] rounded-[22.317px] p-5 lg:p-20">
                        <div className="flex items-center gap-x-2.5 sm:justify-start justify-between">
                            <h1 className="text-[#000] font-bold text-lg sm:text-[22px]">
                                قم بإضافة عدد الرموز الذي تريد توليدها
                            </h1>
                        </div>
                        <Form {...form}>
                            <form
                                onSubmit={form.handleSubmit(onSubmit)}
                                className="space-y-4"
                            >
                                <FormField
                                    control={form.control}
                                    name="limit_qrCode"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    className="py-4"
                                                    type="text"
                                                    placeholder="عدد الرموز"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                                                <FormField
                                    control={form.control}
                                    name="num_used"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormControl>
                                                <Input
                                                    className="py-4"
                                                    type="text"
                                                    placeholder="عدد مرات الاستخدام"
                                                    {...field}
                                                />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                                <div className="flex items-center">
                                    <Button
                                        type="submit"
                                        className="inline-block rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white w-full sm:h-12"
                                        disabled={isSubmitting}
                                    >
                                        اضافة رموز الكيو ار
                                    </Button>
                                </div>
                            </form>
                        </Form>
                    </DialogContent>
                </Dialog>
            </div>


        </div>
    )
}

export default CreateQrCode
