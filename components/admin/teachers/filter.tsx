"use client";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { GetSubject } from "@/services/admin/subjects";
import { GetClass } from "@/services/public/classes";
import { zodResolver } from "@hookform/resolvers/zod";
import { Filter } from "lucide-react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import z from "zod";
import { Button } from "../../ui/button";
import { Checkbox } from "../../ui/checkbox";
import { Dialog, DialogContent, DialogTrigger } from "../../ui/dialog";
import { Separator } from "../../ui/separator";

type Props = {
  classes: GetClass[];
  subjects: GetSubject[];
};

const FormSchema = z.object({
  classes: z.array(z.string()),
  subjects: z.array(z.string()),
});

type FormValues = z.infer<typeof FormSchema>;

function AdminFilter({ classes, subjects }: Props) {
  const [isOpened, setIsOpened] = useState(false);
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();
  const form = useForm<FormValues>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      classes: [],
      subjects: [],
    },
  });

  const updateURL = (classes: string[] = [], subjects: string[] = []) => {
    let queryParams: Record<string, string> = {};

    if (classes.length) {
      queryParams.class = classes.join(",");
    }
    if (subjects.length) {
      queryParams.subject = subjects.join(",");
    }

    const queryString = new URLSearchParams(queryParams).toString();
    const newURL = `${pathname}?${queryString}`;
    router.push(newURL);
    setIsOpened(false);
  };

  useEffect(() => {
    const classQueryParam = searchParams.get("class");
    const subjectQueryParam = searchParams.get("subject");
    if (classQueryParam) {
      form.setValue("classes", classQueryParam.split(","));
    }
    if (subjectQueryParam) {
      form.setValue("subjects", subjectQueryParam.split(","));
    }
  }, []);

  return (
    <Dialog open={isOpened} onOpenChange={setIsOpened}>
      <DialogTrigger>
        <Filter className="text-secondary" size={30} fill="#4635b6" />
      </DialogTrigger>
      <DialogContent className="w-[500px] max-w-[90%]">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              updateURL(data.classes, data.subjects),
            )}
            className="space-y-8 w-full"
          >
            <div>
              <h1 className="text-2xl font-bold text-[#d4d4d4] mb-4">
                الصفوف الدراسية
              </h1>
              <FormField
                control={form.control}
                name="classes"
                render={() => (
                  <FormItem className="grid grid-cols-2 gap-4 space-y-0">
                    {classes.map((c) => (
                      <FormField
                        key={c.id}
                        control={form.control}
                        name="classes"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={c.id}
                              className="flex flex-row items-center space-y-0 gap-[14px] cursor-pointer w-fit"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(c.name)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([...field.value, c.name])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== c.name,
                                          ),
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-lg font-semibold text-[#d4d4d4] cursor-pointer">
                                {c.name}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Separator className="w-[300px] m-auto" />
            <div>
              <h1 className="text-2xl font-bold text-[#d4d4d4] mb-4">
                المواد الدراسية
              </h1>
              <FormField
                control={form.control}
                name="subjects"
                render={() => (
                  <FormItem className="grid grid-cols-3 gap-4 space-y-0">
                    {subjects.map((subject) => (
                      <FormField
                        key={subject.id}
                        control={form.control}
                        name="subjects"
                        render={({ field }) => {
                          return (
                            <FormItem
                              key={subject.id}
                              className="flex flex-row items-center space-y-0 gap-[14px] cursor-pointer w-fit"
                            >
                              <FormControl>
                                <Checkbox
                                  checked={field.value?.includes(subject.name)}
                                  onCheckedChange={(checked) => {
                                    return checked
                                      ? field.onChange([
                                          ...field.value,
                                          subject.name,
                                        ])
                                      : field.onChange(
                                          field.value?.filter(
                                            (value) => value !== subject.name,
                                          ),
                                        );
                                  }}
                                />
                              </FormControl>
                              <FormLabel className="text-lg font-semibold text-[#d4d4d4] cursor-pointer">
                                {subject.name}
                              </FormLabel>
                            </FormItem>
                          );
                        }}
                      />
                    ))}
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <Button
              type="submit"
              size="lg"
              variant="secondary"
              className="w-full text-white h-12 text-lg"
            >
              تأكيد
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AdminFilter;
