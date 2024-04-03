import UploadFormContainer from '../components/upload/UploadFormContainer';
import UploadFormProvider from '../contexts/UploadFormProvider';

function UploadPage() {
  return (
    <UploadFormProvider>
      <div className="flex flex-col h-full w-full justify-center items-center">
        <UploadFormContainer />
      </div>
    </UploadFormProvider>
  );
}

export default UploadPage;
