"use client";
import { completeVideo } from "@/services/student/courses";
import { getLecture } from "@/services/student/lectures";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { isAxiosError } from "axios";
import {
  Loader2,
  PauseCircle,
  PlayCircle,
  RotateCcw,
  RotateCw,
  Trophy,
  Volume2,
  VolumeX,
} from "lucide-react";
import { toast } from "../ui/use-toast";
import { cn } from "@/lib/utils";
import { useEffect, useRef, useState } from "react";
type Props = {
  courseId: string;
  lectureId: string;
  watched: number;
  total: number;
};

declare global {
  interface Window {
    onYouTubeIframeAPIReady: () => void;
    YT: any;
  }
}

function LectureContent({ courseId, lectureId, watched, total }: Props) {
  const queryClient = useQueryClient();
  const playerRef = useRef<any>(null);
  const [isPlayerReady, setIsPlayerReady] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const controlsTimeoutRef = useRef<NodeJS.Timeout>();
  const [showControls, setShowControls] = useState(true);

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

  // Function to extract YouTube video ID from the URL
  const getYouTubeEmbedUrl = (url: string) => {
    const videoIdMatch = url?.match(
      /(?:https?:\/\/)?(?:www\.)?youtu(?:\.be|be\.com)\/(?:watch\?v=|embed\/|v\/|.+\?v=)?([^&\n]+)/
    );
    return videoIdMatch ? videoIdMatch[1] : null;
  };

  useEffect(() => {
    if (!lecture?.lecture?.video?.url) return;

    const videoId = getYouTubeEmbedUrl(
      "https://www.youtube.com/watch?v=wSSRJ8pwDq8"
    );
    if (!videoId) return;

    const tag = document.createElement("script");
    tag.src = "https://www.youtube.com/iframe_api";
    const firstScriptTag = document.getElementsByTagName("script")[0];
    firstScriptTag.parentNode?.insertBefore(tag, firstScriptTag);

    window.onYouTubeIframeAPIReady = () => {
      playerRef.current = new window.YT.Player("youtube-player", {
        height: "100%",
        width: "100%",
        videoId: videoId,
        playerVars: {
          controls: 0,
          disablekb: 0,
          rel: 0,
          showinfo: 0,
          modestbranding: 1,
          fs: 0,
          playsinline: 1,
          iv_load_policy: 3,
          cc_load_policy: 0,
        },
        events: {
          onReady: () => setIsPlayerReady(true),
          onStateChange: (event: any) => {
            setIsPlaying(event.data === window.YT.PlayerState.PLAYING);
          },
        },
      });
    };

    return () => {
      if (playerRef.current) {
        playerRef.current.destroy();
      }
    };
  }, [lecture?.lecture?.video?.url]);

  const handleMouseMove = () => {
    setShowControls(true);
    if (controlsTimeoutRef.current) {
      clearTimeout(controlsTimeoutRef.current);
    }
    controlsTimeoutRef.current = setTimeout(() => {
      setShowControls(false);
    }, 3000);
  };

  useEffect(() => {
    return () => {
      if (controlsTimeoutRef.current) {
        clearTimeout(controlsTimeoutRef.current);
      }
    };
  }, []);

  const togglePlay = () => {
    if (!playerRef.current || !isPlayerReady) return;
    if (isPlaying) {
      playerRef.current.pauseVideo();
    } else {
      playerRef.current.playVideo();
    }
  };

  const skipForward = () => {
    if (!playerRef.current || !isPlayerReady) return;
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime + 5, true);
  };

  const skipBackward = () => {
    if (!playerRef.current || !isPlayerReady) return;
    const currentTime = playerRef.current.getCurrentTime();
    playerRef.current.seekTo(currentTime - 5, true);
  };

  const toggleMute = () => {
    if (!playerRef.current || !isPlayerReady) return;
    if (isMuted) {
      playerRef.current.unMute();
    } else {
      playerRef.current.mute();
    }
    setIsMuted(!isMuted);
  };

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
          ? "انتهت مشاهدات هذا الدرس"
          : `لديك ${lecture?.count_watched_left} مشاهدات على هذا الدرس من مجموع ${lecture?.lecture?.video.count_watched}`}
      </div>
      <div className="lg:hidden flex items-center justify-between">
        <div>
          مكتمل {watched} / {total}
        </div>
        <Trophy size={20} className="text-primary" />
      </div>
      <div
        className="video-player sm:h-[500px] h-[320px] object-cover rounded-xl overflow-hidden relative "
        onMouseMove={handleMouseMove}
        onMouseLeave={() => setShowControls(false)}
      >
        <div id="youtube-player" className="w-full h-full" />

        <div
          className={cn(
            "absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/70 to-transparent transition-opacity duration-300",
            showControls ? "opacity-100" : "opacity-0"
          )}
        >
          <div className="flex items-center justify-center gap-6">
            <button
              onClick={skipBackward}
              className="text-white hover:text-gray-300 transition-colors focus:outline-none"
              aria-label="Rewind 5 seconds"
            >
              <RotateCcw size={24} />
            </button>

            <button
              onClick={togglePlay}
              className="text-white hover:text-gray-300 transition-colors focus:outline-none"
              aria-label={isPlaying ? "Pause" : "Play"}
            >
              {isPlaying ? <PauseCircle size={32} /> : <PlayCircle size={32} />}
            </button>

            <button
              onClick={skipForward}
              className="text-white hover:text-gray-300 transition-colors focus:outline-none"
              aria-label="Forward 5 seconds"
            >
              <RotateCw size={24} />
            </button>

            <button
              onClick={toggleMute}
              className="text-white hover:text-gray-300 transition-colors focus:outline-none"
              aria-label={isMuted ? "Unmute" : "Mute"}
            >
              {isMuted ? <VolumeX size={24} /> : <Volume2 size={24} />}
            </button>
          </div>
        </div>

        <div className="absolute top-2 left-0 w-full h-16 bg-black" />
      </div>
    </>
  );
}

export default LectureContent;
