import { useSession } from 'next-auth/react';
import { useState, useEffect, useRef } from 'react';
import Result from '../../components/Result';
import axiosInstance from '../../components/axiosInstance';
import Layout from '../../layouts/Layout';
import MainCard from '../../components/MainCard';
import SideList from '../../components/SideList';
import Head from 'next/head';

export default function Event({ event, course, id }) {
  const [color, setColor] = useState('bg-sky-800');
  const [heading, setHeading] = useState('請輸入學號或感應學生證');
  const [content, setContent] = useState('僅限國立臺灣科技大學學生證');
  const [records, setRecords] = useState(event.records);
  const [showStudent, setShowStudent] = useState(false);
  const { data: session } = useSession({ required: true });
  const formRef = useRef(null);

  const initStatus = {
    color: 'bg-sky-800',
    heading: '輸入學號或感應學生證',
    content: '僅限國立臺灣科技大學學生證',
  };

  const closedStatus = {
    color: 'bg-red-500',
    heading: '點名已經結束，無法簽到 ✋🏻',
    content: '下次請準時進教室 (´-﹏-`；)',
  };

  const errorStatus = {
    color: 'bg-red-500',
    heading: '簽到失敗，請再試一次 🥲',
    content: '(´-﹏-`；)',
  };

  useEffect(() => {
    if (event.status) {
      setStatus(initStatus);
    } else {
      setStatus(closedStatus);
    }
  }, [event.status]);

  useEffect(() => {
    if (showStudent) {
      formRef.current.student.focus();
    } else {
      formRef.current.key.focus();
    }
  }, [showStudent]);

  function setStatus({ color, heading, content }) {
    setColor(color);
    setHeading(heading);
    setContent(content);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    let student = event.target.student.value;
    let key = event.target.key.value;

    const existStatus = {
      color: 'bg-yellow-400',
      heading: '重複簽到 🤙🏻',
      content: student + ' 已經簽到過了喔 (´･ω･`)',
    };

    const notEnrollStatus = {
      color: 'bg-yellow-400',
      heading: `${student}${student ? '，' : ''}你是誰 😧`,
      content: `${student ? '該生' : '該卡'}未在選課資料中 (´･Д･)」${student ? '' : '，請嘗試將學生證綁定學號。'}`,
    };

    axiosInstance.defaults.headers.common['Authorization'] = 'JWT ' + session.accessToken;

    axiosInstance
      .post(`records/`, {
        student: student,
        key: key,
        event: id,
        status: 'arrived',
      })
      .then((res) => {
        setRecords([res.data].concat(records));
        setStatus({
          color: 'bg-green-600',
          heading: `嗨，${res.data.id_student} 👋🏻`,
          content: '簽到時間：' + new Date(res.data.created_at).toLocaleString('en-US', 'GMT+8'),
        });
        setShowStudent(false);
        event.target.key.value = '';
      })
      .catch((err) => {
        let status = errorStatus;
        let show = false;
        if (err.response) {
          if (err.response.status === 400) {
            if (err.response.data.non_field_errors) {
              if (err.response.data.non_field_errors.includes('ALREADY_EXIST')) {
                status = existStatus;
              } else if (err.response.data.non_field_errors.includes('NOT_ENROLL_STUDENT')) {
                status = notEnrollStatus;
              } else if (err.response.data.non_field_errors.includes('EVENT_CLOSED')) {
                status = closedStatus;
              }
            }
            if (err.response.data.student) {
              status = notEnrollStatus;
              show = student === '';
            }
          }
        }
        setStatus(status);
        setShowStudent(show);
        if (!show) {
          event.target.key.value = '';
        }
      })
      .finally(() => {
        event.target.student.value = '';
      });
  };
  return (
    <>
      <Head>
        <title>
          {event.name} - {event.course_name}｜學生證點名輔助系統
        </title>
        <meta property="og:title" content={`${event.name} - ${event.course_name}｜學生證點名輔助系統`} />
      </Head>
      <MainCard
        leftContent={
          <>
            <h1 className="text-white font-medium text-2xl tracking-wider">{event.course_name}</h1>
            <h2 className="text-white text-lg">{event.course}</h2>
            <div className="text-sky-800 text-base space-y-1 p-3 bg-white rounded-md font-medium ">
              <h2 className="">{event.date}</h2>
              {event.name ? <h2 className="">{event.name}</h2> : null}
            </div>
          </>
        }
      >
        <h1 className="font-medium text-3xl tracking-wider">請準備好學生證 🪪</h1>
        <form className="flex flex-col space-y-3" onSubmit={handleSubmit} ref={formRef}>
          <label className="block">
            <span className="text-gray-700">學號／學生證</span>
            <input
              type="text"
              name="key"
              className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-sky-800"
              placeholder="請將學生證靠近感應器或輸入學號"
              required
            />
          </label>

          <label className={`block ${showStudent ? '' : 'hidden'}`}>
            <span className="text-gray-700">學號</span>
            <input
              type="text"
              name="student"
              className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-sky-800"
              placeholder="輸入學號來綁定學生證"
            />
          </label>
          <button
            type="submit"
            className="my-3 p-3 font-medium text-white hover:text-sky-800 rounded-md bg-sky-800 hover:bg-sky-200 transition-all ease-linear"
          >
            簽到
          </button>
        </form>
        <Result color={color} heading={heading} content={content} />
      </MainCard>
      <SideList heading="已經簽到的人">
        {records.map((record, idx) => (
          <Attendee key={idx} name={record.id_student} time={record.created_at} status={record.status} />
        ))}
      </SideList>
    </>
  );
}

function Attendee({ name, time, status }) {
  let color = 'bg-sky-800';
  let emoji = '😵‍💫';

  if (status === 'arrived') {
    color = 'bg-green-600';
    emoji = '👋🏻';
  } else if (status === 'absent') {
    color = 'bg-red-500';
    emoji = '🫥';
  } else if (status === 'leave') {
    color = 'bg-yellow-400';
    emoji = '🥺';
  }
  return (
    <div className="shadow-md rounded-md flex flex-row max-h-full">
      <div className={`${color} w-1.5 rounded-l-md`}></div>
      <div className="p-3 flex-grow">
        {emoji} {name} - {new Date(time).toLocaleString('en-US', 'GMT+8')}
      </div>
    </div>
  );
}

export async function getServerSideProps({ params }) {
  const { course, event } = params;
  const res = await axiosInstance.get(`events/${event}/`);

  return { props: { event: res.data, course, id: event } };
}

Event.auth = true;
Event.layout = Layout;
