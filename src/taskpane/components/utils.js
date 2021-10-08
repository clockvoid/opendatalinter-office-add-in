
const getAllSlices = (file) => {
  var isError = false;

  return new Promise(async (resolve, reject) => {
    var documentFileData = [];
    for (var sliceIndex = 0; (sliceIndex < file.sliceCount) && !isError; sliceIndex++) {
      var sliceReadPromise = new Promise((sliceResolve, sliceReject) => {
        file.getSliceAsync(sliceIndex, (asyncResult) => {
          if (asyncResult.status === Office.AsyncResultStatus.Succeeded) {
            documentFileData = documentFileData.concat(asyncResult.value.data);
            sliceResolve({
              IsSuccess: true,
              Data: documentFileData
            });
          } else {
            file.closeAsync();
            sliceReject({
              IsSuccess: false,
              ErrorMessage: `Error in reading the slice: ${sliceIndex} of the document`
            });
          }
        });
      });
      await sliceReadPromise.catch((error) => {
        isError = true;
      });
    }

    if (isError || !documentFileData.length) {
      reject('Error while reading document. Please try it again.');
      return;
    }

    file.closeAsync();

    resolve({
      IsSuccess: true,
      Data: documentFileData
    });
  });
}

const getCurrentFile = async(setFile) => {
  try {
    await Excel.run(async (context) => {
      Office.context.document.getFileAsync(Office.FileType.Compressed, 
        (result) => {
          if (result.status == "succeeded") {
            var myFile = result.value;
            console.log(myFile);
            getAllSlices(myFile).then(
              (result) => {
                console.log(result);
                var title = decodeURI(Office.context.document.url).split('/').pop().split('\\').pop();
                let file = new Blob([new Uint8Array(result.Data)], { type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"});
                file['fileName'] = title;
                setFile(file);
              },
              (reject) => {
                console.log(reject);
                setFile(null);
              }
            )
          } else {
            console.log(result.error.message);
            setFile(null);
          }
        });

      return context.sync();
    });
  } catch (error) {
    setFile(null);
    console.error(error);
  }
}

export default getCurrentFile;
