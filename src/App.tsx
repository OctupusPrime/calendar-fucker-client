import { Component, createSignal } from 'solid-js';
import OauthPopup from '@/components/elements/OauthPopup';
import getGoogleOAuthURL from '@/hooks/getGoogleUrl';
import wsServerRes from '@/hooks/wsServerRes';

const App: Component = () => {
  const [roomId, setRoomId] = createSignal('')

  const [addWs] = wsServerRes()

  const handleReq = async () => {
    const request =  await fetch(
      `http://localhost:8080/test/${roomId()}`,
      {
        method: 'GET',
        credentials: "include",
      }
    )

    const data = await request.json()

    console.log(data)
  }

  const handleCode = (code: string) => {
    console.log("wooooo a code", code);
  }

  return (
    <div class='max-w-lg w-full mx-auto pt-4'>
      <p class='text-2xl font-bold text-center'>Calendar Fucker</p>
      <div class='flex flex-col items-center gap-2'>
        <OauthPopup
          url={getGoogleOAuthURL()}
          onClose={() => console.log('close')}
          onCode={handleCode}>
          <>
            <p>show popup</p>
          </>
        </OauthPopup>
        <input type="text"
          class='w-full border-2 border-blue-500 rounded-md px-3 py-2'
          value={roomId()}
          onInput={(e) => setRoomId(e.currentTarget.value)}/>
        <button class='text-red-400'
          onClick={handleReq}>
          Send Req
        </button>
        <button class='text-blue-400'
          onClick={() => addWs(roomId())}>
          Connect
        </button>
      </div>

    </div>
  );
};

export default App;
