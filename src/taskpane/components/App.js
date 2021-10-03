import * as React from "react";
// images references in the manifest
import "../../../assets/icon-16.png";
import "../../../assets/icon-32.png";
import "../../../assets/icon-80.png";

import { useEffect, useState } from 'react';
import FileUploader from './FileUploader';
import UploadProgress from './UploadProgress';
import ResultList from './ResultList.js';
import axios from 'axios';

const InitialMode = 0;
const UploadMode = 1;
const ResultMode = 2;

/* global console, Excel, require */

function App() {

  const [file, setFile] = useState(undefined);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [results, setResults] = useState([]);
  const [initialResult, setInitialResult] = useState([]);
  const [mode, setMode] = useState(InitialMode);

  const sleep = (ms) => {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  const reset = () => {
    setMode(InitialMode);
    axios.request({
      method: 'get',
      url: 'https://opendatalinter.volare.site/'
    }).then(data => {
      setInitialResult(data.data);
    });
    setUploadProgress(0);
  }

  useEffect(() => {
    if (file === undefined || file === null) {
      return;
    }

    console.log(file);

    setMode(UploadMode);
    setResults(initialResult);

    const submitData = new FormData();
    submitData.append("file", file, file.fileName);
    axios.request({
      method: 'post',
      url: 'https://opendatalinter.volare.site/',
      data: submitData,
      onUploadProgress: (e) => {
        setUploadProgress(e.loaded / e.total * 100);
        if (e.loaded === e.total) {
          sleep(50).then(() => {
            setMode(ResultMode);
          });
        }
      }
    }).then(data => {
      setResults(data.data);
    }).catch(error => {
    });
  // setInitialResultとhistoryを更新しているが，無限ループにはならないので無視
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [file]);

  return (
    <div className="App">
      <main className="main">
        <div className="mainInner">
          { mode === UploadMode && <UploadProgress uploadProgress={uploadProgress} file={file} /> }
          { mode === InitialMode && <FileUploader setFile={setFile} /> }
          { mode === ResultMode && <ResultList results={results} file={file} goBack={reset} /> }
        </div>
      </main>
      <footer className="footer">
        <p className="footerText">
          総務省から提供されている
          <a href="https://www.soumu.go.jp/main_content/000723626.pdf" target="_blank" rel="noopener noreferrer" className="footerLink">機械判読可能な統計表の統一ルール</a>
          を基に形式をチェックしています
        </p>
      </footer>
    </div>
  );
}

export default App;

