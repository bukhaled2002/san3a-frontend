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
  GetAdmin,
  TCreateAdmin,
  TUpdateAdmin,
  createAdmin,
  updateAdmin,
} from "@/services/admin/manage-admins";
import { getSubjects } from "@/services/subjects";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import * as z from "zod";

type Props = {
  intialValues?: GetAdmin;
};

const schemaCreate = z
  .object({
    name: z.string().min(1, { message: "يجب ادخال الاسم" }),
    email: z.string().email({ message: "يجب ادخال بريد الكتروني صحيح" }),
    password: z
      .string()
      .min(6, { message: "كلمة السر يجب ان تكون 6 احرف على الاقل" }),
    password_confirmation: z.string(),
  })
  .refine((data) => data.password === data.password_confirmation, {
    path: ["password_confirmation"],
    message: "كلمة السر غير متطابقة",
  });

const schemaUpdate = z.object({
  name: z.string().min(1, { message: "يجب ادخال الاسم" }),
  email: z.string().email({ message: "يجب ادخال بريد الكتروني صحيح" }),
});

function AdminForm({ intialValues }: Props) {
  const teacherId = intialValues?.id;
  const schema = teacherId ? schemaUpdate : schemaCreate;
  type SchemaType = z.infer<
    typeof teacherId extends string ? typeof schemaUpdate : typeof schemaCreate
  >;

  const { data: subjects } = useQuery({
    queryKey: ["subjects"],
    queryFn: getSubjects,
  });
  const queryClient = useQueryClient();
  const router = useRouter();

  const form = useForm<SchemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      name: intialValues?.name || "",
      email: intialValues?.email || "",
      password: "",
      password_confirmation: "",
    },
  });

  const { mutate: CreateAdmin, isPending: isCreating } = useMutation({
    mutationFn: (data: TCreateAdmin) => createAdmin(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers-admin"] });
      toast({
        title: "تم انشاء الحساب بنجاح",
      });
      router.push("/admin/manage-admins");
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

  const { mutate: UpdateAdmin, isPending: isUpdating } = useMutation({
    mutationFn: (data: TUpdateAdmin) => updateAdmin(String(teacherId), data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["teachers-admin"] });
      toast({
        title: "تم تعديل الحساب بنجاح",
      });
      router.push("/admin/manage-admins");
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

  if (!subjects)
    return (
      <div className="flex items-center justify-center">
        <Loader2 className="animate-spin h-12 w-12 text-secondary" />
      </div>
    );
  return (
    <div className="bg-card/40 backdrop-blur-md border border-primary/10 py-12 px-6 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            const { password_confirmation, ...rest } = data;
            return teacherId ? UpdateAdmin(rest) : CreateAdmin(rest);
          })}
          className="mx-auto mb-0 mt-8 max-w-lg space-y-6 w-full relative z-10"
        >
          <FormField
            name="name"
            control={form.control}
            render={({ field }) => (
              <FormItem className="flex-1">
                <FormControl>
                  <Input
                    className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
                    placeholder="الأسم"
                    type="text"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          <FormField
            name="email"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
                    placeholder="البريد الالكتروني"
                    type="email"
                    {...field}
                  />
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />
          {!intialValues?.id && (
            <div className="grid grid-cols-4 gap-x-[18px]">
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Input
                        className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
                        placeholder="كلمة السر"
                        type="password"
                        {...field}
                      />
                    </FormControl>
                    <div className="mt-3">
                      {form?.formState?.errors?.password?.type && (
                        <FormMessage className="text-red-500" />
                      )}
                    </div>
                  </FormItem>
                )}
              />
              <FormField
                name="password_confirmation"
                control={form.control}
                render={({ field }) => (
                  <FormItem className="col-span-2">
                    <FormControl>
                      <Input
                        className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all"
                        placeholder="تأكيد كلمة السر"
                        type="password"
                        {...field}
                      />
                    </FormControl>

                    <div className="flex justify-between items-center mt-3">
                      {form?.formState?.errors?.password_confirmation?.type && (
                        <FormMessage className="text-red-500" />
                      )}
                    </div>
                  </FormItem>
                )}
              />
            </div>
          )}
          <Button
            type="submit"
            size="lg"
            className="w-full text-background h-14 text-lg font-bold shadow-neon-glow mt-4 rounded-xl transition-all active:scale-[0.98]"
            disabled={isCreating || isUpdating}
          >
            {teacherId ? "حفظ التعديلات" : "انشاء الحساب"}
            {(isCreating || isUpdating) && (
              <Loader2 className="animate-spin ms-3" />
            )}{" "}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default AdminForm;
