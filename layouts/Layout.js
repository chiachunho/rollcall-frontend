export default function Layout({ children }) {
  return (
    <div className="min-h-screen lg:h-screen lg:flex block items-center justify-center bg-sky-50 p-6 lg:space-x-6 space-y-6 lg:space-y-0">
      {children}
    </div>
  );
}
