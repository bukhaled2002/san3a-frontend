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
} from "@/services/teacher/courses";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Loader2, PlusIcon, Trash2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useFieldArray, useForm } from "react-hook-form";
import * as z from "zod";
import TeacherNestedLectures from "./nestedLectures";

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

function TeacherCourseContentForm({ courseIdSlug }: Props) {
  const [chaptersToDelete, setChaptersToDelete] = useState<string[]>([]);
  const [lecturesToDelete, setLecturesToDelete] = useState<string[]>([]);
  const { data: chapters } = useQuery({
    queryKey: ["chapters-teacher", courseIdSlug],
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

  useEffect(() => {
    if (chapters) {
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
        queryKey: ["chapters-teacher", courseIdSlug],
      });
      toast({
        title: "تم اضافة محتوي الدورة بنجاح",
      });
      router.push("/teacher/courses");
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
        queryKey: ["chapters-teacher", courseIdSlug],
      });
      toast({
        title: "تم تعديل االدورة بنجاح",
      });
      router.push("/teacher/courses");
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

  if (!chapters)
    return (
      <div className=" flex items-center justify-center">
        <Loader2 className="animate-spin text-secondary" size={50} />
      </div>
    );
  return (
    <div className=" bg-white p-5 rounded-[12px]">
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
          className="mb-0 w-full bg-white sm:px-5 md:px-16 pt-14 pb-5"
        >
          <div>
            <h1 className="text-2xl text-[#d4d4d4] font-bold mb-1">
              محتوي الدورة التعليمية
            </h1>
            <p className="text-[#121212B2]/70 text-lg">
              هذا النص هو مثال لنص يمكن أن يستبدل في نفس المساحة، <br />
              لقد تم توليد هذا النص من مو
            </p>
          </div>
          {chapterFields.map((chapter, index) => {
            return (
              <div key={chapter.key}>
                <Separator className="md:w-[600px] mx-auto h-1 rounded-full my-16" />
                <div key={index} className="grid xl:grid-cols-4 gap-10 mb-10">
                  <div className="col-span-2 space-y-3">
                    <FormField
                      name={`chapters.${index}.name`}
                      control={form.control}
                      render={({ field }) => (
                        <FormItem className="col-span-2 ">
                          <FormLabel className="text-[#202224] text-lg font-semibold">
                            اسم الفصل الجديد
                          </FormLabel>
                          <FormControl>
                            <Input
                              className="focus-visible:ring-secondary bg-[#F5F6F8] h-12 border border-[#00000026]/15 rounded-[4px]"
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
                          <FormLabel className="text-[#202224] text-lg font-semibold">
                            وصف الدورة
                          </FormLabel>
                          <FormControl>
                            <Textarea
                              className="focus-visible:ring-secondary bg-[#F5F6F8] h-[190px] resize-none border border-[#00000026]/15 rounded-[4px]"
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
                        className="me-5 group bg-[#E4E0FF] hover:bg-[#4635B7] text-[#4635B7] hover:text-[#E4E0FF] border border-[#7864FF] font-bold"
                      >
                        <PlusIcon className="w-5 h-5 me-[6px] bg-[#4635B7] group-hover:bg-[#E4E0FF] rounded-full text-[#E4E0FF] group-hover:text-[#4635B7]" />
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
                        className="group bg-red-500 hover:bg-red-700 text-white border border-red-600 font-bold"
                      >
                        <Trash2 className="w-5 h-5 me-[6px] rounded-full text-white" />
                        حذف الفصل
                      </Button>
                    )}
                  </div>
                  <div className="col-span-2 space-y-5">
                    <TeacherNestedLectures
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
            variant="secondary"
            disabled={
              isAdding || isUpdating || isDeletingLecture || isDeletingChapter
            }
            className="w-full text-white h-12 text-lg"
          >
            {chapters ? "تعديل" : "انشاء"}
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

export default TeacherCourseContentForm;
