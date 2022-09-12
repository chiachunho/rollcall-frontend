import { signIn } from 'next-auth/react';
import Layout from '../../layouts/Layout';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import Result from '../../components/Result';
import MainCard from '../../components/MainCard';
import Link from 'next/link';

export default function SignIn() {
  const router = useRouter();
  const [color, setColor] = useState('bg-sky-800');
  const [heading, setHeading] = useState('歡迎使用學生證點名輔助系統');
  const [content, setContent] = useState('請先登入後以繼續使用。');

  function setStatus({ color, heading, content }) {
    setColor(color);
    setHeading(heading);
    setContent(content);
  }

  const handleSubmit = async (event) => {
    event.preventDefault();
    const options = {
      username: event.target.username.value,
      password: event.target.password.value,
      redirect: true,
      callbackUrl: typeof router.query.callbackUrl !== undefined ? router.query.callbackUrl : null,
    };
    signIn('credentials', options);
  };

  const SessionRequiredStatus = {
    color: 'bg-yellow-400',
    heading: '此頁面需要權限 ✋🏻',
    content: '請先登入後繼續使用。',
  };

  const CredentialsSigninStatus = {
    color: 'bg-red-500',
    heading: '帳號密碼錯誤，請再試一次 🥲',
    content: '請檢查大小寫是有誤。',
  };

  useEffect(() => {
    if (typeof router.query.error !== undefined) {
      console.log(router.query.error);
      if (router.query.error === 'SessionRequired') {
        setStatus(SessionRequiredStatus);
      } else if (router.query.error === 'CredentialsSignin') {
        setStatus(CredentialsSigninStatus);
      }
    }
  }, [router]);

  return (
    <>
      <MainCard
        leftContent={<h1 className="text-white font-medium text-2xl m-3 tracking-wider">學生證點名輔助系統</h1>}
      >
        <h1 className="font-medium text-3xl tracking-wider">登入</h1>
        <form className="flex flex-col space-y-3" onSubmit={handleSubmit}>
          <label className="block">
            <span className="text-gray-700">帳號</span>
            <input
              type="text"
              name="username"
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
            <span className="text-gray-700">密碼</span>
            <input
              type="password"
              name="password"
              className="mt-0 block w-full px-0.5 border-0 border-b-2 border-gray-200 focus:ring-0 focus:border-sky-800"
              required
            />
          </label>
          <button
            type="submit"
            className="my-3 p-3 font-medium text-white hover:text-sky-800 rounded-md bg-sky-800 hover:bg-sky-200 transition-all ease-linear"
          >
            登入
          </button>
        </form>
        <Result color={color} heading={heading} content={content} />
      </MainCard>
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

SignIn.layout = Layout;
SignIn.auth = false;
