export default function SideList({ children, heading }) {
  return (
    <section className="w-full md:w-1/2 lg:w-5/12 h-full p-6 shadow-2xl rounded-lg bg-white space-y-6 flex flex-col">
      <div className="font-medium text-3xl tracking-wider flex-none">{heading}</div>
      <div className="space-y-3 overflow-y-auto pb-3 pr-3">{children}</div>
    </section>
  );
}
