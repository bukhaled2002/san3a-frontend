"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import { createBook, GetSingleBookResponse, updateBook, deleteChapters } from "@/services/admin/books";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Loader2, PlusIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm, useFieldArray } from "react-hook-form";
import { useState } from "react";
import * as z from "zod";

const schema = z.object({
  name: z.string().min(1, { message: "يجب ادخال اسم الدورة" }),
  description: z.string().min(1, { message: "يجب ادخال الوصف" }),
  img_url: z.string().url({ message: "يجب ادخال رابط صورة الدورة" }),
  author: z.string().min(1, { message: "يجب وضع اسم المؤلف" }),
  price: z.string().regex(/^\d+$/, {
    message: "يجب ادخال رقم",
  }),
  google_form_url: z.string().min(1, { message: "يجب اضافة رابط التسجيل" }),
  bookChapters: z.array(
    z.object({
      id: z.string().optional(),
      title: z.string().min(1, { message: "يجب ادخال اسم الفصل" }),
      content: z.string().min(1, { message: "يجب ادخال محتوى الفصل" }),
    })
  ).nonempty({ message: "يجب إضافة فصل واحد على الأقل" }),
});

type schemaType = z.infer<typeof schema>;

type Props = {
  intialValues?: GetSingleBookResponse;
};

