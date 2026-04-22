import { Button } from "@/components/ui/button";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";
import { PlusIcon, XIcon } from "lucide-react";
import { useFieldArray, useFormContext } from "react-hook-form";

type Props = {
  choiceIndex: number;
  form: any;
};

function AdminNestedQuizQuestions({ choiceIndex: index, form }: Props) {
  const {
    fields: choicesFields,
    append,
    remove,
  } = useFieldArray({
    control: form.control,
    name: `questions.${index}.choices`,
  });

  const { setValue } = useFormContext();

  const handleRadioChange = (lessonIndex: number) => {
    choicesFields.forEach((_, i) => {
      setValue(`questions.${index}.choices.${i}.isCorrect`, i === lessonIndex);
    });
  };

  console.log(form.formState.errors);

  return (
    <div className="grid grid-cols-4 items-end gap-5 mb-8 mt-5">
      {choicesFields.map((choice, lessonIndex) => (
        <div key={choice.id} className="relative">
          <FormField
            name={`questions.${index}.choices.${lessonIndex}.answer`}
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel
                  className={cn(
                    "text-white text-lg font-bold mb-3 block",
                    form.formState.errors?.questions?.[index]?.choices?.[
                      lessonIndex
                    ]?.answer && "text-red-500"
                  )}
                >
                  الأختيار{" "}
                  {lessonIndex === 0
                    ? "الاول"
                    : lessonIndex === 1
                    ? "الثاني"
                    : lessonIndex === 2
                    ? "الثالث"
                    : lessonIndex === 3
                    ? "الرابع"
                    : ""}
                </FormLabel>
                <FormControl>
                  <Input
                    className={cn(
                      "border-primary/10 focus:border-primary focus:ring-primary h-12 rounded-xl bg-card/50 text-white transition-all",
                      form.formState.errors?.questions?.[index]?.choices?.[
                        lessonIndex
                      ]?.answer && "border-red-500"
                    )}
                    type="text"
                    {...field}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          <div className="absolute top-0 end-0 flex items-center gap-x-2">
            <FormField
              name={`questions.${index}.choices.${lessonIndex}.isCorrect`}
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <RadioGroup
                      value={field.value ? String(lessonIndex) : ""}
                      onValueChange={() => handleRadioChange(lessonIndex)}
                    >
                      <FormItem className="flex items-center space-x-3 space-y-0">
                        <FormControl>
                          <RadioGroupItem
                            className={cn(
                              "border-primary text-primary focus-visible:ring-primary h-5 w-5 bg-card/50",
                              form.formState.errors?.questions?.[index]?.choices
                                ?.root && "border-red-500"
                            )}
                            value={String(lessonIndex)}
                            checked={field.value}
                          />
                        </FormControl>
                      </FormItem>
                    </RadioGroup>
                  </FormControl>
                </FormItem>
              )}
            />
            {choicesFields.length > 2 && (
              <XIcon
                className="w-5 h-5 cursor-pointer text-tech-grey hover:text-red-500 transition-colors"
                onClick={() => remove(lessonIndex)}
              />
            )}
          </div>
        </div>
      ))}
      {choicesFields.length < 4 && (
        <Button
          type="button"
          onClick={() => append({ answer: "", isCorrect: false })}
          className="w-fit group bg-primary/10 hover:bg-primary text-primary hover:text-background border border-primary/20 font-bold transition-all"
        >
          <PlusIcon className="w-5 h-5 me-[6px] transition-transform group-hover:rotate-90" />
          اضافة اختيار
        </Button>
      )}
    </div>
  );
}

export default AdminNestedQuizQuestions;
