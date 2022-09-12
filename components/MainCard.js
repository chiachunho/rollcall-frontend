import Image from 'next/image';

export default function MainCard({ children, leftContent }) {
  return (
    <section className="w-full lg:max-w-3xl lg:w-3/4 xl:w-8/12 shadow-2xl flex flex-col md:flex-row rounded-lg flex-shrink place-self-center">
      <div className="w-full md:w-5/12 bg-sky-800 text-center min-h-full rounded-t-lg md:rounded-l-lg md:rounded-tr-none flex flex-col p-6">
        <div className="p-6 flex items-center justify-center flex-grow">
          <div className="p-6 bg-white rounded-full aspect-square leading-[0] shadow-lg">
            <Image src="/ntust_logo.png" height="100%" width="100%" className=" rounded-full" alt="ntust_logo"></Image>
          </div>
        </div>
        <div className="text-white space-y-3">{leftContent}</div>
      </div>
      <div className="w-full md:w-7/12 bg-white p-6 space-y-6 rounded-lg flex flex-col justify-center overflow-y-auto">
        {children}
      </div>
    </section>
  );
}