function AdminInitialEditBookForm({ intialValues }: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const bookId = intialValues?.id;

  // State to hold IDs of chapters marked for deletion
  const [chaptersToDelete, setChaptersToDelete] = useState<string[]>([]);

  const form = useForm<schemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: intialValues?.name || "",
      description: intialValues?.description || "",
      img_url: intialValues?.img_url?.trim() || "",
      author: intialValues?.author || "",
      price: intialValues?.price || "",
      google_form_url: intialValues?.google_form_url || "",
      bookChapters: intialValues?.bookChapters || [{ id: "", title: "", content: "" }],
    },
  });

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "bookChapters",
  });

  const { mutate: CreateBook, isPending: isCreating } = useMutation({
    mutationFn: (data: schemaType) => createBook(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books-admin"] });
      toast({
        title: "تم انشاء الكتاب بنجاح",
      });
      router.push("/admin/books");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast({
          title: error.response?.data.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "حدث خطأ ما",
          variant: "destructive",
        });
      }
    },
  });

  const { mutate: UpdateBook, isPending: isUpdating } = useMutation({
    mutationFn: (data: schemaType) => updateBook(String(bookId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["books-admin"] });
      toast({
        title: "تم تعديل الكتاب بنجاح",
      });
      router.push("/admin/books");
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast({
          title: error.response?.data.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "حدث خطأ ما",
          variant: "destructive",
        });
      }
    },
  });

  const { mutate: deleteChapter } = useMutation({
    mutationFn: () => deleteChapters(bookId!, { chapterIds: chaptersToDelete }),
    onSuccess: () => {
      toast({
        title: "تم حذف الفصل/الفصول بنجاح",
      });
      queryClient.invalidateQueries({ queryKey: ["books-admin"] });
    },
    onError: (error) => {
      if (isAxiosError(error)) {
        toast({
          title: error.response?.data.message,
          variant: "destructive",
        });
      } else {
        toast({
          title: "حدث خطأ ما",
          variant: "destructive",
        });
      }
    },
  });

  const handleAddChapter = () => {
    append({ id: "", title: "", content: "" });
  };

  const handleDeleteChapter = (index: number, chapterId: string | undefined) => {
    if (chapterId) {
      setChaptersToDelete((prev) => [...prev, chapterId]);
    }
    remove(index);
  };

  const handleSubmit = async (data: schemaType) => {
    // First, delete the chapters that are marked for deletion
    if (chaptersToDelete.length > 0) {
      await deleteChapter();
    }

    // Remove empty `id` fields from the chapters
    const chaptersWithoutId = data.bookChapters.map(({ id, ...chapter }) => chapter);

    const payload = {
      ...data,
      bookChapters: chaptersWithoutId,
    };
    //@ts-expect-error
      UpdateBook(payload);
  };

  if (!intialValues)
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-secondary" />
      </div>
    );

  return (
    <div className="bg-card/40 backdrop-blur-md border border-primary/10 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(handleSubmit)}
          className="mb-0 space-y-6 w-full px-16 pt-14 pb-10 relative z-10"
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-lg font-bold mb-3 block">
                  اسم الكتاب
                </FormLabel>
                <FormControl>
                  <Input
                    className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            name="description"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-white text-lg font-bold mb-3 block">
                  وصف الكتاب
                </FormLabel>
                <FormControl>
                  <Textarea
                    className="border-primary/10 focus:border-primary focus:ring-primary rounded-xl bg-card/50 text-white placeholder:text-tech-grey/50 min-h-[190px] resize-none transition-all"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <div className="grid grid-cols-4 gap-x-[57px]">
            <FormField
              name="price"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-white text-lg font-bold mb-3 block">
                    سعر الكتاب
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
            <FormField
              name="author"
              control={form.control}
              render={({ field }) => (
                <FormItem className="col-span-2">
                  <FormLabel className="text-white text-lg font-bold mb-3 block">
                    المؤلف
                  </FormLabel>
                  <FormControl>
                    <Input
                      className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
                      min={0}
                      max={100}
                      type="text"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage className="text-red-500" />
                </FormItem>
              )}
            />
          </div>
          <FormField
            name="img_url"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-white text-lg font-bold mb-3 block">
                  صورة الكتاب التعليمي
                </FormLabel>
                <FormControl>
                  <Input
                    className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            name="google_form_url"
            control={form.control}
            render={({ field }) => (
              <FormItem className="col-span-2">
                <FormLabel className="text-white text-lg font-bold mb-3 block">
                  رابط التسجيل في الكتاب
                </FormLabel>
                <FormControl>
                  <Input
                    className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {fields.map((chapter, index) => (
            <div key={chapter.id} className="space-y-6">
              <FormField
                name={`bookChapters.${index}.title`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-lg font-bold mb-3 block">
                      اسم الفصل
                    </FormLabel>
                    <FormControl>
                      <Input
                        className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
                        type="text"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
              
              <FormField
                name={`bookChapters.${index}.content`}
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-white text-lg font-bold mb-3 block">
                      محتوى الفصل
                    </FormLabel>
                    <FormControl>
                      <Textarea
                        className="border-primary/10 focus:border-primary focus:ring-primary rounded-xl bg-card/50 text-white placeholder:text-tech-grey/50 min-h-[190px] resize-none transition-all"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage className="text-red-500" />
                  </FormItem>
                )}
              />
                <Button
                  type="button"
                  onClick={() => handleDeleteChapter(index, chapter.id)}
                  className="group bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 font-bold transition-all"
                >
                  <Trash2 className="w-5 h-5 me-[6px] transition-transform group-hover:scale-110" />
                  حذف الفصل
                </Button>
            </div>
          ))}

          <Button
            type="button"
            className="me-5 group bg-primary/10 hover:bg-primary text-primary hover:text-background border border-primary/20 font-bold transition-all"
            onClick={handleAddChapter}
          >
            <PlusIcon className="w-5 h-5 me-[6px] transition-transform group-hover:rotate-90" />
            اضافة فصل جديد
          </Button>

          <Button
            type="submit"
            size="lg"
            className="w-full text-background h-14 text-lg font-bold shadow-neon-glow rounded-xl transition-all active:scale-[0.98] mt-4"
            disabled={isCreating || isUpdating}
          >
            {bookId ? "حفظ التعديلات" : "انشاء الكتاب"}
            {(isCreating || isUpdating) && (
              <Loader2 className="animate-spin ms-3" />
            )}{" "}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default AdminInitialEditBookForm;
