import {Player} from "@/components/player";

export default async function Home(): Promise<JSX.Element> {
  

  return (
    <div className="fixed bottom-0 right-0 sm:w-4/5 w-full p-2">
      <Player
        title="Take Me - DJ Jay Sudo"
        url="http://127.0.0.1:8000/media/uploads/Mans/Sounds/melodies/fx_bliepje.wav"
        author="me"
        thumbnail="#"
      />
    </div>
    
  );
}
