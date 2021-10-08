import * as React from "react";
// images references in the manifest
import "../../../assets/icon-16.png";
import "../../../assets/icon-32.png";
import "../../../assets/icon-80.png";

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
    Office.initialize = () => {
      this.updateCurrentFile(this);
    }
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
            { this.state.mode === ErrorMode && <UnableToLoadFile updateCurrentFile={() => this.updateCurrentFile(this)} /> }
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

