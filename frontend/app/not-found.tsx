import Link from "next/link";
import Image from "next/image";
import nerobik from "@/assets/nerobik.jpg";

export default function NotFound() {
  return (
    <section className="flex flex-col items-center justify-center gap-8 py-20 text-center">
      <div className="relative">
        <Image
          src={nerobik}
          alt="Nerobik"
          width={400}
          height={400}
          className="rounded-xl object-cover shadow-lg"
        />
        <div className="absolute -right-4 -top-4 bg-nebori-primary text-white text-4xl font-bold px-4 py-2 rounded-lg">
          404
        </div>
      </div>
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold">Сторінка не знайдена</h2>
        <p className="text-nebori-muted">
          Сторінка, яку ви шукаєте, не існує або була переміщена.
        </p>
      </div>
      <Link href="/" className="btn-primary px-6 py-2.5">
        На головну
      </Link>
    </section>
  );
}
