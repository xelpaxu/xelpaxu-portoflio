"use client";

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';

export default function HeroSidebar() {
  const technologies = [
    { name: "React", logo: "/assets/logos/reacticon.svg" },
    { name: "TypeScript", logo: "/assets/logos/typescripticon.svg" },
    { name: "Flutter", logo: "/assets/logos/fluttericon.svg" },
    { name: "React Native", logo: "/assets/logos/reacticon.svg" },
  ];

  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);

  const [leftPupil, setLeftPupil] = useState({ x: 0, y: 0 });
  const [rightPupil, setRightPupil] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!leftEyeRef.current || !rightEyeRef.current) return;

      // Increased to 7.5px. Since the eye is 20px and pupil is 6px, 
      // the absolute limit to touch the edge from center position is 7px.
      const maxTranslateX = 7.5; 
      const maxTranslateY = 6.5;

      const leftRect = leftEyeRef.current.getBoundingClientRect();
      const rightRect = rightEyeRef.current.getBoundingClientRect();

      const leftX = leftRect.left + leftRect.width / 2;
      const leftY = leftRect.top + leftRect.height / 2;

      const rightX = rightRect.left + rightRect.width / 2;
      const rightY = rightRect.top + rightRect.height / 2;

      // Midpoint between both eyes
      const midPointX = (leftX + rightX) / 2;
      const midPointY = (leftY + rightY) / 2;

      const dxMid = event.clientX - midPointX;
      const dyMid = event.clientY - midPointY;
      const midDistance = Math.sqrt(dxMid * dxMid + dyMid * dyMid);

      // --- Left Eye Baseline Trajectory ---
      const lDeltaX = event.clientX - leftX;
      const lDeltaY = event.clientY - leftY;
      const lDistance = Math.sqrt(lDeltaX * lDeltaX + lDeltaY * lDeltaY);

      // --- Right Eye Baseline Trajectory ---
      const rDeltaX = event.clientX - rightX;
      const rDeltaY = event.clientY - rightY;
      const rDistance = Math.sqrt(rDeltaX * rDeltaX + rDeltaY * rDeltaY);

      let leftFinalX = lDistance > 0 ? (lDeltaX / lDistance) * maxTranslateX : 0;
      let leftFinalY = lDistance > 0 ? (lDeltaY / lDistance) * maxTranslateY : 0;

      let rightFinalX = rDistance > 0 ? (rDeltaX / rDistance) * maxTranslateX : 0;
      let rightFinalY = rDistance > 0 ? (rDeltaY / rDistance) * maxTranslateY : 0;

      // FORCE MULTIPLIER ZONE:
      const crossThreshold = 140; // Expanded zone for early transition
      if (midDistance < crossThreshold) {
        const forceFactor = 1 - (midDistance / crossThreshold);

        // Force a hard cross: left pupil slides completely right (+), right pupil slides completely left (-)
        leftFinalX = (leftFinalX * (1 - forceFactor)) + (maxTranslateX * forceFactor);
        rightFinalX = (rightFinalX * (1 - forceFactor)) + (-maxTranslateX * forceFactor);

        // Align vertical tracking while crossed
        leftFinalY = (leftFinalY * (1 - forceFactor)) + ((dyMid / (crossThreshold || 1)) * maxTranslateY * forceFactor);
        rightFinalY = (rightFinalY * (1 - forceFactor)) + ((dyMid / (crossThreshold || 1)) * maxTranslateY * forceFactor);
      }

      setLeftPupil({ x: leftFinalX, y: leftFinalY });
      setRightPupil({ x: rightFinalX, y: rightFinalY });
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);

  return (
    <div className="space-y-8">
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes eyeBlink {
          0%, 96%, 100% { transform: scaleY(1); }
          98% { transform: scaleY(0.1); }
        }
        .animate-blink {
          animation: eyeBlink 5s infinite linear;
        }
      `}} />

      {/* Profile Image */}
      <div className="flex justify-center lg:justify-start">
        <div className="relative h-24 w-24 overflow-hidden rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 lg:h-24 lg:w-24">
          <Image
            src="/assets/profile.jpg"
            alt="Axel John Nuqui"
            fill
            sizes="(max-width: 1024px) 96px, 96px"
            className="object-cover"
          />
        </div>
      </div>

      {/* Name & Title */}
      <div>
        <h1 className="font-display text-5xl font-bold lg:text-[2.8rem]">
          Axel John <br />Nuqui
        </h1>

        <p className="mt-1 text-lg text-zinc-400">
          Aspiring Full Stack Developer
        </p>

        <p className="mt-1 text-sm text-zinc-500">
          Iloilo City, Philippines
        </p>
      </div>

      {/* Bio */}
      <div className="max-w-sm leading-[2rem] text-zinc-400 text-base">
        I'm building web and mobile applications using{" "}
        {technologies.map((tech, index) => (
          <span key={tech.name}>
            <span className="hover:cursor-pointer inline-flex items-center gap-1.5 rounded-[0.5rem] border border-dashed border-zinc-500 bg-white/10 backdrop-blur-xl border border-white/10 px-2.5 py-[0.2rem] text-sm text-zinc-300">
              <span className="relative h-4 w-4 inline-block">
                <Image
                  src={tech.logo}
                  alt={`${tech.name} logo`}
                  fill
                  sizes="16px"
                  className="object-contain"
                  onError={(e) => {
                    e.currentTarget.style.display = 'none';
                  }}
                />
              </span>
              <span className='font-bold'>{tech.name}</span>
            </span>
            {index < technologies.length - 1 && " , "}
          </span>
        ))}
        {" "}and passionate about creating solutions that will solve real-world problems.
      </div>

      {/* Quick Links & Actions */}
      <div className="flex flex-col gap-4">
        {/* Matte Black Resume Button */}
        <a
          href="/resume.pdf"
          target="_blank"
          rel="noopener noreferrer"
          className="group inline-flex w-fit items-center gap-3 rounded-full border border-zinc-800 bg-zinc-950 px-5 py-2.5 text-sm font-medium text-zinc-200 transition hover:bg-zinc-900 hover:text-white"
        >
          <span>Resume</span>
          
          {/* Eyes Container */}
          <div className="flex gap-1 bg-transparent">
            {/* Left Eye */}
            <div 
              ref={leftEyeRef}
              className="animate-blink relative h-5 w-5 p-px rounded-full border border-white bg-black origin-center"
            >
              {/* Pupil Wrapper: Absolute center layout with no padding boundaries */}
              <div 
                className="absolute inset-0 flex items-center justify-center transition-transform duration-75 ease-out"
                style={{ transform: `translate(${leftPupil.x}px, ${leftPupil.y}px)` }}
              >
                {/* Pupil */}
                <div className="h-1.5 w-1.5 rounded-full bg-white shrink-0" />
              </div>
            </div>

            {/* Right Eye */}
            <div 
              ref={rightEyeRef}
              className="animate-blink relative flex h-5 w-5 p-px rounded-full border border-white bg-black origin-center"
            >
              {/* Pupil Wrapper: Absolute center layout with no padding boundaries */}
              <div 
                className="absolute inset-0 flex items-center justify-center transition-transform duration-75 ease-out"
                style={{ transform: `translate(${rightPupil.x}px, ${rightPupil.y}px)` }}
              >
                {/* Pupil */}
                <div className="h-1.5 w-1.5 rounded-full bg-white shrink-0" />
              </div>
            </div>
          </div>
        </a>

        {/* White Get in Touch Button */}
        <a
          href="mailto:youremail@example.com"
          className="inline-flex w-fit items-center justify-center rounded-full bg-white px-5 py-2.5 text-sm font-medium text-black transition hover:bg-zinc-100"
        >
          Get in Touch
        </a>

        {/* Social Icons Array */}
        <div className="flex items-center gap-2 pt-1">
          <a
            href="https://facebook.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-transparent text-zinc-400 transition hover:bg-zinc-900/50 hover:text-white"
            aria-label="Facebook"
          >
            <FaFacebookF size={18} />
          </a>

          <a
            href="https://linkedin.com/in/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-transparent text-zinc-400 transition hover:bg-zinc-900/50 hover:text-white"
            aria-label="LinkedIn"
          >
            <FaLinkedinIn size={18} />
          </a>

          <a
            href="https://github.com/yourusername"
            target="_blank"
            rel="noopener noreferrer"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-transparent text-zinc-400 transition hover:bg-zinc-900/50 hover:text-white"
            aria-label="GitHub"
          >
            <FaGithub size={18} />
          </a>

          <a
            href="mailto:youremail@example.com"
            className="flex h-9 w-9 items-center justify-center rounded-lg bg-transparent text-zinc-400 transition hover:bg-zinc-900/50 hover:text-white"
            aria-label="Email"
          >
            <IoMdMail size={20} />
          </a>
        </div>
      </div>
    </div>
  );
}