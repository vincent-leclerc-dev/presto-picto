/* eslint-disable no-console */
import Page from '../components/page/Page';

function EditorPage() {
  // TODO move audio description optionnal in parameters
  /*
  const synth = window.speechSynthesis;
  const [voice] = synth.getVoices();
  const utterThis = useMemo(() => new SpeechSynthesisUtterance(), []);
  */

  return (
    <div id="editor" className="mx-auto w-[1024px] pt-8 h-full bg-white">
      <Page />
    </div>
  );
}

export default EditorPage;
