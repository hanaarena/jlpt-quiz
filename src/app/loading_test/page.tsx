// import UserAgentClient from './UserAgentClient';

export default async function LoadingTest() {
  // test to get remote api data
  const res = await fetch('https://randomuser.me/api/');
  const data = await res.json();

  return (
    <>
      {/* <UserAgentClient /> */}
      <div>{JSON.stringify(data)}</div>
    </>
  );
}
