"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { db } from "@/lib/firebase";
import { collection, getDocs } from "firebase/firestore";
import { Project } from "@/types/Project";

export default function Home() {
  const [video, setVideo] = useState<string | null>(null);

  useEffect(() => {
    const fetchVideo = async () => {
      try {
        const snapshot = await getDocs(collection(db, "proyectos"));

        const projects: Project[] = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data()
        })) as Project[];

        const projectsWithVideo = projects.filter(p => p.reel);

        if (projectsWithVideo.length > 0) {
          const randomProject =
            projectsWithVideo[
            Math.floor(Math.random() * projectsWithVideo.length)
            ];
          setVideo(randomProject.reel!);
        }
      } catch (error) {
        console.error("Error fetching video:", error);
      }
    };

    fetchVideo();
  }, []);

  return (
    <main className="relative w-screen h-screen overflow-hidden z-20">
      {video && (
        <video
          autoPlay
          muted
          loop
          playsInline
          className="absolute inset-0 w-full h-full object-cover z-0"
        >
          <source src={video} type="video/mp4" />
        </video>
      )}
    </main>
  );
}