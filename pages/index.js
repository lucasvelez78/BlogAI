import Link from "next/link";
import Image from "next/image";
import aiImage from "../public/bg-AI.webp";
import { Logo } from "../components/Logo";

export default function Home() {
  return (
    <div className="w-screen h-screen items-center flex justify-center overflow-hidden relative">
      <Image src={aiImage} alt="background" fill className="absolute" />
      <div className="relative z-10 text-white px-10 py-5 max-w-screen-sm bg-slate-900/70 rounded-md backdrop-blur-sm block">
        <Logo />
        <p className="mb-6">
          The AI-powered to generate SEO-optimized blog posts in minutes. Get
          high quality content, without sacrificing your time.
        </p>
        <Link href="/post/new" className="btn">
          Begin
        </Link>
      </div>
    </div>
  );
}
