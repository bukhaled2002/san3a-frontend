"use client";
import { Search } from "lucide-react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { DialogTrigger } from "@radix-ui/react-dialog";
import { useEffect, useState } from "react";
import { Button } from "../ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { z } from "zod";
import { toast } from "@/components/ui/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { isAxiosError } from "axios";
import { Input } from "@/components/ui/input";
import {
  SearchLectureWithCode,
  OpenLectureWithCode,
} from "@/services/admin/lecture-qrcodes";
import { useLectureStore } from "@/lib/stores/lectureStore";
import { useRouter, useSearchParams } from "next/navigation";

const FormSchema = z.object({
  code: z
    .string()
    .min(1, "الرجاء إدخال رمز صحيح")
    .regex(/^[a-zA-Z0-9]+$/, "الرمز يجب أن يحتوي على أحرف وأرقام فقط"),
});
const SecondFormSchema = z.object({
  qrCode: z
    .string()
    .min(1, "الرجاء إدخال رمز صحيح")
    .regex(/^[a-zA-Z0-9]+$/, "الرمز يجب أن يحتوي على أحرف وأرقام فقط"),
});

type FormValues = z.infer<typeof FormSchema>;
type SecondFormValues = z.infer<typeof SecondFormSchema>;

const SearchLecture = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false); // Track if the first form succeeded
  const [errorMessage, setErrorMessage] = useState<string | null>(null); // Track error message
  const router = useRouter(); // Ensure this is used inside a client-side component
  const searchParams = useSearchParams(); // Use this hook to access URL params

  // First form setup
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
  });

  // Second form setup
  const secondForm = useForm<SecondFormValues>({
    resolver: zodResolver(SecondFormSchema),
  });
  useEffect(() => {
    const code = searchParams.get("search-lecture");
    if (code === "true") {
      setIsOpen(true); // Open the dialog if the code is correct
    }
  }, [searchParams]);

  // Function to submit the first form
  const onSubmit = async (values: FormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null); // Reset error message on new submission
    try {
      await SearchLectureWithCode(values.code);
      setIsSuccess(true); // Set success state to true on success
      form.reset();
    } catch (error) {
      if (isAxiosError(error)) {
        const message = "لم يتم العثور علي هذه المحاضرة";
        setErrorMessage(message); // Set the error message
        toast({
          title: message,
          variant: "destructive",
        });
      } else {
        setErrorMessage("حدث خطأ ما"); // Generic error message
        toast({
          title: "حدث خطأ ما",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  // Function to submit the second form
  const secondOnSubmit = async (values: SecondFormValues) => {
    setIsSubmitting(true);
    setErrorMessage(null); // Reset error message on new submission
    try {
      const lectureData = await OpenLectureWithCode(values.qrCode);
      useLectureStore.getState().setLecture(lectureData); // Store lecture data in Zustand
      await OpenLectureWithCode(values.qrCode);
      toast({
        title: "تم العثور على المحاضرة بنجاح",
      });
      secondForm.reset();
      setIsOpen(false);
      router.push("/temp-lecture");
    } catch (error) {
      if (isAxiosError(error)) {
        const message = "لم يتم العثور علي هذه المحاضرة";
        setErrorMessage(message); // Set the error message
        toast({
          title: message,
          variant: "destructive",
        });
      } else {
        setErrorMessage("حدث خطأ ما"); // Generic error message
        toast({
          title: "حدث خطأ ما",
          variant: "destructive",
        });
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className="bg-primary text-white sm:h-10 h-8 px-0 sm:w-12 w-8 font-bold">
          <Search className="sm:size-5 size-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[650px] max-w-[90%] rounded-[22.317px] p-5 lg:p-20">
        <div className="flex items-center gap-x-2.5 sm:justify-start justify-between">
          <h1 className="font-bold text-lg sm:text-[22px]">
            ضع رمز الحصة التي تريد البحث عنها
          </h1>
        </div>

        {/* First form - always visible */}
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((values) => onSubmit(values))}
            className="space-y-4"
          >
            <FormField
              control={form.control}
              name="code"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Input
                      className="py-4"
                      type="text"
                      placeholder="الرمز"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            {/* Conditionally render the error message for the first form */}
            {errorMessage && !isSuccess && (
              <div className="text-red-600 text-sm font-medium">
                {errorMessage}
              </div>
            )}

            <div className="flex items-center">
              <Button
                type="submit"
                className="inline-block rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white w-full sm:h-12"
                disabled={isSubmitting}
              >
                البحث عن الدورة
              </Button>
            </div>
          </form>
        </Form>

        {/* Second form - shown after success in first form */}
        {isSuccess && (
          <Form {...secondForm}>
            <form
              onSubmit={secondForm.handleSubmit((values) =>
                secondOnSubmit(values),
              )}
              className="space-y-4"
            >
              <h1 className="text-[#000] font-bold text-lg sm:text-[22px]">
                ضع الرمز الخاص بك
              </h1>
              <FormField
                control={secondForm.control}
                name="qrCode"
                render={({ field }) => (
                  <FormItem>
                    <FormControl>
                      <Input
                        className="py-4"
                        type="text"
                        placeholder="رمز مشاهدة الحصة"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {errorMessage && isSuccess && (
                <div className="text-red-600 text-sm font-medium">
                  {errorMessage}
                </div>
              )}
              <div className="flex items-center">
                <Button
                  type="submit"
                  className="inline-block rounded-lg bg-primary px-5 py-3 text-sm font-medium text-white w-full sm:h-12"
                  disabled={isSubmitting}
                >
                  فتح الحصة
                </Button>
              </div>
            </form>
          </Form>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default SearchLecture;
