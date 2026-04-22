"use client";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { toast } from "@/components/ui/use-toast";
import {
  createSubject,
  getSubject,
  updateSubject,
} from "@/services/admin/subjects";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import * as z from "zod";

type Props = {
  id?: string;
};

const schema = z.object({
  name: z.string().nonempty({
    message: "الأسم مطلوب",
  }),
  content: z.string().nonempty({
    message: "المحتوى مطلوب",
  }),
  img_url: z.string().url({ message: "يجب ادخال رابط صورة الدورة" }).optional(),
});

type FormTypes = z.infer<typeof schema>;

function AdminSubjectForm({ id }: Props) {
  const queryClient = useQueryClient();
  const router = useRouter();
  const { data: subject } = useQuery({
    queryKey: ["subject-admin", id],
    queryFn: () => (id ? getSubject(id as string) : null),
  });
  const form = useForm<FormTypes>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: subject?.name || "",
      content: subject?.content || "",
      img_url: subject?.img_url?.trim() || "",
    },
  });

  const { mutate: CreateSubject, isPending: isCreating } = useMutation({
    mutationFn: (data: FormTypes) => createSubject(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects-admin"] });
      toast({
        title: "تم اضافة المادة بنجاح",
      });
      router.push("/admin/subjects");
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

  const { mutate: UpdateSubject, isPending: isUpdating } = useMutation({
    mutationFn: (data: FormTypes) => updateSubject(id || "1", data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["subjects-admin"] });
      toast({
        title: "تم تعديل المادة بنجاح",
      });
      router.push("/admin/subjects");
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

  useEffect(() => {
    if (subject) {
      form.reset({
        name: subject.name,
        content: subject.content,
        img_url: subject.img_url?.trim(),
      });
    }
  }, [subject]);
  return (
    <div className="bg-card/40 backdrop-blur-md border border-primary/10 py-12 px-6 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            if (subject) {
              UpdateSubject(data);
            } else {
              CreateSubject(data);
            }
          })}
          className="mx-auto my-0 max-w-lg space-y-6 w-full relative z-10"
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
                    placeholder="اسم المادة"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            name="content"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
                    placeholder="المحتوى"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            name="img_url"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
                    placeholder="ادخل رابط الصورة"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <Button
            type="submit"
            size="lg"
            className="w-full text-background h-14 text-lg font-bold shadow-neon-glow mt-8 rounded-xl transition-all active:scale-[0.98]"
            disabled={isCreating || isUpdating}
          >
            {subject ? "حفظ التعديلات" : "انشاء مادة جديدة"}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default AdminSubjectForm;
