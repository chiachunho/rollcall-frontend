export default function Layout({ children }) {
  return (
    <div className="min-h-screen md:h-screen md:flex block items-center justify-center bg-sky-50 p-6 md:space-x-6 space-y-6 md:space-y-0">
      {children}
    </div>
  );
}
