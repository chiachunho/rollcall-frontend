import { useSession, signOut } from 'next-auth/react';
import axiosInstance from '../components/axiosInstance';
import Layout from '../layouts/Layout';
import Result from '../components/Result';
import MainCard from '../components/MainCard';
import SideList from '../components/SideList';
import Link from 'next/link';
import { unstable_getServerSession } from 'next-auth';
import { authOptions } from './api/auth/[...nextauth]';

export default function Home({ courses }) {
  const { data: session } = useSession({ required: true });

  return (
    <>
      <MainCard
        leftContent={<h1 className="text-white font-medium text-2xl m-3 tracking-wider">學生證點名輔助系統</h1>}
      >
        {session ? <h1 className="font-medium text-3xl tracking-wider">Hi, {session.user.username}!</h1> : null}
        <Result heading={'點擊右方課程來進行點名'} />
        <button
          type="button"
          className="my-3 p-3 font-medium text-white hover:text-sky-800 rounded-md bg-sky-800 hover:bg-sky-200 transition-all ease-linear"
          onClick={() => {
            signOut();
          }}
        >
          登出
        </button>
      </MainCard>
      <SideList heading="已建立課程名單">
        {courses.map((course, idx) => (
          <Course key={idx} id={course.id} name={course.name} />
        ))}
      </SideList>
    </>
  );
}

function Course({ name, id }) {
  return (
    <Link href={`${id}`}>
      <div className="shadow-md rounded-md flex flex-row max-h-full hover:bg-slate-100 cursor-pointer transition-all ease-linear">
        <div className="bg-sky-800 w-1.5 rounded-l-md"></div>
        <div className="p-3 flex-grow">
          📗 {id} {name}
        </div>
      </div>
    </Link>
  );
}

export async function getServerSideProps({ req, res }) {
  const session = await unstable_getServerSession(req, res, authOptions);

  if (session) {
    axiosInstance.defaults.headers.common['Authorization'] = 'JWT ' + session.accessToken;
    const response = await axiosInstance.get(`courses/`);
    return { props: { courses: response.data } };
  }

  return {
    redirect: {
      destination: '/api/auth/signin',
      permanent: false,
    },
  };
}

Home.layout = Layout;
Home.auth = true;
