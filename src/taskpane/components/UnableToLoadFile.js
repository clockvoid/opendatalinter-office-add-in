import * as React from "react";
import getCurrentFile from "./utils"

const UnableToLoadFile = (props) => {
  return (
    <div className="uploadProgress">
      現在開いているExcelファイルを読み込めませんでした．

      <button className="fileUploaderbutton" onClick={getCurrentFile}>このファイルの形式をチェックする</button>
    </div>
  );
}

export default UnableToLoadFile;
