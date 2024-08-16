"use client";
import { completeVideo } from "@/services/student/courses";
import { getLecture } from "@/services/student/lectures";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import { Loader2, Trophy } from "lucide-react";
import { toast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import { useEffect, useRef } from "react";
import videojs from "video.js";
import "video.js/dist/video-js.css";
import "videojs-youtube";

type Props = {
  courseId: string;
  lectureId: string;
  watched:number;
  total:number
};

function LectureContent({ courseId, lectureId,watched,total }: Props) {
  const queryClient = useQueryClient();
  const { data: lecture } = useQuery({
    queryKey: ["lecture", courseId, lectureId],
    queryFn: () => getLecture(courseId, lectureId),
    refetchOnWindowFocus: false,
  });

  const { mutate: CompleteVideo } = useMutation({
    mutationFn: (videoId: string) => completeVideo(videoId),
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["lecture", courseId, lectureId],
      });
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
  const videoNode = useRef(null);
  const playerRef = useRef(null);

  useEffect(() => {
    console.log("Video Node: ", videoNode.current);

    if (videoNode.current && !playerRef.current) {
      setTimeout(() => {
        console.log("Initializing video.js player");
        //@ts-expect-error
        playerRef.current = videojs(videoNode.current, {
          techOrder: ["youtube"],
          sources: [
            {
              src: lecture?.lecture?.video.url,
              type: "video/youtube",
            },
          ],
          youtube: {
            modestbranding: 1,
            rel: 0, 
            showinfo: 0,
            iv_load_policy: 3,
          },
          controls: true,
          autoplay: false,
        });
        //@ts-expect-error

        playerRef.current.on("ready", () => {
          console.log("Video.js player is ready");
        });
      }, 100);
    }

    return () => {
      if (playerRef.current) {
        console.log("Disposing video.js player");
                //@ts-expect-error
        playerRef.current.dispose();
        playerRef.current = null;
      }
    };
  }, []);

  if (!lecture)
    return (
      <div className=" flex items-center justify-center h-[500px]">
        <Loader2 className="animate-spin text-secondary" size={50} />
      </div>
    );
  return (
    <>
      <div className="header flex items-center justify-between text-lg font-bold">
        {lecture?.lecture?.title}
      </div>
      <div
        className={cn(
          "text-red-500 sm:absolute top-0 right-0 ",
          lecture?.count_watched_left !== 0 && "text-green-500"
        )}
      >
        {lecture?.count_watched_left === 0
          ? "انتهي منشاهدات هذا الدرس"
          : `لديك ${lecture?.count_watched_left} مشاهدات على هذا الدرس من مجموع ${lecture?.lecture?.video.count_watched}`}
      </div>
      <div className="lg:hidden flex items-center justify-between">
              <div>
                مكتمل {watched} /{" "}
                {total}
              </div>
              <Trophy size={20} className="text-primary" />
            </div>
      <div className="video-player sm:h-[500px] h-[320px] object-cover rounded-xl overflow-hidden">
        <div className="sm:h-[500px] h-[320px] w-full object-cover" data-vjs-player>
          <video
            ref={videoNode}
            id="videojs-player"
            className="video-js vjs-default-skin sm:h-[500px] h-[320px] w-full object-cover"
            controls
          ></video>
        </div>
      </div>
    </>
  );
}

export default LectureContent;

