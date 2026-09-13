"use client";

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';
import { FaFacebookF, FaGithub, FaLinkedinIn } from 'react-icons/fa';
import { IoMdMail } from 'react-icons/io';

const MATRIX_CHARS =
  'ﾊﾐﾋｰｳｼﾅﾓﾆｻﾜﾂｵﾘｱﾎﾃﾏｹﾒｴｶｷﾑﾕﾗｾﾈｽﾀﾇﾍ012345789Z:・."*=_+-<>[]{}';

export default function HeroSidebar() {
  const technologies = [
    { name: "React", logo: "/assets/logos/reacticon.svg" },
    { name: "Next.js", logo: "/assets/logos/nextjsicon.png" },
    { name: "TypeScript", logo: "/assets/logos/typescripticon.svg" },
    { name: "Flutter", logo: "/assets/logos/fluttericon.svg" },
    { name: "React Native", logo: "/assets/logos/reacticon.svg" },
  ];

  // Glitch states
  const [profileGlitch, setProfileGlitch] = useState(false);
  const [nameGlitch, setNameGlitch] = useState(false);
  const [glitchText, setGlitchText] = useState('');
  const [displayName, setDisplayName] = useState('Axel John Nuqui');
  const [displayTitle, setDisplayTitle] = useState('Aspiring Full Stack AI Engineer');
  
  // Refs for Matrix effect
  const nameRafRef = useRef<number | null>(null);
  const nameIterationRef = useRef(0);
  const nameLastFrameRef = useRef(0);
  const originalNameRef = useRef('Axel John Nuqui');
  const originalTitleRef = useRef('Aspiring Full Stack AI Engineer');

  const leftEyeRef = useRef<HTMLDivElement>(null);
  const rightEyeRef = useRef<HTMLDivElement>(null);

  const [leftPupil, setLeftPupil] = useState({ x: 0, y: 0 });
  const [rightPupil, setRightPupil] = useState({ x: 0, y: 0 });

  // Name glitch variations (different languages/writings)
  const nameVariations = [
    { text: "アクセル・ジョン・ヌキ", lang: "Japanese" },
    { text: "악셀 존 누키", lang: "Korean" },
    { text: "阿克塞尔·约翰·努基", lang: "Chinese" },
    { text: "Աքսել Ջոն Նուկի", lang: "Armenian" },
    { text: "აქსელ ჯონ ნუკი", lang: "Georgian" },
    { text: "Αξελ Τζον Νούκι", lang: "Greek" },
    { text: "Аксель Джон Нуки", lang: "Russian" },
    { text: "أكسل جون نوكي", lang: "Arabic" },
    { text: "Aksel Jon Nuki", lang: "Turkish" },
    { text: "אקסל ג'ון נוקי", lang: "Hebrew" },
  ];

  // Title glitch variations (other skills)
  const titleVariations = [
    { text: "Backend Developer", icon: "⚙️" },
    { text: "AI Engineer", icon: "🤖" },
    { text: "Scaling Systems Architect", icon: "📈" },
    { text: "Cloud Infrastructure Engineer", icon: "☁️" },
    { text: "DevOps Specialist", icon: "🚀" },
    { text: "Machine Learning Engineer", icon: "🧠" },
  ];

  // Matrix effect for name
  const startNameMatrixEffect = () => {
    if (nameRafRef.current) cancelAnimationFrame(nameRafRef.current);
    nameIterationRef.current = 0;
    const originalText = originalNameRef.current;
    const maxIterations = originalText.length * 2;
    const frameInterval = 30;

    const animate = (timestamp: number) => {
      if (timestamp - nameLastFrameRef.current < frameInterval) {
        nameRafRef.current = requestAnimationFrame(animate);
        return;
      }
      nameLastFrameRef.current = timestamp;

      nameIterationRef.current += 0.5;
      const iter = nameIterationRef.current;

      if (iter >= maxIterations) {
        setDisplayName(originalText);
        nameRafRef.current = null;
        // Also trigger language glitch
        if (Math.random() < 0.5) {
          const randomVar = nameVariations[Math.floor(Math.random() * nameVariations.length)];
          setGlitchText(randomVar.text);
          setNameGlitch(true);
          setTimeout(() => {
            setNameGlitch(false);
          }, 800 + Math.random() * 600);
        }
        return;
      }

      setDisplayName(
        originalText
          .split('')
          .map((char, index) =>
            index < iter
              ? originalText[index]
              : MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
          )
          .join(''),
      );

      nameRafRef.current = requestAnimationFrame(animate);
    };

    nameRafRef.current = requestAnimationFrame(animate);
  };

  const stopNameMatrixEffect = () => {
    if (nameRafRef.current) {
      cancelAnimationFrame(nameRafRef.current);
      nameRafRef.current = null;
    }
    setDisplayName(originalNameRef.current);
  };

  // Matrix effect for title
  const startTitleMatrixEffect = () => {
    const originalText = originalTitleRef.current;
    let iteration = 0;
    const maxIterations = originalText.length * 2;
    
    // Also show glitch overlay with skill variations
    let count = 0;
    const glitchInterval = setInterval(() => {
      const randomVar = titleVariations[Math.floor(Math.random() * titleVariations.length)];
      setDisplayTitle(`${randomVar.icon} ${randomVar.text}`);
      count++;
      if (count >= 3) {
        clearInterval(glitchInterval);
        // Reset to original after glitch
        setTimeout(() => {
          setDisplayTitle(originalText);
        }, 300);
      }
    }, 200);

    // Scramble effect
    const interval = setInterval(() => {
      setDisplayTitle(
        originalText
          .split('')
          .map((char, index) =>
            index < iteration
              ? originalText[index]
              : MATRIX_CHARS[Math.floor(Math.random() * MATRIX_CHARS.length)],
          )
          .join(''),
      );

      iteration += 1;

      if (iteration >= maxIterations) {
        clearInterval(interval);
        setDisplayTitle(originalText);
      }
    }, 30);

    return () => {
      clearInterval(interval);
      clearInterval(glitchInterval);
    };
  };

  // Trigger random name glitch
  useEffect(() => {
    const interval = setInterval(() => {
      if (Math.random() < 0.2) {
        startNameMatrixEffect();
      }
    }, 6000 + Math.random() * 4000);

    return () => {
      clearInterval(interval);
      if (nameRafRef.current) {
        cancelAnimationFrame(nameRafRef.current);
      }
    };
  }, []);

  // Profile image glitch effect (triggered on hover)
  const handleProfileHover = () => {
    setProfileGlitch(true);
    setTimeout(() => {
      setProfileGlitch(false);
    }, 500);
  };

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      if (!leftEyeRef.current || !rightEyeRef.current) return;

      const maxTranslateX = 7.5;
      const maxTranslateY = 6.5;

      const leftRect = leftEyeRef.current.getBoundingClientRect();
      const rightRect = rightEyeRef.current.getBoundingClientRect();

      const leftX = leftRect.left + leftRect.width / 2;
      const leftY = leftRect.top + leftRect.height / 2;
      const rightX = rightRect.left + rightRect.width / 2;
      const rightY = rightRect.top + rightRect.height / 2;

      const midPointX = (leftX + rightX) / 2;
      const midPointY = (leftY + rightY) / 2;

      const dxMid = event.clientX - midPointX;
      const dyMid = event.clientY - midPointY;
      const midDistance = Math.sqrt(dxMid * dxMid + dyMid * dyMid);

      const lDeltaX = event.clientX - leftX;
      const lDeltaY = event.clientY - leftY;
      const lDistance = Math.sqrt(lDeltaX * lDeltaX + lDeltaY * lDeltaY);

      const rDeltaX = event.clientX - rightX;
      const rDeltaY = event.clientY - rightY;
      const rDistance = Math.sqrt(rDeltaX * rDeltaX + rDeltaY * rDeltaY);

      let leftFinalX = lDistance > 0 ? (lDeltaX / lDistance) * maxTranslateX : 0;
      let leftFinalY = lDistance > 0 ? (lDeltaY / lDistance) * maxTranslateY : 0;
      let rightFinalX = rDistance > 0 ? (rDeltaX / rDistance) * maxTranslateX : 0;
      let rightFinalY = rDistance > 0 ? (rDeltaY / rDistance) * maxTranslateY : 0;

      const crossThreshold = 140;
      if (midDistance < crossThreshold) {
        const forceFactor = 1 - (midDistance / crossThreshold);
        leftFinalX = (leftFinalX * (1 - forceFactor)) + (maxTranslateX * forceFactor);
        rightFinalX = (rightFinalX * (1 - forceFactor)) + (-maxTranslateX * forceFactor);
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

        @keyframes glitchProfile {
          0% { transform: translate(0) scale(1); filter: none; }
          10% { transform: translate(-3px, 2px) scale(0.98); filter: hue-rotate(90deg) contrast(1.5); }
          20% { transform: translate(3px, -2px) scale(1.02); filter: hue-rotate(180deg) brightness(1.3); }
          30% { transform: translate(-2px, 3px) scale(0.99); filter: hue-rotate(270deg) saturate(2); }
          40% { transform: translate(2px, -3px) scale(1.01); filter: hue-rotate(360deg) contrast(1.2); }
          50% { transform: translate(-1px, 1px) scale(1); filter: none; }
          100% { transform: translate(0) scale(1); filter: none; }
        }
        @keyframes glitchScanline {
          0% { transform: translateY(-100%); }
          100% { transform: translateY(100%); }
        }
        @keyframes glitchTextName {
          0% { transform: skewX(0deg) translate(0); opacity: 1; }
          10% { transform: skewX(15deg) translate(-2px, 1px); opacity: 0.7; text-shadow: 3px 0 rgba(255,0,0,0.7), -3px 0 rgba(0,0,255,0.7); }
          20% { transform: skewX(-15deg) translate(2px, -1px); opacity: 0.9; text-shadow: -3px 0 rgba(255,0,0,0.7), 3px 0 rgba(0,0,255,0.7); }
          30% { transform: skewX(8deg) translate(-1px, 2px); opacity: 0.8; text-shadow: 4px 0 rgba(0,255,0,0.5), -4px 0 rgba(128,0,128,0.5); }
          40% { transform: skewX(-8deg) translate(1px, -2px); opacity: 0.6; }
          50% { transform: skewX(0deg) translate(0); opacity: 1; text-shadow: none; }
          100% { transform: skewX(0deg) translate(0); opacity: 1; }
        }
        .glitch-profile-active {
          animation: glitchProfile 0.5s ease-in-out;
        }
        .glitch-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: repeating-linear-gradient(
            0deg,
            transparent 0px,
            transparent 2px,
            rgba(0, 255, 0, 0.03) 2px,
            rgba(0, 255, 0, 0.03) 4px
          );
          pointer-events: none;
          animation: glitchScanline 0.3s linear infinite;
          border-radius: 50%;
        }
        .glitch-text-shadow {
          text-shadow: 3px 0 rgba(255, 0, 0, 0.5), -3px 0 rgba(0, 0, 255, 0.5), 
                       0 3px rgba(0, 255, 0, 0.3), 0 -3px rgba(255, 255, 0, 0.3);
        }
        .glitch-text-name-active {
          animation: glitchTextName 0.8s ease-in-out;
        }
        .name-glitch-wrapper {
          position: relative;
          display: inline-block;
        }
      `}} />

      {/* Profile Image with Glitch */}
      <div className="flex justify-center lg:justify-start">
        <div 
          className={`relative h-24 w-24 overflow-hidden rounded-full bg-gradient-to-br from-zinc-700 to-zinc-900 lg:h-24 lg:w-24 ${profileGlitch ? 'glitch-profile-active' : ''}`}
          onMouseEnter={handleProfileHover}
        >
          <Image
            src="/assets/profile.jpg"
            alt="Axel John Nuqui"
            fill
            sizes="(max-width: 1024px) 96px, 96px"
            className="object-cover"
          />
          {profileGlitch && (
            <>
              <div className="glitch-overlay" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-500/10 via-transparent to-blue-500/10 animate-pulse" />
              <div className="absolute inset-0 rounded-full bg-gradient-to-b from-transparent via-white/5 to-transparent animate-pulse" />
            </>
          )}
        </div>
      </div>

      {/* Name & Title */}
      <div>
        <h1 
          className="font-display text-5xl font-bold lg:text-[2.8rem] relative cursor-default"
          onMouseEnter={startNameMatrixEffect}
          onMouseLeave={stopNameMatrixEffect}
        >
          <span className="relative inline-block">
            {displayName}
            {nameGlitch && (
              <span 
                className="absolute top-0 left-0 w-full h-full flex items-center glitch-text-shadow glitch-text-name-active"
                style={{
                  color: 'white',
                  fontFamily: 'ClashDisplay, Hanken Grotesk, sans-serif',
                  whiteSpace: 'nowrap',
                }}
              >
                {glitchText}
              </span>
            )}
          </span>
        </h1>

        <p 
          className="mt-1 text-lg text-zinc-400 cursor-pointer transition-all duration-200 relative"
          onMouseEnter={() => {
            const cleanup = startTitleMatrixEffect();
            return () => cleanup?.();
          }}
          onClick={() => {
            const cleanup = startTitleMatrixEffect();
            return () => cleanup?.();
          }}
        >
          <span className="relative inline-block">
            {displayTitle}
          </span>
        </p>

        <p className="mt-1 text-sm text-zinc-500">
          Iloilo City, Philippines
        </p>
      </div>

      {/* Bio */}
      <div className="max-w-sm leading-[2rem] text-zinc-400 text-sm">
        I'm building web and mobile applications using{" "}
        {technologies.map((tech, index) => (
          <span key={tech.name}>
            <span className="hover:cursor-pointer inline-flex items-center gap-1.5 rounded-[0.5rem] border border-dashed border-zinc-500 bg-white/10 backdrop-blur-xl border border-white/10 px-2.5 py-[0.2rem] text-sm text-zinc-300 transition-all hover:scale-105 hover:border-zinc-400 hover:bg-white/20">
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
              <div 
                className="absolute inset-0 flex items-center justify-center transition-transform duration-75 ease-out"
                style={{ transform: `translate(${leftPupil.x}px, ${leftPupil.y}px)` }}
              >
                <div className="h-1.5 w-1.5 rounded-full bg-white shrink-0" />
              </div>
            </div>

            {/* Right Eye */}
            <div 
              ref={rightEyeRef}
              className="animate-blink relative flex h-5 w-5 p-px rounded-full border border-white bg-black origin-center"
            >
              <div 
                className="absolute inset-0 flex items-center justify-center transition-transform duration-75 ease-out"
                style={{ transform: `translate(${rightPupil.x}px, ${rightPupil.y}px)` }}
              >
                <div className="h-1.5 w-1.5 rounded-full bg-white shrink-0" />
              </div>
            </div>
          </div>
        </a>

        {/* White Get in Touch Button */}
        <a
          href="mailto:youremail@example.com"
          className="inline-flex w-fit items-center justify-center rounded-lg bg-white px-6 py-2 text-sm font-medium text-black transition hover:bg-zinc-100"
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