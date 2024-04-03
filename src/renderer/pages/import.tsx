/* eslint-disable no-console */
import { Form, Formik } from 'formik';
import React, { useEffect, useState } from 'react';
import { v4 } from 'uuid';

declare module 'react' {
  interface InputHTMLAttributes<T> extends React.HTMLAttributes<T> {
    directory?: string;
    webkitdirectory?: string;
  }
}

interface IValues {
  dir: string;
}

function ImportPage() {
  const { ipcRenderer } = window as any;
  const initialValues: IValues = { dir: '' };
  const [filesSize, setFilesSize] = useState<number>(0);
  const [files, setFiles] = useState<
    { id: string; name: string; data: string; words: string[] }[]
  >([]);

  const handleSubmit = ({ dir }: IValues) => {
    ipcRenderer.send('file:list', { dir });
  };

  useEffect(() => {
    ipcRenderer.on('list:complete', async (event: any, data: any) => {
      setFiles(data.files);
    });
  }, [ipcRenderer]);

  return (
    <div id="import">
      <h1>Import</h1>
      <Formik initialValues={initialValues} onSubmit={handleSubmit}>
        {({ setFieldValue }) => (
          <Form>
            {filesSize === 0 && (
              <div>
                <label
                  htmlFor="file"
                  style={{
                    backgroundColor: 'white',
                    color: '#09f',
                    fontSize: 20,
                    fontWeight: 'bold',
                    padding: 10,
                    border: 'none',
                    borderRadius: 10,
                  }}
                >
                  Sélectionner un dossier
                  <input
                    id="file"
                    name="file"
                    type="file"
                    webkitdirectory=""
                    onChange={(event) => {
                      const pathTmp = (
                        event.target.files?.[0].path || ''
                      ).split('\\');
                      pathTmp.splice(-1);
                      const dir = pathTmp.join('\\');
                      setFieldValue('dir', dir);
                      setFilesSize(event.target.files?.length ?? 0);
                    }}
                    style={{ visibility: 'hidden', backgroundColor: 'green' }}
                  />
                </label>
              </div>
            )}

            <div
              style={{
                color: 'white',
                padding: 10,
                borderRadius: 10,
              }}
            >
              {filesSize} fichier{filesSize > 1 ? 's' : ''} à importer
            </div>
            {filesSize > 0 && (
              <>
                <button
                  type="submit"
                  style={{
                    backgroundColor: 'white',
                    color: '#09f',
                    fontSize: 20,
                    fontWeight: 'bold',
                    padding: 10,
                    border: 'none',
                    borderRadius: 10,
                  }}
                >
                  Aperçu
                </button>
                <button
                  type="submit"
                  style={{
                    backgroundColor: 'white',
                    color: '#09f',
                    fontSize: 20,
                    fontWeight: 'bold',
                    padding: 10,
                    border: 'none',
                    borderRadius: 10,
                  }}
                >
                  Importer
                </button>
              </>
            )}
          </Form>
        )}
      </Formik>
      <ul
        style={{
          display: 'flex',
          flexDirection: 'column',
          backgroundColor: '#222',
          padding: '4px',
          border: 'none',
          borderRadius: '10px',
        }}
      >
        {files.map((d) => (
          <li
            style={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              backgroundColor: '#333',
              marginBottom: '4px',
              padding: '10px',
              height: '100%',
              border: 'none',
              borderRadius: '8px',
            }}
            key={v4()}
          >
            <div
              style={{
                display: 'flex',
                flexDirection: 'row',
                alignItems: 'center',
                backgroundColor: '#333',
                marginBottom: '4px',
                padding: '10px',
                width: '100%',
                border: 'none',
                borderRadius: '8px',
              }}
            >
              <h3>{d.name}</h3>
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '50%',
                alignItems: 'center',
                backgroundColor: 'green',
                padding: '10px',
                height: '100%',
                border: 'none',
              }}
            >
              <img
                alt="alt"
                width="200"
                height="200"
                src={d.data}
                style={{ borderRadius: 10 }}
              />
            </div>
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                width: '50%',
                alignItems: 'center',
                backgroundColor: 'red',
                height: '100%',
                border: 'none',
              }}
            >
              <ul>
                {d.words.map((word) => (
                  <li key={v4()}>{word}</li>
                ))}
              </ul>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default ImportPage;
