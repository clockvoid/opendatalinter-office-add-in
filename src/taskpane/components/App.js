import * as React from "react";
// images references in the manifest
import "../../../assets/icon-16.png";
import "../../../assets/icon-32.png";
import "../../../assets/icon-80.png";

import { useEffect, useState } from 'react';
import FileUploader from './FileUploader';
import UploadProgress from './UploadProgress';
import UnableToLoadFile from './UnableToLoadFile';
import ResultList from './ResultList.js';
import axios from 'axios';
import getCurrentFile from "./utils";

const InitialMode = 0;
const UploadMode = 1;
const ResultMode = 2;
const ErrorMode = 3;

/* global console, Excel, require */

export default class App extends React.Component {
  constructor(props, context) {
    super(props, context);

    this.state = {
      file: undefined,
      uploadProgress: 0,
      results: [],
      initialResult: [],
      mode: InitialMode
    }
  }

  sleep(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }

  updateCurrentFile(app) {
    try {
      Excel.run(async (context) => {
        app.setState({ file: undefined });
        getCurrentFile((file) => {
          app.setState({file: file});
        });
      });
    } catch(error) {
      this.setState({ mode: ErrorMode });
    }
  }

  componentDidMount() {
    this.updateCurrentFile(this);
  }

  componentDidUpdate(_, prevState) {
    if (prevState.file === this.state.file) {
      return;
    }

    if (this.state.file === undefined) {
      return;
    }

    if (this.state.file === null) {
      this.setState({ mode: ErrorMode });
      return;
    }

    console.log(this.state.file);

    this.setState({ mode: UploadMode });
    this.setState({ results: this.state.initialResult });

    const submitData = new FormData();
    submitData.append("file", this.state.file, this.state.file.fileName);
    axios.request({
      method: 'post',
      url: 'https://opendatalinter.volare.site/',
      data: submitData,
      onUploadProgress: (e) => {
        this.setState({ uploadProgress: (e.loaded / e.total * 100) });
        if (e.loaded === e.total) {
          this.sleep(50).then(() => {
            this.setState({ mode: ResultMode });
          });
        }
      }
    }).then(data => {
      this.setState({ results: data.data });
    }).catch(error => {
      this.setState({ mode: ErrorMode });
    });
  }

  render() {
    return (
      <div className="App">
        <main className="main">
          <div className="mainInner">
            { this.state.mode === UploadMode && <UploadProgress uploadProgress={this.state.uploadProgress} file={this.state.file} /> }
            { this.state.mode === ErrorMode && <UnableToLoadFile /> }
            { this.state.mode === ResultMode && <ResultList results={this.state.results} file={this.state.file} goBack={() => this.updateCurrentFile(this)} /> }
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
}

//function App() {
//
//  const [file, setFile] = useState(undefined);
//  const [uploadProgress, setUploadProgress] = useState(0);
//  const [results, setResults] = useState([]);
//  const [initialResult, setInitialResult] = useState([]);
//  const [mode, setMode] = useState(InitialMode);
//
//  const sleep = (ms) => {
//    return new Promise(resolve => setTimeout(resolve, ms));
//  }
//
//  const reset = () => {
//    setMode(InitialMode);
//    axios.request({
//      method: 'get',
//      url: 'https://opendatalinter.volare.site/'
//    }).then(data => {
//      setInitialResult(data.data);
//    });
//    setUploadProgress(0);
//  }
//
//  useEffect(() => {
//    if (file === undefined || file === null) {
//      return;
//    }
//
//    console.log(file);
//
//    setMode(UploadMode);
//    setResults(initialResult);
//
//    const submitData = new FormData();
//    submitData.append("file", file, file.fileName);
//    axios.request({
//      method: 'post',
//      url: 'https://opendatalinter.volare.site/',
//      data: submitData,
//      onUploadProgress: (e) => {
//        setUploadProgress(e.loaded / e.total * 100);
//        if (e.loaded === e.total) {
//          sleep(50).then(() => {
//            setMode(ResultMode);
//          });
//        }
//      }
//    }).then(data => {
//      setResults(data.data);
//    }).catch(error => {
//    });
//  // setInitialResultとhistoryを更新しているが，無限ループにはならないので無視
//  // eslint-disable-next-line react-hooks/exhaustive-deps
//  }, [file]);
//
//  const displayMessageOnActivated = async () => {
//    try {
//      await Excel.run(async (context) => {
//        var sheet = context.workbook.worksheets.getFirst();
//
//        sheet.onActivated.add((event) => {
//          return Excel.run((context) => {
//            console.log(event.worksheetId);
//            return context.sync();
//          });
//        });
//
//        return context.sync();
//      });
//    } catch (error) {
//      console.log(error);
//    }
//  }
//
//  return (
//    <div className="App">
//      <main className="main">
//        <div className="mainInner">
//          { mode === UploadMode && <UploadProgress uploadProgress={uploadProgress} file={file} /> }
//          { mode === InitialMode && <FileUploader setFile={setFile} /> }
//          { mode === ResultMode && <ResultList results={results} file={file} goBack={reset} /> }
//        </div>
//      </main>
//      <footer className="footer">
//        <p className="footerText">
//          総務省から提供されている
//          <a href="https://www.soumu.go.jp/main_content/000723626.pdf" target="_blank" rel="noopener noreferrer" className="footerLink">機械判読可能な統計表の統一ルール</a>
//          を基に形式をチェックしています
//        </p>
//      </footer>
//    </div>
//  );
//}
//
//export default App;

