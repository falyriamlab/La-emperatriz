import Image from "next/image";

export function Footer() {
  return (
    <footer className="bg-crema px-6 py-10 text-center">
      <Image
        src="/logo/logo-horizontal-morado.svg"
        alt=""
        aria-hidden="true"
        width={666}
        height={102}
        className="mx-auto h-6 w-auto"
      />
      <p className="mt-4 text-sm font-bold text-morado-oscuro">Puente</p>
      <p className="mt-2 text-sm text-negro/60">somosesepuente@gmail.com</p>
      <p className="mt-1 text-sm text-negro/60">@somosesepuente</p>
    </footer>
  );
}
