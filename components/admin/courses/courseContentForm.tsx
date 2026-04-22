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
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "@/components/ui/use-toast";
import {
  addCourseContent,
  deleteChapter,
  deleteLecture,
  getAllChapters,
  updateCourseContent,
} from "@/services/admin/courses";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Loader2, PlusIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import AdminNestedLectures from "./nestedLectures";

type Props = {
  courseIdSlug: string;
};

const schema = z.object({
  chapters: z.array(
    z.object({
      id: z.string().optional().readonly(),
      name: z.string().min(1, "الدورة يجب ان تحتوي علي فصول"),
      description: z.string().min(1, "الدورة يجب ان تحتوي علي فصول"),
      lectures: z.array(
        z.object({
          id: z.string().optional().readonly(),
          title: z.string().min(1, "الدورة يجب ان تحتوي علي فصول"),
          video: z.object({
            id: z.string().optional().readonly(),
            url: z.string().url({ message: "الرابط غير صحيح" }),
            count_watched: z.coerce.string(),
          }),
        }),
      ),
    }),
  ),
});

type schemaType = z.infer<typeof schema>;

function AdminCourseContentForm({ courseIdSlug }: Props) {
  const [chaptersToDelete, setChaptersToDelete] = useState<string[]>([]);
  const [lecturesToDelete, setLecturesToDelete] = useState<string[]>([]);
  const { data: chapters } = useQuery({
    queryKey: ["chapters-admin", courseIdSlug],
    queryFn: () => getAllChapters(courseIdSlug),
  });
  const queryClient = useQueryClient();
  const router = useRouter();
  const form = useForm<schemaType>({
    resolver: zodResolver(schema),
    defaultValues: {
      chapters:
        chapters && chapters?.length > 0
          ? chapters.map((chapter) => ({
              id: chapter.id,
              name: chapter.name,
              description: chapter.description,
              lectures: chapter.lectures.map((lecture) => ({
                id: lecture.id,
                title: lecture.title,
                video: {
                  id: lecture.video ? lecture.video.id : "",
                  url: lecture.video ? lecture.video.url : "",
                  count_watched: String(
                    lecture.video ? lecture.video.count_watched : "0",
                  ),
                },
              })),
            }))
          : [
              {
                name: "",
                description: "",
                lectures: [
                  {
                    title: "",
                    video: {
                      url: "",
                      count_watched: "0",
                    },
                  },
                ],
              },
            ],
    },
  });

  const {
    fields: chapterFields,
    append: appendChapter,
    remove: removeChapter,
  } = useFieldArray({
    name: "chapters",
    control: form.control,
    keyName: "key",
  });
  function addChapter() {
    appendChapter({
      name: "",
      description: "",
      lectures: [
        {
          title: "",
          video: {
            url: "",
            count_watched: "0",
          },
        },
      ],
    });
  }

  const getDirtyFields = <
    TData extends Record<string, unknown>,
    TDirtyItems extends Record<string, unknown>,
  >(
    formValues: TData,
    dirtyItems: TDirtyItems,
  ): Partial<TData> => {
    const dirtyData = Object.entries(dirtyItems).reduce((acc, [key, value]) => {
      if (value === false) return acc;
      if (value === true) {
        if (key in formValues) {
          return { ...acc, [key]: formValues[key] };
        } else {
          return acc;
        }
      }

      if (key in formValues && key in dirtyItems) {
        const child = getDirtyFields(
          formValues[key] as TData,
          dirtyItems[key] as TDirtyItems,
        );

        if (typeof child === "object" && Object.keys(child).length === 0) {
          return acc;
        }

        if (Array.isArray(child) && child.length === 0) {
          return acc;
        }

        return {
          ...acc,
          [key]: child,
        };
      }

      return acc;
    }, {} as Partial<TData>);

    if (Object.keys(dirtyData).length > 0 && "id" in formValues) {
      return { id: formValues.id, ...dirtyData };
    }

    return dirtyData;
  };

  const { mutate: AddCourseContent, isPending: isAdding } = useMutation({
    mutationFn: (data: schemaType) =>
      addCourseContent(String(courseIdSlug), data.chapters),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chapters-admin", courseIdSlug],
      });
      toast({
        title: "تم اضافة محتوي الدورة بنجاح",
      });
      router.push("/admin/courses");
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

  const { mutate: UpdateCourseContent, isPending: isUpdating } = useMutation({
    mutationFn: (data: any) => updateCourseContent(String(courseIdSlug), data),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["chapters-admin", courseIdSlug],
      });
      toast({
        title: "تم تعديل االدورة بنجاح",
      });
      router.push("/admin/courses");
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

  const { mutate: DeleteChapter, isPending: isDeletingChapter } = useMutation({
    mutationFn: async () => {
      await Promise.all(
        chaptersToDelete.map(async (chapterId) => {
          await deleteChapter(chapterId);
        }),
      );
    },
    onSuccess: () => {
      setChaptersToDelete([]);
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

  const { mutate: DeleteLecture, isPending: isDeletingLecture } = useMutation({
    mutationFn: async () => {
      await Promise.all(
        lecturesToDelete.map(async (lectureId) => {
          await deleteLecture(lectureId);
        }),
      );
    },
    onSuccess: () => {
      setLecturesToDelete([]);
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
    if (chapters && chapters.length > 0) {
      form.reset({
        chapters: chapters.map((chapter) => ({
          id: chapter.id,
          name: chapter.name,
          description: chapter.description,
          lectures: chapter.lectures.map((lecture) => ({
            id: lecture.id,
            title: lecture.title,
            video: {
              id: lecture.video ? lecture.video.id : "",
              url: lecture.video ? lecture.video.url : "",
              count_watched: String(
                lecture.video ? lecture.video.count_watched : "0",
              ),
            },
          })),
        })),
      });
    }
  }, [chapters]);

  if (!chapters)
    return (
      <div className=" flex items-center justify-center">
        <Loader2 className="animate-spin text-secondary" size={50} />
      </div>
    );
  return (
    <div className="bg-card/40 backdrop-blur-md border border-primary/10 rounded-3xl shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-primary/5 blur-[100px] pointer-events-none" />
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit((data) => {
            try {
              // Delete chapters if any are marked for deletion
              if (chaptersToDelete.length > 0) {
                DeleteChapter();
              }

              // Delete lectures if any are marked for deletion
              if (lecturesToDelete.length > 0) {
                DeleteLecture();
              }

              if (chapters) {
                const dirtyFields = getDirtyFields(
                  form.getValues(),
                  form.formState.dirtyFields,
                ).chapters;

                const dirtyFieldsArray = Object.values(dirtyFields || {});

                const dirtyFieldsUpdated = dirtyFieldsArray.map(
                  (field: any) => {
                    return field.lectures
                      ? {
                          ...field,
                          lectures: Object.values(field.lectures),
                        }
                      : { ...field };
                  },
                );
                UpdateCourseContent(dirtyFieldsUpdated);
              } else {
                AddCourseContent(data);
              }
            } catch (error) {
              console.error("Error handling form submission:", error);
              toast({
                title: "An error occurred while processing your request.",
                variant: "destructive",
              });
            }
          })}
          className="mb-0 w-full sm:px-5 md:px-16 pt-14 pb-5 relative z-10"
        >
          <div className="mb-12">
            <h1 className="text-2xl text-white font-bold mb-2 flex items-center gap-2">
               <div className="w-1 h-6 bg-primary rounded-full shadow-neon-glow" />
              محتوي الدورة التعليمية
            </h1>
            <p className="text-tech-grey text-lg">
              قم بإضافة الفصول والحصص الخاصة بالدورة التعليمية وتنظيمها بشكل منطقي للطلاب.
            </p>
          </div>
          {chapterFields.map((chapter, index) => {
            return (
              <div key={chapter.key}>
                <Separator className="bg-primary/10 md:w-[600px] mx-auto h-1 rounded-full my-16" />
                <div key={index} className="grid xl:grid-cols-4 gap-10 mb-10">
                  <div className="col-span-2 space-y-3">
                    <FormField
                      name={`chapters.${index}.name`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="col-span-2 ">
                          <FormLabel className="text-white text-lg font-bold mb-3 block">
                            اسم الفصل الجديد
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white"
                              type="text"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    <FormField
                      name={`chapters.${index}.description`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel className="text-white text-lg font-bold mb-3 block">
                            وصف الدورة
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className="border-primary/10 focus:border-primary focus:ring-primary rounded-xl bg-card/50 text-white placeholder:text-tech-grey/50 min-h-[190px] resize-none"
                              {...field}
                            />
                          </FormControl>
                          <FormMessage className="text-red-500" />
                        </FormItem>
                      )}
                    />
                    {index === chapterFields.length - 1 && (
                      <Button
                        onClick={addChapter}
                        type="button"
                        className="me-5 group bg-primary/10 hover:bg-primary text-primary hover:text-background border border-primary/20 font-bold transition-all"
                      >
                        <PlusIcon className="w-5 h-5 me-[6px] transition-transform group-hover:rotate-90" />
                        اضافة فصل جديد
                      </Button>
                    )}
                    {chapterFields.length > 1 && (
                      <Button
                        onClick={() => {
                          removeChapter(index);
                          chapter.id &&
                            setChaptersToDelete((prev) => [
                              ...prev,
                              chapter.id as string,
                            ]);
                        }}
                        type="button"
                        className="group bg-red-500/10 hover:bg-red-500 text-red-500 hover:text-white border border-red-500/20 font-bold transition-all"
                      >
                        <Trash2 className="w-5 h-5 me-[6px] transition-transform group-hover:scale-110" />
                        حذف الفصل
                      </Button>
                    )}
                  </div>
                  <div className="col-span-2 space-y-5">
                    <AdminNestedLectures
                      key={index}
                      chapterIndex={index}
                      form={form}
                      setLecturesToDelete={setLecturesToDelete}
                    />
                  </div>
                </div>
              </div>
            );
          })}
          <Button
            type="submit"
            size="lg"
            disabled={
              isAdding || isUpdating || isDeletingLecture || isDeletingChapter
            }
            className="w-full text-background h-14 text-lg font-bold shadow-neon-glow mt-8 rounded-xl transition-all active:scale-[0.98]"
          >
            {chapters.length > 0 ? "حفظ التعديلات" : "انشاء المحتوى"}
            {(isAdding ||
              isUpdating ||
              isDeletingLecture ||
              isDeletingChapter) && (
              <Loader2 className="animate-spin ms-3" />
            )}{" "}
          </Button>
        </form>
      </Form>
    </div>
  );
}

export default AdminCourseContentForm;
