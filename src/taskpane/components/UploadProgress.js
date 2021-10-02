import 'react-dom';
import * as React from "react";

const UploadProgress = (props) => {
  const uploadRate = Math.floor(props.uploadProgress / 100 * 100);
  return (
    <div className="uploadProgress">
      <h2 className="uploadProgressHeadline">アップロード中...</h2>
      <div className="uploadProgressItem">
        <span className="material-icons-outlined uploadProgressIcon">cloud_upload</span>
        <p className="uploadProgressText">
          {props.file !== undefined ? props.file.name : "ファイル名"}
        </p>
        <span className="uploadProgressRate">{uploadRate > 100 ? '100%' : `${uploadRate}%`}</span>
      </div>
      <div className="uploadProgressBarWapper" value={props.uploadProgress} max="100">
        <div className="uploadProgressBar" style={({ width: `${uploadRate}%`})} />
      </div>
    </div>
  );
}

export default UploadProgress;
