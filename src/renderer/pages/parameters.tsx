/* eslint-disable no-console */
import { ChangeEvent, FormEvent, useContext, useState } from 'react';
import { ConfigType } from '../config';
import { ConfigContext } from '../contexts/ConfigProvider';

function ParametersPage() {
  const config = useContext(ConfigContext) as ConfigType;

  const [footerAlign, setFooterAlign] = useState<string>(
    config.footer.position,
  );

  const handleFooterAlign = (changeEvent: ChangeEvent<HTMLInputElement>) => {
    setFooterAlign(changeEvent.target.value);
  };

  const handleFormSubmit = (formSubmitEvent: FormEvent) => {
    formSubmitEvent.preventDefault();
  };
  return (
    <div id="parameters">
      <div className="ml-8 text-center cursor-default hidden lg:block ">
        Chrome:{' '}
        <span className="dark:text-sky-500" id="chromeVersion">
          {window.versions.chrome()}
        </span>
      </div>
      <div className="ml-8 text-center cursor-default hidden lg:block">
        Electron:{' '}
        <span className="dark:text-sky-500" id="electronVersion">
          {window.versions.electron()}
        </span>
      </div>
      <div className="ml-8 text-center cursor-default hidden lg:block">
        Node:{' '}
        <span className="dark:text-sky-500" id="nodeVersion">
          {window.versions.node()}
        </span>
      </div>
      <form onSubmit={handleFormSubmit}>
        <label htmlFor="footerAlignLeft">
          Gauche
          <input
            name="footerAlignLeft"
            value="left"
            type="radio"
            checked={footerAlign === 'left'}
            onChange={handleFooterAlign}
          />
        </label>
        <label htmlFor="footerAlignCenter">
          Center
          <input
            name="footerAlignCenter"
            value="center"
            type="radio"
            checked={footerAlign === 'center'}
            onChange={handleFooterAlign}
          />
        </label>
        <label htmlFor="footerAlignRight">
          Droite
          <input
            name="footerAlignRight"
            value="right"
            type="radio"
            checked={footerAlign === 'right'}
            onChange={handleFooterAlign}
          />
        </label>
        <button type="submit" className="btn warning m-8 p-12">
          Enregister
        </button>
      </form>
    </div>
  );
}

export default ParametersPage;
