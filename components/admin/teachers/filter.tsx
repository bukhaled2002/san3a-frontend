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
import { cn } from "@/lib/utils";

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
      <DialogTrigger asChild>
        <Button
          variant="outline"
          size="icon"
          className="group border-primary/20 hover:border-primary/50 bg-card/40 transition-all"
        >
          <Filter
            className="text-primary group-hover:scale-110 transition-transform"
            size={24}
          />
        </Button>
      </DialogTrigger>
      <DialogContent className="w-[500px] max-w-[90%] bg-card/90 backdrop-blur-2xl border-primary/20 text-white shadow-2xl">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit((data) =>
              updateURL(data.classes, data.subjects),
            )}
            className="space-y-8 w-full p-2"
          >
            <div>
              <h1 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-primary rounded-full shadow-neon-glow" />
                الصفوف الدراسية
              </h1>
              <FormField
                control={form.control}
                name="classes"
                render={() => (
                  <FormItem className="grid grid-cols-2 gap-y-4 gap-x-6 space-y-0">
                    {classes.map((c) => (
                      <FormField
                        key={c.id}
                        control={form.control}
                        name="classes"
                        render={({ field }) => {
                          const isChecked = field.value?.includes(c.name);
                          return (
                            <FormItem
                              key={c.id}
                              className={cn(
                                "flex flex-row items-center space-y-0 gap-3 cursor-pointer p-3 rounded-xl border transition-all truncate",
                                isChecked
                                  ? "bg-primary/10 border-primary shadow-sm"
                                  : "bg-white/5 border-white/5 hover:border-primary/30",
                              )}
                            >
                              <FormControl>
                                <Checkbox
                                  className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:text-black"
                                  checked={isChecked}
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
                              <FormLabel className="text-sm font-bold cursor-pointer transition-colors">
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
            <Separator className="bg-primary/10" />
            <div>
              <h1 className="text-xl font-bold text-primary mb-6 flex items-center gap-2">
                <div className="w-1 h-6 bg-primary rounded-full shadow-neon-glow" />
                المواد الدراسية
              </h1>
              <FormField
                control={form.control}
                name="subjects"
                render={() => (
                  <FormItem className="grid grid-cols-2 lg:grid-cols-3 gap-y-4 gap-x-4 space-y-0">
                    {subjects.map((subject) => (
                      <FormField
                        key={subject.id}
                        control={form.control}
                        name="subjects"
                        render={({ field }) => {
                          const isChecked = field.value?.includes(subject.name);
                          return (
                            <FormItem
                              key={subject.id}
                              className={cn(
                                "flex flex-row items-center space-y-0 gap-3 cursor-pointer p-3 rounded-xl border transition-all truncate",
                                isChecked
                                  ? "bg-primary/10 border-primary shadow-sm"
                                  : "bg-white/5 border-white/5 hover:border-primary/30",
                              )}
                            >
                              <FormControl>
                                <Checkbox
                                  className="border-primary/30 data-[state=checked]:bg-primary data-[state=checked]:text-black"
                                  checked={isChecked}
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
                              <FormLabel className="text-sm font-bold cursor-pointer transition-colors">
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
              className="w-full h-14 text-lg font-bold shadow-neon-glow rounded-xl active:scale-[0.98] transition-all"
            >
              تطبيق الفلتر
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

export default AdminFilter;
