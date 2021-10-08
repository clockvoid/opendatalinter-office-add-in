import DragAndDrop from './DragAndDrop'
import { useFilePicker } from 'use-file-picker';
import { useEffect } from 'react';
import * as React from "react";

const FileUploader = (props) => {

  const handleDrop = (newFiles) => {
    props.setFile(newFiles[0]);
  }

  const [openFileSelector, { plainFiles, clear }] = useFilePicker({
    accept: [
      '.csv',
      '.pdf',
      '.xls',
      '.xlsx'
    ],
    multiple: false,
  });

  useEffect(() => {
    if (plainFiles.length > 0) {
      props.setFile(plainFiles[0]);
      clear();
    }
  // clearとpropsを参照しているが，無限ループにはならないので無視
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [plainFiles]);

  const getCurrentFile = async() => {
    try {
      await Excel.run(async (context) => {
        var title = decodeURI(Office.context.document.url).split('/').pop().split('\\').pop();
        Office.context.document.getFileAsync(Office.FileType.Compressed, 
          (result) => {
            if (result.status == "succeeded") {
              var myFile = result.value;
              console.log(myFile);
              getAllSlices(myFile).then(
                (result) => {
                  console.log(result);
                  let file = new Blob([new Uint8Array(result.Data)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                  file['fileName'] = title;
                  props.setFile(file);
                },
                (reject) => {
                  console.log(reject);
                }
              )
            } else {
              console.log(result.error.message);
            }
        });

        return context.sync();
      });
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div className="fileUploader">
      <DragAndDrop handleDrop={handleDrop}>
        <span className="material-icons-outlined fileUploaderIcon">cloud_upload</span>
        <h2 className="fileUploaderHeadline">ファイルをアップロードする</h2>
        <p className="fileUploadertext">CSV，Excel，PDFをドラッグ&ドロップして，形式をチェックします</p>
        <button className="fileUploaderbutton" onClick={openFileSelector}>ファイルを選択</button>
        <button className="fileUploaderbutton" onClick={getCurrentFile}>このファイルをアップロード</button>
      </DragAndDrop>
    </div>
  );
}

export default FileUploader;
