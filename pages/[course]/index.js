import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';
import axiosInstance from '../../components/axiosInstance';
import Layout from '../../layouts/Layout';
import MainCard from '../../components/MainCard';
import SideList from '../../components/SideList';
import Link from 'next/link';

export default function Course({ course }) {
  const router = useRouter();
  const { data: session } = useSession({ required: true });

  const handleSubmit = async (event) => {
    event.preventDefault();
    const date = event.target.date.value;
    const name = event.target.name.value;

    axiosInstance.defaults.headers.common['Authorization'] = 'JWT ' + session.accessToken;
    axiosInstance
      .post(`events/`, {
        course: course.id,
        name,
        date,
        status: true,
      })
      .then((res) => {
        console.log(res);
        router.push(`${course.id}/${res.data.id}`);
      })
      .catch((err) => {
        console.error('error', err);
      });
  };

  return (
    <>
      <MainCard
        leftContent={
          <>
            <h1 className="text-white font-medium text-2xl tracking-wider">{course.name}</h1>
            <h2 className="text-white text-lg">{course.id}</h2>
          </>
        }
      >
        <h1 className="font-medium text-3xl tracking-wider">新增點名活動</h1>
        <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-gray-700">活動日期</span>
            <input
              type="date"
              name="date"
              defaultValue={new Date().toLocaleDateString('en-CA')}
              className="
                    mt-0
                    block
                    w-full
                    px-0.5
                    border-0 border-b-2 border-gray-200
                    focus:ring-0 focus:border-sky-800
                  "
            />
          </label>
          <label className="block">
            <span className="text-gray-700">活動名稱</span>
            <input
              type="text"
              name="name"
              className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-sky-800"
              placeholder=""
              required
            />
          </label>
          <button
            type="submit"
            className="my-3 p-3 font-medium text-white hover:text-sky-800 rounded-md bg-sky-800 hover:bg-sky-200 transition-all ease-linear"
          >
            新增並開始簽到
          </button>
        </form>
      </MainCard>
      <SideList heading="點名單紀錄">
        {course.events.map((event, idx) => (
          <Event key={idx} id={event.id} date={event.date} name={event.name} course={course.id} />
        ))}
      </SideList>
    </>
  );
}

function Event({ name, id, date, course }) {
  return (
    <Link href={`${course}/${id}`}>
      <div className="shadow-md rounded-md flex flex-row max-h-full hover:bg-slate-100 cursor-pointer transition-all ease-linear">
        <div className="bg-sky-800 w-1.5 rounded-l-md"></div>
        <div className="p-3 flex-grow">
          📝 {date} - {name}
        </div>
      </div>
    </Link>
  );
}

export async function getServerSideProps({ params }) {
  const { course } = params;
  try {
    const res = await axiosInstance.get(`courses/${course}/`);
    return { props: { course: res.data } };
  } catch (e) {
    return {
      redirect: {
        destination: '/api/auth/signin',
        permanent: false,
      },
    };
  }
}

Course.auth = true;
Course.layout = Layout;
